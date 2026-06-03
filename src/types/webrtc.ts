export interface RoomConfig {
  password?: string;
}

export type UserRole = "owner" | "editor" | "viewer";

export interface PeerConnectionState {
  connected: boolean;
  role: UserRole;
}

export interface RoomState {
  roomId: string;
  participants: Set<string>;
  config: RoomConfig;
  connectionStates: Map<string, PeerConnectionState>;
  isRoomActive: boolean;
}

export interface RoomJoinEventDetail {
  roomId: string;
  password?: string;
  participants: string[];
}

export interface CollaborationMessage {
  type: "content-update" | "cursor-move" | "presence-update" | "permission-update";
  payload: string | number | boolean | Record<string, unknown>;
  senderId: string;
  timestamp: number;
}

export interface ConnectionStateEventDetail {
  type: "connection-state" | "connection-closed";
  peerId: string;
  data?: CollaborationMessage;
}
