'use client';

import React from 'react';
import { useDocument } from '@/hooks/useDocument';
import { DocumentBrowser } from '@/components/documents/DocumentBrowser';
import { useRouter } from 'next/navigation';

export default function Home() {
  const {
    documents,
    createNewDocument,
    deleteDocument,
    clearAllDocuments,
    selectDocument,
  } = useDocument();

  const router = useRouter();

  const handleSelectDocument = (id: string) => {
    selectDocument(id);
    router.push(`/doc?id=${id}`);
  };

  const handleCreateNewDocument = () => {
    const doc = createNewDocument();
    router.push(`/doc?id=${doc.id}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <DocumentBrowser
        documents={documents}
        onSelectDocument={handleSelectDocument}
        onCreateNewDocument={handleCreateNewDocument}
        onDeleteDocument={deleteDocument}
        onClearAll={clearAllDocuments}
      />
    </main>
  );
}
