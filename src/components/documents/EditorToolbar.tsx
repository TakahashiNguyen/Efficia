import { Tabs, TabsList } from "@/components/ui/tabs";
import { Editor } from "@tiptap/react";
import React from "react";

import {
  CollaborationTab,
  CollaborationTabTrigger,
} from "./toolbar-tabs/CollaborationTab";
import { HomeTab, HomeTagTrigger } from "./toolbar-tabs/HomeTab";
import { ReviewTab, ReviewTabTrigger } from "./toolbar-tabs/ReviewTab";

interface EditorToolbarProps {
  editor: Editor | null;
  collaborationProps?: {
    participants: string[];
    onConnectToPeer: (id: string) => void;
    clientId: string;
    isConnected: boolean;
  };
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  collaborationProps,
}) => {
  if (!editor) return null;

  return (
    <div
      className="bg-background border-border sticky top-0 z-10 w-full border-b"
      data-testid="editor-toolbar"
    >
      <Tabs defaultValue="home" className="w-full">
        <TabsList
          className={
            /* tw */ `
              h-auto w-full justify-start rounded-none border-b border-none
              bg-transparent p-0 px-2
            `
          }
        >
          <HomeTagTrigger />
          <ReviewTabTrigger />
          <CollaborationTabTrigger />
        </TabsList>

        <HomeTab editor={editor} />
        <ReviewTab editor={editor} />

        {collaborationProps && (
          <CollaborationTab
            participants={collaborationProps.participants}
            onConnectToPeer={collaborationProps.onConnectToPeer}
            clientId={collaborationProps.clientId}
            isConnected={collaborationProps.isConnected}
          />
        )}
      </Tabs>
    </div>
  );
};
