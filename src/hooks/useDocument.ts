import {
  clearAll,
  getStoredDocuments,
  removeDocument,
  saveDocument,
} from "@/lib/storage";
import type { Document } from "@/types/document";
import { useCallback, useEffect, useState } from "react";

export function useDocument() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const storedDocs = await getStoredDocuments();
        setDocuments(storedDocs);
        if (storedDocs.length > 0) {
          setCurrentDocumentId(storedDocs[0].id);
        }
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const createNewDocument = (): Document => {
    const newDoc: Document = {
      id: crypto.randomUUID(),
      type: "word",
      fileName: `untitled-${Date.now()}.docx`,
      createdAt: new Date(),
      customHtml: "",
      renderedHtml: "",
      isShared: false,
    };

    setDocuments((prev) => [...prev, newDoc]);
    setCurrentDocumentId(newDoc.id);
    return newDoc;
  };

  const getCurrentDocument = (id?: string): Document | null => {
    if (id) {
      return documents.find((d) => d.id === id) || null;
    }
    if (!currentDocumentId) return null;
    return documents.find((d) => d.id === currentDocumentId) || null;
  };

  const updateCurrentDocument = useCallback(
    async (updates: Partial<Document>): Promise<void> => {
      if (!currentDocumentId) return;

      setDocuments((prev) => {
        const next = prev.map((d) =>
          d.id === currentDocumentId ? { ...d, ...updates } : d,
        );

        // Trigger async save to IndexedDB
        const activeDoc = next.find((d) => d.id === currentDocumentId);
        if (activeDoc) {
          saveDocument(activeDoc).catch((err) =>
            console.error("Auto-save failed:", err),
          );
        }

        return next;
      });
    },
    [currentDocumentId],
  );

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const success = await removeDocument(id);

      if (success) {
        const remainingDocs = documents.filter((d) => d.id !== id);
        setDocuments(remainingDocs);

        if (id === currentDocumentId) {
          if (remainingDocs.length > 0) {
            setCurrentDocumentId(remainingDocs[0].id);
          } else {
            setCurrentDocumentId(null);
          }
        }
        return true;
      }
    } catch (error) {
      console.error(`Failed to delete document ${id}:`, error);
    }

    return false;
  };

  const deleteCurrentDocument = async (): Promise<boolean> => {
    return deleteDocument(currentDocumentId || "");
  };

  const clearAllDocuments = async (): Promise<void> => {
    try {
      await clearAll();
      setDocuments([]);
      setCurrentDocumentId(null);
    } catch (error) {
      console.error("Failed to clear documents:", error);
    }
  };

  const selectDocument = (id: string): void => {
    setCurrentDocumentId(id);
  };

  useEffect(() => {
    // Removed reactive auto-save to prevent duplicate saves
  }, [documents, currentDocumentId]);

  return {
    documents,
    currentDocumentId,
    loading,
    createNewDocument,
    getCurrentDocument,
    updateCurrentDocument,
    deleteDocument,
    deleteCurrentDocument,
    clearAllDocuments,
    selectDocument,
  };
}

/**
 * Hook for managing document editing state.
 */
export function useDocumentEditing() {
  const [editMode, setEditMode] = useState<"text" | "code">("text");
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const toggleEditMode = (mode: "text" | "code"): void => {
    setEditMode(mode);
  };

  const handleCursorChange = (line: number, column: number): void => {
    setCursorPosition({ line, column });
  };

  return {
    editMode,
    cursorPosition,
    toggleEditMode,
    handleCursorChange,
  };
}
