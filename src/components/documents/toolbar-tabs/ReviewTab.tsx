import { Separator } from "@/components/ui/separator";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@tiptap/react";
import { Redo, Undo } from "lucide-react";
import React from "react";

import { ToolbarButton } from "./ToolbarButton";

interface ReviewTabProps {
  editor: Editor;
}

export function ReviewTabTrigger() {
  return <TabsTrigger value="review">Review</TabsTrigger>;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({ editor }) => {
  return (
    <TabsContent
      value="review"
      className="m-0 flex items-center gap-1 overflow-x-auto p-1"
    >
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        isActive={false}
        icon={Undo}
        tooltip="Undo"
        testId="toolbar-tool-undo"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        isActive={false}
        icon={Redo}
        tooltip="Redo"
        testId="toolbar-tool-redo"
      />
    </TabsContent>
  );
};
