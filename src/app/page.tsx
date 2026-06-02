'use client';

import React, { useState } from 'react';
import { useDocument } from '@/hooks/useDocument';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { DocumentBrowser } from '@/components/documents/DocumentBrowser';
import { useCollaboration } from '@/hooks/useCollaboration';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function Home() {
  const {
    documents,
    currentDocumentId,
    loading,
    createNewDocument,
    getCurrentDocument,
    updateCurrentDocument,
    deleteDocument,
    clearAllDocuments,
    selectDocument,
  } = useDocument();

  const [view, setView] = useState<'browsing' | 'editing'>('browsing');

  const currentDocument = getCurrentDocument();
  const { connected, roomId, clientId } = useCollaboration(currentDocument?.fileName);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (view === 'browsing') {
    return (
      <main className="min-h-screen bg-background">
        <DocumentBrowser
          documents={documents}
          onSelectDocument={(id) => {
            selectDocument(id);
            setView('editing');
          }}
          onCreateNewDocument={() => {
            const doc = createNewDocument();
            selectDocument(doc.id);
            setView('editing');
          }}
          onDeleteDocument={deleteDocument}
          onClearAll={clearAllDocuments}
        />
      </main>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-4 h-14 border-b border-border bg-background">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setView('browsing')} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Files
          </Button>
          <h1 className="text-sm font-medium truncate max-w-[200px]">
            {currentDocument?.fileName || 'Untitled Document'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            {connected ? 'Collaborating' : 'Offline'}
          </div>
          <span className="text-xs px-2 py-1 bg-muted rounded">Room: {roomId || 'None'}</span>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {currentDocument ? (
          <DocumentEditor
            document={currentDocument}
            roomId={roomId || ''}
            clientId={clientId}
            onConnected={(peerId) => console.log(`Connected to peer: ${peerId}`)}
            onDisconnected={(peerId) => console.log(`Disconnected from peer: ${peerId}`)}
            onRoomActiveChange={() => {
              // Handle room activity if needed
            }}
            updateCurrentDocument={updateCurrentDocument}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No document selected.</p>
          </div>
        )}
      </main>
    </div>
  );
}
