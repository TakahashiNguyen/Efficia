'use client';

import { useState, useCallback } from 'react';
import { useDocument } from '@/hooks/useDocument';
import { docxToCustomHtml } from '@/lib/parsers/docxParser';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { DocumentList } from '@/components/documents/DocumentList';
import { useCollaboration } from '@/hooks/useCollaboration';
import { Document } from '@/types/document';

export default function Home() {
  const {
    documents,
    currentDocumentId,
    loading,
    createNewDocument,
    getCurrentDocument,
    updateCurrentDocument,
    deleteCurrentDocument,
    clearAllDocuments,
    selectDocument,
  } = useDocument();

  const currentDocument = getCurrentDocument();
  const { connected, roomId, clientId } = useCollaboration();

  const handleDocumentUpdate = useCallback((updates: Partial<Document>) => {
    updateCurrentDocument(updates);
  }, [updateCurrentDocument]);

  const handleDocxUpload = useCallback(async (file: File) => {
    if (!currentDocument) return;

    const arrayBuffer = await file.arrayBuffer();
    const { success, customHtml, error } = await docxToCustomHtml(arrayBuffer);

    if (success) {
      updateCurrentDocument({ customHtml, renderedHtml: customHtml, fileName: file.name });
    } else {
      console.error("DOCX upload failed:", error);
      alert(`Failed to process DOCX: ${error}`);
    }
  }, [currentDocument, updateCurrentDocument]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      ) : (
        <>
          <DocumentList
            documents={documents}
            currentDocumentId={currentDocumentId}
            onSelectDocument={selectDocument}
            onCreateNewDocument={createNewDocument}
            onDeleteDocument={deleteCurrentDocument}
            onClearAllDocuments={clearAllDocuments}
          />
          <div className="flex flex-col flex-1">
            {currentDocument ? (
              <DocumentEditor
                document={currentDocument}
                roomId={roomId || 'default-room'}
                clientId={clientId}
                onConnected={(peerId) => console.log(`Connected to peer: ${peerId}`)}
                onDisconnected={(peerId) => console.log(`Disconnected from peer: ${peerId}`)}
                onRoomActiveChange={() => {
                  // Handle room activity if needed
                }}
                updateCurrentDocument={updateCurrentDocument}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">Select a document or create a new one.</p>
              </div>
            )}
            <div className="p-2 border-t border-border bg-muted text-muted-foreground text-sm">
              Status: {connected ? 'Connected' : 'Disconnected'} | Your ID: {clientId} | Room: {roomId || 'None'}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
