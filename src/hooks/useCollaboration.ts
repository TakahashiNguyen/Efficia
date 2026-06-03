import { generateClientId } from "@/lib/clientId";
import {
  ConnectionStateEventDetail,
  RoomJoinEventDetail,
} from "@/types/webrtc";
import { useEffect, useState } from "react";

export interface CollaborationState {
  connected: boolean;
  roomId?: string;
  clientId: string;
  participants: string[];
}

export function useCollaboration(roomId?: string): CollaborationState {
  const [state, setState] = useState<CollaborationState>({
    connected: false,
    roomId: roomId || "default-room",
    clientId: generateClientId(),
    participants: [],
  });

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

    // Assuming there might be an event for participant changes
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

  return state;
}
