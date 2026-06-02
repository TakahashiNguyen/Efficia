import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Strikethrough, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ElementType;
  tooltip: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive,
  icon: Icon,
  tooltip,
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onClick}
          className="h-8 w-8 p-0"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 p-1 bg-background border-b border-border sticky top-0 z-10 w-full justify-start overflow-x-auto">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={Bold}
        tooltip="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={Italic}
        tooltip="Italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={Strikethrough}
        tooltip="Strikethrough"
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={List}
        tooltip="Bullet List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={ListOrdered}
        tooltip="Ordered List"
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        isActive={false}
        icon={Undo}
        tooltip="Undo"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        isActive={false}
        icon={Redo}
        tooltip="Redo"
      />
    </div>
  );
};
