import { useEffect, useRef, useState } from 'react';
import { generateClientId } from '@/lib/clientId';
import { RoomJoinEventDetail, ConnectionStateEventDetail } from '@/types/webrtc';

export interface CollaborationState {
  connected: boolean;
  roomId?: string;
  clientId: string;
}

export function useCollaboration(): CollaborationState {
  const clientId = useRef(generateClientId());
  const [state, setState] = useState<CollaborationState>({
    connected: false,
    clientId: clientId.current
  });

  useEffect(() => {
    const handleRoomJoin = (event: CustomEvent<RoomJoinEventDetail>) => {
      console.log('Room joined:', event.detail.roomId);
      setState(prev => ({
        ...prev,
        connected: true,
        roomId: event.detail.roomId
      }));
    };

    const handleConnectionState = (event: CustomEvent<ConnectionStateEventDetail>) => {
      if (event.detail.type === 'connection-state') {
        setState(prev => ({ ...prev, connected: true }));
      } else if (event.detail.type === 'connection-closed') {
        setState(prev => ({ ...prev, connected: false }));
      }
    };

    window.addEventListener('room-join', handleRoomJoin as EventListener);
    window.addEventListener('connection-state', handleConnectionState as EventListener);

    return () => {
      window.removeEventListener('room-join', handleRoomJoin as EventListener);
      window.removeEventListener('connection-state', handleConnectionState as EventListener);
    };
  }, []);

  return state;
}
