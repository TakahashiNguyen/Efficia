"use client";

import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { Button } from "@/components/ui/button";
import { useCollaboration } from "@/hooks/useCollaboration";
import { useDocument } from "@/hooks/useDocument";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function DocumentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const { getCurrentDocument, updateCurrentDocument } = useDocument();

  const currentDocument = id ? getCurrentDocument(id) : null;

  const { connected, roomId, clientId } = useCollaboration(
    currentDocument?.fileName,
  );

  if (!currentDocument) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center gap-2 border-b p-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Documents
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{currentDocument.fileName}</span>
          <span className="text-muted-foreground">
            ({connected ? "Connected" : "Disconnected"})
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <DocumentEditor
          document={currentDocument}
          roomId={roomId!}
          clientId={clientId!}
          updateCurrentDocument={updateCurrentDocument}
        />
      </div>
    </div>
  );
}
