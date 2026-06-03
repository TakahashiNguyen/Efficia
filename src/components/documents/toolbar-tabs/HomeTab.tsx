import React from 'react';
import { Bold, Italic, Strikethrough, List, ListOrdered } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import { ToolbarButton } from './ToolbarButton';
import { TabsContent, TabsTrigger } from '@/components/ui/tabs';

interface HomeTabProps {
  editor: Editor;
}

export function HomeTagTrigger() {
  return (
    <TabsTrigger
      value="home"
      data-testid="toolbar-tab-home"
      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
    >
      Home
    </TabsTrigger>
  )
}

export const HomeTab: React.FC<HomeTabProps> = ({ editor }) => {
  return (
    <TabsContent value="home" className="m-0 p-1 flex items-center gap-1 overflow-x-auto">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={Bold}
        tooltip="Bold"
        testId="toolbar-tool-bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={Italic}
        tooltip="Italic"
        testId="toolbar-tool-italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={Strikethrough}
        tooltip="Strikethrough"
        testId="toolbar-tool-strikethrough"
      />
      <Separator orientation="vertical" className="h-6 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={List}
        tooltip="Bullet List"
        testId="toolbar-tool-bullet-list"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={ListOrdered}
        tooltip="Ordered List"
        testId="toolbar-tool-ordered-list"
      />
    </TabsContent>
  );
};
