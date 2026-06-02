import React from 'react';
import { Document } from '@/types/document';
import { Button } from '@/components/ui/button';

interface DocumentListProps {
  documents: Document[];
  currentDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onCreateNewDocument: () => void;
  onDeleteDocument: () => void;
  onClearAllDocuments: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  currentDocumentId,
  onSelectDocument,
  onCreateNewDocument,
  onDeleteDocument,
  onClearAllDocuments,
}) => {
  return (
    <div className="flex flex-col p-4 border-r border-border bg-sidebar text-sidebar-foreground">
      <h2 className="text-xl font-semibold mb-4">Documents</h2>
      <Button onClick={onCreateNewDocument} className="mb-2 w-full">New Document</Button>
      <div className="flex-1 overflow-auto">
        {documents.length === 0 ? (
          <p className="text-muted-foreground">No documents yet.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id}>
                <button
                  className={`w-full text-left p-2 rounded ${doc.id === currentDocumentId ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-muted'}`}
                  onClick={() => onSelectDocument(doc.id)}
                >
                  {doc.fileName}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {documents.length > 0 && (
          <Button variant="destructive" onClick={onDeleteDocument} className="w-full">Delete Current</Button>
        )}
        <Button variant="outline" onClick={onClearAllDocuments} className="w-full">Clear All</Button>
      </div>
    </div>
  );
};
