"use client";

import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { Button } from "@/components/ui/button";
import { useCollaboration } from "@/hooks/useCollaboration";
import { useDocument } from "@/hooks/useDocument";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function DocumentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const { getCurrentDocument, updateCurrentDocument } = useDocument();
  const currentDocument = id ? getCurrentDocument(id) : null;

  const {
    connected,
    roomId,
    clientId,
    participants,
    userRole,
    createRoom,
    joinRoom,
  } = useCollaboration();

  useEffect(() => {
    if (currentDocument && !connected) {
      if (!currentDocument.isShared) {
        createRoom(currentDocument.id);
      } else {
        joinRoom(currentDocument.id);
      }
    }
  }, [currentDocument, connected, createRoom, joinRoom]);

  if (!currentDocument) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div
            className={
              /* tw */ `
                border-primary h-8 w-8 animate-spin rounded-full border-4
                border-t-transparent
              `
            }
          ></div>
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Documents
          </Button>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{currentDocument.fileName}</span>
            <div className="flex items-center gap-2">
              {connected && (
                <span className="text-muted-foreground">
                  Connected: {roomId} ({userRole})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <DocumentEditor
          document={currentDocument}
          roomId={roomId!}
          clientId={clientId!}
          participants={participants}
          userRole={userRole}
          updateCurrentDocument={updateCurrentDocument}
        />
      </div>
    </div>
  );
}
