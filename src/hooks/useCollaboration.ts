import { generateClientId } from "@/lib/clientId";
import {
  ConnectionStateEventDetail,
  RoomJoinEventDetail,
  UserRole,
} from "@/types/webrtc";
import { useEffect, useState, useCallback } from "react";

export interface CollaborationState {
  connected: boolean;
  roomId?: string;
  clientId: string;
  participants: string[];
  userRole: UserRole;
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
}

export function useCollaboration(): CollaborationState {
  const [state, setState] = useState<{
    connected: boolean;
    roomId: string;
    clientId: string;
    participants: string[];
    userRole: UserRole;
  }>({
    connected: false,
    roomId: "",
    clientId: generateClientId(),
    participants: [],
    userRole: "viewer",
  });

  const createRoom = useCallback(() => {
    const newRoomId = Math.random().toString(36).substring(2, 9);
    console.log("Creating room:", newRoomId);

    // In a real implementation, this would trigger PeerJS to start hosting
    // For now, we simulate the room join event for the owner
    window.dispatchEvent(
      new CustomEvent("room-join", {
        detail: { roomId: newRoomId, participants: [] },
      })
    );

    setState((prev) => ({
      ...prev,
      roomId: newRoomId,
      userRole: "owner",
    }));
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    console.log("Joining room:", roomId);

    // Simulate joining a room
    window.dispatchEvent(
      new CustomEvent("room-join", {
        detail: { roomId, participants: [] },
      })
    );

    setState((prev) => ({
      ...prev,
      roomId,
      userRole: "viewer",
    }));
  }, []);

  useEffect(() => {
    const handleRoomJoin = (event: CustomEvent<RoomJoinEventDetail>) => {
      console.log("Room joined:", event.detail.roomId);
      setState((prev) => ({
        ...prev,
        connected: true,
        roomId: event.detail.roomId,
        participants: event.detail.participants || [],
      }));
    };

    const handleConnectionState = (
      event: CustomEvent<ConnectionStateEventDetail>,
    ) => {
      if (event.detail.type === "connection-state") {
        setState((prev) => ({ ...prev, connected: true }));
      } else if (event.detail.type === "connection-closed") {
        setState((prev) => ({ ...prev, connected: false }));
      }
    };

    const handleParticipantsUpdate = (
      event: CustomEvent<{ participants: string[] }>,
    ) => {
      setState((prev) => ({
        ...prev,
        participants: event.detail.participants,
      }));
    };

    window.addEventListener("room-join", handleRoomJoin as EventListener);
    window.addEventListener(
      "connection-state",
      handleConnectionState as EventListener,
    );
    window.addEventListener(
      "participants-update",
      handleParticipantsUpdate as EventListener,
    );

    return () => {
      window.removeEventListener("room-join", handleRoomJoin as EventListener);
      window.removeEventListener(
        "connection-state",
        handleConnectionState as EventListener,
      );
      window.removeEventListener(
        "participants-update",
        handleParticipantsUpdate as EventListener,
      );
    };
  }, []);

  return {
    connected: state.connected,
    roomId: state.roomId,
    clientId: state.clientId,
    participants: state.participants,
    userRole: state.userRole,
    createRoom,
    joinRoom,
  };
}
