"use client";

import { DocumentBrowser } from "@/components/documents/DocumentBrowser";
import { useDocument } from "@/hooks/useDocument";
import { useRouter } from "next/navigation";
import React from "react";

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
    <main className="bg-background min-h-screen">
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
