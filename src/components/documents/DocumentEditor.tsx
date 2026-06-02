import React, { useState, useCallback } from 'react';
import { usePeerManager } from '@/lib/webrtc';
import { Document } from '@/types/document';
import { CollaborationMessage } from '@/types/webrtc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentEditorProps {
  document: Document;
  roomId: string;
  clientId: string;
  onConnected: (peerId: string) => void;
  onDisconnected: (peerId: string) => void;
  onRoomActiveChange: () => void;
  updateCurrentDocument: (updates: Partial<Document>) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  roomId,
  clientId,
  onConnected,
  onDisconnected,
  onRoomActiveChange,
  updateCurrentDocument,
}) => {
  const [content, setContent] = useState(document.customHtml);

  const handleMessage = useCallback((peerId: string, data: CollaborationMessage) => {
    console.log(`Message from ${peerId}:`, data);
    if (data.type === 'content-update' && typeof data.payload === 'string') {
      setContent(data.payload);
    }
  }, []);

  const {
    connectToPeer,
    broadcastMessage,
    participants,
    connectionStates
  } = usePeerManager(
    roomId,
    clientId,
    handleMessage,
    onConnected,
    onDisconnected
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Update the document state in the hook (which triggers auto-save)
    updateCurrentDocument({ customHtml: newContent });

    broadcastMessage({
      type: 'content-update',
      payload: newContent,
      senderId: clientId,
      timestamp: Date.now(),
    });
    onRoomActiveChange();
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Document: {document.fileName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Room: {roomId}</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium">{participants.size} Peers</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-[60vh] p-4 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring"
            value={content}
            onChange={handleContentChange}
            placeholder="Start collaborating on your document..."
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium">Connected Peers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(participants).map(peerId => (
                <span key={peerId} className="px-2 py-1 text-[10px] bg-secondary rounded-full">
                  {peerId}
                </span>
              ))}
              {participants.size === 0 && (
                <span className="text-xs text-muted-foreground">No peers connected.</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium">Peer Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <input
              type="text"
              placeholder="Peer ID"
              className="flex-1 px-2 py-1 text-xs border rounded"
              id="peer-id-input"
            />
            <button
              onClick={() => {
                const input = window.document.getElementById('peer-id-input') as HTMLInputElement;
                if (input?.value) {
                  connectToPeer(input.value);
                  input.value = '';
                }
              }}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Connect
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
