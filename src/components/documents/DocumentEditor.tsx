import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { EditorToolbar } from './EditorToolbar';
import { Document } from '@/types/document';
import { usePeerManager } from '@/lib/webrtc';
import { Button } from '@/components/ui/button';
import { CollaborationMessage } from '@/types/webrtc';
import { UserPlus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

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
  const editor = useEditor({
    extensions: [StarterKit],
    content: document.customHtml,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateCurrentDocument({ customHtml: html });

      // Use a function to handle the timestamp to avoid impurity warnings in render-like scopes
      const sendUpdate = () => {
        broadcastMessage({
          type: 'content-update',
          payload: html,
          senderId: clientId,
          timestamp: Date.now(),
        });
      };

      sendUpdate();
      onRoomActiveChange();
    },
  });

  const handleMessage = (_peerId: string, data: CollaborationMessage) => {
    if (data.type === 'content-update' && typeof data.payload === 'string') {
      editor?.commands.setContent(data.payload, { emitUpdate: false });
    }
  };

  const {
    connectToPeer,
    broadcastMessage,
    participants,
  } = usePeerManager(
    roomId,
    clientId,
    handleMessage,
    onConnected,
    onDisconnected
  );

  useEffect(() => {
    if (editor && document.customHtml !== editor.getHTML()) {
      editor.commands.setContent(document.customHtml, { emitUpdate: false });
    }
  }, [document.customHtml, editor]);

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <EditorToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
        <Card
          className="bg-white w-full max-w-full sm:max-w-[210mm] min-h-[80vh] sm:min-h-[297mm] p-4 sm:p-[20mm] shadow-xl border border-slate-200 focus:outline-none cursor-text"
          onClick={() => editor?.chain().focus().run()}
        >
          <CardContent className="p-0">
            <EditorContent editor={editor} className="prose prose-slate max-w-none focus:outline-none" />
          </CardContent>
        </Card>
      </div>

      <div className="p-4 border-t border-border bg-background flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground text-center sm:text-left">
            Connected to network
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <TooltipProvider>
              {Array.from(participants).map(peer => (
                <Tooltip key={peer}>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium border-2 border-background cursor-help" title={peer}>
                      {peer.slice(0, 2).toUpperCase()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{peer}</TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
          <Button size="sm" onClick={() => {
            const id = prompt('Enter Peer ID to connect:');
            if (id) connectToPeer(id);
          }}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Peer
          </Button>
        </div>
      </div>
    </div>
  );
};
