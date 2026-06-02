'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Document } from '@/types/document';
import { getStoredDocuments, saveDocument, removeDocument, clearAll } from '@/lib/storage';

export function useDocument() {
  // 1. SỬA LỖI: Khởi tạo State trực tiếp từ Storage (Lazy Initialization)
  // Cách này giúp documents có dữ liệu NGAY LẬP TỨC ở lần render đầu tiên, không cần useEffect
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
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
        console.error('Failed to load documents:', error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const createNewDocument = (): Document => {
    const newDoc: Document = {
      id: crypto.randomUUID(),
      type: 'word',
      fileName: `untitled-${Date.now()}.docx`,
      createdAt: new Date(),
      customHtml: '',
      renderedHtml: '',
    };

    setDocuments(prev => [...prev, newDoc]);
    setCurrentDocumentId(newDoc.id);
    return newDoc;
  };

  const getCurrentDocument = (): Document | null => {
    if (!currentDocumentId) return null;
    return documents.find(d => d.id === currentDocumentId) || null;
  };

  const updateCurrentDocument = useCallback(async (updates: Partial<Document>): Promise<void> => {
    if (!currentDocumentId) return;

    setDocuments(prev => {
      const next = prev.map(d => d.id === currentDocumentId ? { ...d, ...updates } : d);

      // Trigger async save to IndexedDB
      const activeDoc = next.find(d => d.id === currentDocumentId);
      if (activeDoc) {
        saveDocument(activeDoc).catch(err => console.error('Auto-save failed:', err));
      }

      return next;
    });
  }, [currentDocumentId]);

  const deleteCurrentDocument = async (): Promise<boolean> => {
    if (!currentDocumentId) return false;

    try {
      const success = await removeDocument(currentDocumentId);

      if (success) {
        const remainingDocs = documents.filter(d => d.id !== currentDocumentId);
        setDocuments(remainingDocs);

        if (remainingDocs.length > 0) {
          setCurrentDocumentId(remainingDocs[0].id);
        } else {
          setCurrentDocumentId(null);
        }
        return true;
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }

    return false;
  };

  const clearAllDocuments = async (): Promise<void> => {
    try {
      await clearAll();
      setDocuments([]);
      setCurrentDocumentId(null);
    } catch (error) {
      console.error('Failed to clear documents:', error);
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
    deleteCurrentDocument,
    clearAllDocuments,
    selectDocument,
  };
}

/**
 * Hook for managing document editing state.
 */
export function useDocumentEditing() {
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'text' | 'code'>('text');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const toggleEditMode = (mode: 'text' | 'code'): void => {
    setEditMode(mode);
  };

  const handleCursorChange = (line: number, column: number): void => {
    setCursorPosition({ line, column });
  };

  return {
    isEditing,
    editMode,
    cursorPosition,
    toggleEditMode,
    handleCursorChange,
  };
}
