import {
  CollaborationMessage,
  ConnectionStateEventDetail,
  PeerConnectionState,
  RoomConfig,
  RoomJoinEventDetail,
  RoomState,
} from "@/types/webrtc";
import { DataConnection, Peer } from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Peer Manager Hook
 * Handles PeerJS initialization, connections, and data channel management.
 */
export function usePeerManager(
  roomId: string,
  clientId: string,
  onMessageReceived: (peerId: string, data: CollaborationMessage) => void,
  onPeerConnected: (peerId: string) => void,
  onPeerDisconnected: (peerId: string) => void,
) {
  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const [connectionStates, setConnectionStates] = useState<
    Map<string, PeerConnectionState>
  >(new Map());
  const [participants, setParticipants] = useState<Set<string>>(new Set());

  const setupConnection = useCallback((conn: DataConnection) => {
    conn.on("open", () => {
      connectionsRef.current.set(conn.peer, conn);
      setParticipants((prev) => new Set(prev).add(conn.peer));
      setConnectionStates((prev) => {
        const next = new Map(prev);
        next.set(conn.peer, { connected: true, role: "viewer" });
        return next;
      });
      onPeerConnected(conn.peer);
    });

    conn.on("data", (data: unknown) => {
      if (typeof data === "object" && data !== null) {
        const msg = data as CollaborationMessage;

        if (msg.type === "permission-update") {
          const { peerId, role } = msg.payload as { peerId: string; role: UserRole };
          setConnectionStates((prev) => {
            const next = new Map(prev);
            const state = next.get(peerId);
            if (state) {
              next.set(peerId, { ...state, role });
            }
            return next;
          });
          return;
        }

        // Permission Validation: ignore updates from viewers
        if (msg.type === "content-update" || msg.type === "cursor-move") {
          const peerState = connectionStates.get(msg.senderId);
          if (peerState?.role === "viewer") {
            console.warn("Blocked update from viewer:", msg.senderId);
            return;
          }
        }

        onMessageReceived(conn.peer, msg);
      }
    });

    conn.on("close", () => {
      connectionsRef.current.delete(conn.peer);
      setParticipants((prev) => {
        const next = new Set(prev);
        next.delete(conn.peer);
        return next;
      });
      setConnectionStates((prev) => {
        const next = new Map(prev);
        next.delete(conn.peer);
        return next;
      });
      onPeerDisconnected(conn.peer);
    });
  }, [onMessageReceived, onPeerConnected, onPeerDisconnected]);

  useEffect(() => {
    const peer = new Peer(clientId, {
      debug: 1,
    });

    peerRef.current = peer;

    peer.on("connection", (conn) => {
      console.log("Incoming connection from:", conn.peer);
      setupConnection(conn);
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
    });

    return () => {
      peer.destroy();
    };
  }, [clientId, setupConnection]);

  const connectToPeer = (peerId: string) => {
    if (peerRef.current) {
      const conn = peerRef.current.connect(peerId);
      setupConnection(conn);
    }
  };

  const sendMessage = (peerId: string, data: CollaborationMessage) => {
    const conn = connectionsRef.current.get(peerId);
    if (conn) {
      conn.send(data);
    } else {
      console.error("No connection found for peer:", peerId);
    }
  };

  const broadcastMessage = (data: CollaborationMessage) => {
    connectionsRef.current.forEach((conn) => {
      conn.send(data);
    });
  };

  return {
    connectToPeer,
    sendMessage,
    broadcastMessage,
    connectionStates,
    participants,
  };
}

/**
 * Room manager for handling room membership and synchronization
 */
export function useRoomManager(
  roomId: string,
  clientId: string,
  onConnected: (peerId: string) => void,
  onDisconnected: (peerId: string) => void,
  onMessage: (peerId: string, data: CollaborationMessage) => void,
): RoomState {
  const { connectionStates, participants } = usePeerManager(
    roomId,
    clientId,
    onMessage,
    onConnected,
    onDisconnected,
  );

  return {
    roomId,
    participants,
    config: { password: "" },
    connectionStates,
    isRoomActive: true,
  };
}

/**
 * Room configuration state with password validation
 */
export function useRoomConfig(): RoomConfig {
  const [config, setConfig] = useState<RoomConfig>({ password: "" });

  useEffect(() => {
    const handleRoomJoin = (event: CustomEvent<RoomJoinEventDetail>) => {
      if (event.detail && event.detail.password) {
        setConfig({ password: event.detail.password });
      }
    };

    window.addEventListener("room-join", handleRoomJoin as EventListener);
    return () =>
      window.removeEventListener("room-join", handleRoomJoin as EventListener);
  }, []);

  return config;
}

/**
 * Connection state manager for tracking peer connections in a room
 */
export function useConnectionStates(): Map<string, { connected: boolean }> {
  const [states, setStates] = useState<Map<string, { connected: boolean }>>(
    new Map(),
  );

  useEffect(() => {
    const handleConnectionState = (
      event: CustomEvent<ConnectionStateEventDetail>,
    ) => {
      if (event.detail && event.detail.type === "connection-state") {
        setStates((prev) => {
          const next = new Map(prev);
          next.set("local", { connected: true });
          return next;
        });
      }
    };

    window.addEventListener(
      "connection-state",
      handleConnectionState as EventListener,
    );
    return () =>
      window.removeEventListener(
        "connection-state",
        handleConnectionState as EventListener,
      );
  }, []);

  return states;
}
