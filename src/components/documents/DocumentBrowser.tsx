import React from 'react';
import { FileText, Plus, Trash2, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Document } from '@/types/document';

interface DocumentBrowserProps {
  documents: Document[];
  onSelectDocument: (id: string) => void;
  onCreateNewDocument: () => void;
  onDeleteDocument: (id: string) => Promise<boolean>;
  onClearAll: () => Promise<void>;
}

export const DocumentBrowser: React.FC<DocumentBrowserProps> = ({
  documents,
  onSelectDocument,
  onCreateNewDocument,
  onDeleteDocument,
  onClearAll,
}) => {
  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
            <p className="text-muted-foreground">Manage and organize your collaborative files.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto justify-center">
            <Button variant="outline" size="sm" onClick={onClearAll} className="text-destructive hover:bg-destructive/10">
              Clear All
            </Button>
            <Button onClick={onCreateNewDocument} className="gap-2">
              <Plus className="w-4 h-4" />
              New Document
            </Button>
          </div>
        </div>

        {documents.length === 0 ? (
          <Card className="border-2 border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-32 text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <FileSearch className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No documents found</h3>
              <p className="text-muted-foreground mb-6 max-w-xs">
                You haven{'\''}t created any documents yet. Start by creating your first one!
              </p>
              <Button onClick={onCreateNewDocument} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="group cursor-pointer hover:border-primary transition-all hover:shadow-md"
                onClick={() => onSelectDocument(doc.id)}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <FileText className="w-6 h-6" />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDocument(doc.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete document</TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h3 className="font-semibold text-sm truncate mb-1">
                          {doc.fileName}
                        </h3>
                      </TooltipTrigger>
                      <TooltipContent>{doc.fileName}</TooltipContent>
                    </Tooltip>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
