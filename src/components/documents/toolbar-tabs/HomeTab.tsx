import { Separator } from "@/components/ui/separator";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@tiptap/react";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import React from "react";

import { ToolbarButton } from "./ToolbarButton";

interface HomeTabProps {
  editor: Editor;
}

export function HomeTagTrigger() {
  return (
    <TabsTrigger
      value="home"
      data-testid="toolbar-tab-home"
      className={
        /* tw */ `
          data-[state=active]:border-primary rounded-none border-b-2
          border-transparent data-[state=active]:bg-transparent
        `
      }
    >
      Home
    </TabsTrigger>
  );
}

export const HomeTab: React.FC<HomeTabProps> = ({ editor }) => {
  return (
    <TabsContent
      value="home"
      className="m-0 flex items-center gap-1 overflow-x-auto p-1"
    >
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon={Bold}
        tooltip="Bold"
        testId="toolbar-tool-bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon={Italic}
        tooltip="Italic"
        testId="toolbar-tool-italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        icon={Strikethrough}
        tooltip="Strikethrough"
        testId="toolbar-tool-strikethrough"
      />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        icon={List}
        tooltip="Bullet List"
        testId="toolbar-tool-bullet-list"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        icon={ListOrdered}
        tooltip="Ordered List"
        testId="toolbar-tool-ordered-list"
      />
    </TabsContent>
  );
};
