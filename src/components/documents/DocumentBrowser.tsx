import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Document } from "@/types/document";
import { FileSearch, FileText, Plus, Trash2 } from "lucide-react";
import React from "react";

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
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
            <p className="text-muted-foreground">
              Manage and organize your collaborative files.
            </p>
          </div>
          <div className="flex w-full justify-center gap-3 sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="text-destructive hover:bg-destructive/10"
            >
              Clear All
            </Button>
            <Button onClick={onCreateNewDocument} className="gap-2">
              <Plus className="h-4 w-4" />
              New Document
            </Button>
          </div>
        </div>

        {documents.length === 0 ? (
          <Card className="bg-muted/30 border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-32 text-center">
              <div className="bg-muted mb-4 rounded-full p-4">
                <FileSearch className="text-muted-foreground h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium">No documents found</h3>
              <p className="text-muted-foreground mb-6 max-w-xs">
                You haven{"'"}t created any documents yet. Start by creating
                your first one!
              </p>
              <Button onClick={onCreateNewDocument} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="group hover:border-primary cursor-pointer transition-all hover:shadow-md"
                onClick={() => onSelectDocument(doc.id)}
              >
                <CardContent className="flex h-full flex-col p-4 sm:p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="bg-primary/10 text-primary rounded-lg p-2">
                      <FileText className="h-6 w-6" />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDocument(doc.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete document</TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h3 className="mb-1 truncate text-sm font-semibold">
                          {doc.fileName}
                        </h3>
                      </TooltipTrigger>
                      <TooltipContent>{doc.fileName}</TooltipContent>
                    </Tooltip>
                    <p className="text-muted-foreground text-xs">
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
