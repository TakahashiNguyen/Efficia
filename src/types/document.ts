export type DocumentType = "word" | "powerpoint" | "excel";

/**
 * Custom HTML tag structure for storing document content.
 * This allows editing the raw HTML structure in vim or any text editor.
 */
export interface CustomTag {
  tagName: string;
  attributes?: Record<string, string>;
  children?: Array<CustomTag | TextNode>;
}

/**
 * Simple text node for custom tag system.
 */
export interface TextNode {
  type: "text";
  content: string;
}

/**
 * Document with custom tag-based HTML structure.
 */
export interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  createdAt: Date;
  updatedAt?: Date;
  // Custom tag-based HTML structure (editable in vim)
  customHtml: string;
  // Standard HTML for display purposes
  renderedHtml?: string;
  // Collaboration setting
  isShared: boolean;
}

export interface DocumentEditorProps {
  document: Document;
  roomId: string;
  clientId: string;
  updateCurrentDocument: (updates: Partial<Document>) => Promise<void>;
}

export interface ClientSession {
  clientId: string;
  sessionId: string;
  documents: Document[];
}
