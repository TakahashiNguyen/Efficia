'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDocument } from '@/hooks/useDocument';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { useCollaboration } from '@/hooks/useCollaboration';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function DocumentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const {
    getCurrentDocument,
    updateCurrentDocument,
  } = useDocument();

  const currentDocument = id ? getCurrentDocument(id) : null;

  const { connected, roomId, clientId } = useCollaboration(currentDocument?.fileName);

  if (!currentDocument) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-2 p-2 border-b">
        <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Documents
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{currentDocument.fileName}</span>
          <span className="text-muted-foreground">
            ({connected ? 'Connected' : 'Disconnected'})
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <DocumentEditor
          document={currentDocument}
          roomId={roomId!}
          clientId={clientId!}
          onConnected={() => {}}
          onDisconnected={() => {}}
          onRoomActiveChange={() => {}}
          updateCurrentDocument={updateCurrentDocument}
        />
      </div>
    </div>
  );
}
