import { Separator } from "@/components/ui/separator";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import React from "react";

import { ToolbarButton } from "./ToolbarButton";

interface HomeTabProps {
  editor: Editor;
}

export function HomeTagTrigger() {
  return <TabsTrigger value="home">Home</TabsTrigger>;
}

export const HomeTab: React.FC<HomeTabProps> = ({ editor }) => {
  return (
    <TabsContent value="home" className={cn("flex items-center")}>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon={Bold}
        tooltip="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon={Italic}
        tooltip="Italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        icon={Strikethrough}
        tooltip="Strikethrough"
      />
      <Separator orientation="vertical" />
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
      />
    </TabsContent>
  );
};
