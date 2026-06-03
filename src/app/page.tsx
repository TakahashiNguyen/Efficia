"use client"

import { CollaborationControl } from "@/components/collaboration/CollaborationControl";
import { DocumentBrowser } from "@/components/documents/DocumentBrowser";
import { useCollaboration } from "@/hooks/useCollaboration";
import { useDocument } from "@/hooks/useDocument";
import { useRouter } from "next/navigation";

export default function Home() {
  const {
    documents,
    createNewDocument,
    deleteDocument,
    clearAllDocuments,
    selectDocument,
  } = useDocument();

  const router = useRouter();
  const { createRoom, joinRoom } = useCollaboration();

  const handleSelectDocument = (id: string) => {
    selectDocument(id);
    router.push(`/doc?id=${id}`);
  };

  const handleCreateNewDocument = () => {
    const doc = createNewDocument();
    router.push(`/doc?id=${doc.id}`);
  };

  return (
    <main className="bg-background flex min-h-screen flex-col">
      <div className="bg-muted/20 flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-bold">Documents</h1>
        <CollaborationControl
          onCreateRoom={() => {
            const rid = createRoom();
            // Maybe redirect to a specific doc or just stay here
          }}
          onJoinRoom={(rid) => {
            joinRoom(rid);
            // After joining, we might want to go to a default doc or wait for selection
          }}
        />
      </div>
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
