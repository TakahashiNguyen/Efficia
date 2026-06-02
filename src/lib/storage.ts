import type { Document } from '@/types/document';

/**
 * Client-side storage using localStorage for offline capability.
 */
const STORAGE_KEY = 'efficia_documents';

export function getStoredDocuments(): Document[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const parsed: Document[] = JSON.parse(stored);
    // Sort by creation date (newest first)
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function saveDocument(document: Document): void {
  const documents = getStoredDocuments();
  documents.push(document);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export function removeDocument(id: string): boolean {
  const documents = getStoredDocuments();
  const filtered = documents.filter(d => d.id !== id);
  
  if (documents.length === filtered.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function clearAll(): void {
  localStorage.removeItem(STORAGE_KEY);
}
