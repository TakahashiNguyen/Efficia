import React from 'react';
import { Editor } from '@tiptap/react';
import { Tabs, TabsList, } from '@/components/ui/tabs';
import { HomeTab, HomeTagTrigger } from './toolbar-tabs/HomeTab';
import { ReviewTab, ReviewTabTrigger } from './toolbar-tabs/ReviewTab';

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="bg-background border-b border-border sticky top-0 z-10 w-full" data-testid="editor-toolbar">
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-none bg-transparent h-auto p-0 px-2">
          <HomeTagTrigger />

          <ReviewTabTrigger />
        </TabsList>

        <HomeTab editor={editor} />

        <ReviewTab editor={editor} />
      </Tabs>
    </div>
  );
};

