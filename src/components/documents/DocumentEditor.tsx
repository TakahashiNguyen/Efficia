import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/react';
import { EditorToolbar } from './EditorToolbar';
import { Document } from '@/types/document';
import { usePeerManager } from '@/lib/webrtc';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

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
  const handleMessage = (peerId: string, data: any) => {
    if (data.type === 'content-update' && typeof data.payload === 'string') {
      editor?.commands.setContent(data.payload, false);
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

  const editor = useEditor({
    extensions: [StarterKit],
    content: document.customHtml,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateCurrentDocument({ customHtml: html });
      broadcastMessage({
        type: 'content-update',
        payload: html,
        senderId: clientId,
        timestamp: Date.now(),
      });
      onRoomActiveChange();
    },
  });

  useEffect(() => {
    if (editor && document.customHtml !== editor.getHTML()) {
      editor.commands.setContent(document.customHtml, false);
    }
  }, [document.customHtml, editor]);

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <EditorToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[20mm] shadow-xl border border-slate-200 focus:outline-none"
             onClick={() => editor?.chain().focus().run()}>
          <EditorContent editor={editor} className="prose prose-slate max-w-none focus:outline-none" />
        </div>
      </div>

      <div className="p-4 border-t border-border bg-background flex gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">
            Connected to network
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {Array.from(participants).map(peer => (
              <div key={peer} className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium border-2 border-background" title={peer}>
                {peer.slice(0, 2).toUpperCase()}
              </div>
            ))}
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
