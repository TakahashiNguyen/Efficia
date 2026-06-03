import { useCollaboration } from "@/hooks/useCollaboration";
import { DocumentEditorProps } from "@/types/document";
import { UserRole } from "@/types/webrtc";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

import { EditorToolbar } from "./EditorToolbar";

export const DocumentEditor: React.FC<
  DocumentEditorProps & {
    participants: string[];
    userRole: UserRole;
  }
> = ({
  document,
  roomId,
  clientId,
  participants,
  userRole,
  updateCurrentDocument,
}) => {
  const { connected } = useCollaboration();

  const editor = useEditor({
    extensions: [StarterKit],
    content: document.customHtml,
    immediatelyRender: true,
    editable: userRole !== "viewer",
    onUpdate: ({ editor }) => {
      updateCurrentDocument({
        customHtml: editor.getHTML(),
        updatedAt: new Date(),
      });
    },
  });

  if (!editor) {
    return (
      <div className="flex h-full items-center justify-center">
        <div
          className={
            /* tw */ `
              border-primary h-8 w-8 animate-spin rounded-full border-4
              border-t-transparent
            `
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-background flex h-full flex-col">
      <EditorToolbar
        editor={editor}
        collaborationProps={{
          participants,
          onConnectToPeer: () => {}, // Implement as needed
          clientId,
          isConnected: connected,
        }}
      />

      <div className="bg-muted/30 flex flex-1 justify-center overflow-y-auto p-8">
        <div
          className={
            /* tw */ `
              bg-background min-h-[297mm] w-full max-w-4xl p-[20mm] shadow-lg
              transition-all duration-300
            `
          }
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Connection status bar at the bottom */}
      <div
        className={
          /* tw */ `
            px-4 py-1 text-[10px] text-white transition-colors
            ${connected ? "bg-green-600" : "bg-red-600"}
          `
        }
      >
        {userRole === "owner"
          ? `Room ID for joining: ${roomId}`
          : /* tx */ `
              ${connected ? "CONNECTED" : "DISCONNECTED"} | Role: ${userRole} |
              Client: ${clientId}
            `.trim()}
      </div>
    </div>
  );
};
