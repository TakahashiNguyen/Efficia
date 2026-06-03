"use client";

import { generateClientId } from "@/lib/clientId";
import { RoomJoinEventDetail, UserRole } from "@/types/webrtc";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CollaborationState {
  connected: boolean;
  roomId: string;
  clientId: string;
  participants: string[];
  userRole: UserRole;
  createRoom: (roomId?: string) => void;
  joinRoom: (roomId: string) => void;
  updatePeerRole: (peerId: string, role: UserRole) => void;
}

interface CollaborationContextType {
  state: CollaborationState;
}

const CollaborationContext = createContext<
  CollaborationContextType | undefined
>(undefined);

export function CollaborationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const createRoom = useCallback((id?: string) => {
    const newRoomId = id || Math.random().toString(36).substring(2, 9);
    console.log("Creating room:", newRoomId);

    // In a real implementation, this would trigger PeerJS to start hosting
    // For now, we simulate the room join event for the owner
    window.dispatchEvent(
      new CustomEvent("room-join", {
        detail: { roomId: newRoomId, participants: [] },
      }),
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
      }),
    );

    setState((prev) => ({
      ...prev,
      roomId,
      userRole: "viewer",
    }));
  }, []);

  const updatePeerRole = useCallback((peerId: string, role: UserRole) => {
    // In a real implementation, this would send a message to other peers
    console.log(`Updating peer ${peerId} role to ${role}`);
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

    window.addEventListener("room-join", handleRoomJoin as EventListener);
    return () => {
      window.removeEventListener("room-join", handleRoomJoin as EventListener);
    };
  }, []);

  const value = {
    state: {
      ...state,
      createRoom,
      joinRoom,
      updatePeerRole,
    },
  };

  return <CollaborationContext.Provider value={value}>{children}</CollaborationContext.Provider>;
}

export function useCollaboration(): CollaborationState {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error(
      "useCollaboration must be used within a CollaborationProvider",
    );
  }
  return context.state;
}
