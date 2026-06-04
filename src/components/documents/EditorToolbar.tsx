import { Tabs, TabsList } from "@/components/ui/tabs";
import { Editor } from "@tiptap/react";
import React from "react";

import {
  CollaborationTab,
  CollaborationTabProps,
  CollaborationTabTrigger,
} from "./toolbar-tabs/CollaborationTab";
import { HomeTab, HomeTagTrigger } from "./toolbar-tabs/HomeTab";
import { ReviewTab, ReviewTabTrigger } from "./toolbar-tabs/ReviewTab";

interface EditorToolbarProps {
  editor: Editor | null;
  collaborationProps: CollaborationTabProps;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  collaborationProps,
}) => {
  if (!editor) return null;

  return (
    <Tabs
      defaultValue="home"
      className={/* tw */ `bg-background border-border h-21 w-full border-b`}
    >
      <TabsList variant="line">
        <HomeTagTrigger />
        <ReviewTabTrigger />
        <CollaborationTabTrigger />
      </TabsList>

      <HomeTab editor={editor} />
      <ReviewTab editor={editor} />

      <CollaborationTab {...collaborationProps} />
    </Tabs>
  );
};
