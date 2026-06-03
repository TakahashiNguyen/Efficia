import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import { ToolbarButton } from './ToolbarButton';
import { TabsContent, TabsTrigger } from '@/components/ui/tabs';

interface ReviewTabProps {
  editor: Editor;
}

export function ReviewTabTrigger() {
  return (
    <TabsTrigger
      value="review"
      data-testid="toolbar-tab-review"
      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
    >
      Review
    </TabsTrigger>
  )
}

export const ReviewTab: React.FC<ReviewTabProps> = ({ editor }) => {
  return (
    <TabsContent value="review" className="m-0 p-1 flex items-center gap-1 overflow-x-auto">

      <Separator orientation="vertical" className="h-6 mx-1" />
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
