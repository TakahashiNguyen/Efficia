import { CustomTag, Document, TextNode } from '@/types/document';
import { convertToHtml } from 'mammoth';

/**
 * Converts a DOCX file content to custom HTML tags.
 * Uses mammoth library for parsing .docx files client-side.
 */
export async function docxToCustomHtml(docxContent: ArrayBuffer): Promise<{
    success: boolean;
    customHtml: string;
    error?: string;
}> {
    try {
        // Parse DOCX to HTML using mammoth
        const result = await convertToHtml({ arrayBuffer: docxContent });

        if (!result.value) {
            return {
                success: false,
                customHtml: '',
                error: 'Failed to parse DOCX content',
            };
        }

        // Convert mammoth HTML to our custom tag system
        const customTags = convertMammothToCustomTags(result.value);

        // Serialize back to string for storage
        return {
            success: true,
            customHtml: serializeCustomTags(customTags),
        };
    } catch (error) {
        console.error('DOCX parsing error:', error);
        return {
            success: false,
            customHtml: '',
            error: 'Failed to parse DOCX file',
        };
    }
}

/**
 * Converts mammoth HTML structure to our custom tag system.
 */
function convertMammothToCustomTags(html: string): CustomTag {
    // Simple parser that wraps content in paragraph tags
    // In a real implementation, we'd parse the full DOM tree

    const trimmedHtml = html.trim();

    if (!trimmedHtml) {
        return createEmptyParagraph();
    }

    // Create root container
    const root: CustomTag = {
        tagName: 'document',
        children: [],
    };

    // Split by paragraphs (basic implementation)
    const paragraphs = trimmedHtml.split(/\n\s*\n/);

    for (const paragraph of paragraphs) {
        if (!paragraph.trim()) continue;

        const textNodes = splitIntoTextNodes(paragraph);

        for (const textNode of textNodes) {
            // Determine heading level based on formatting markers
            const tag: CustomTag = createEmptyParagraph();

            // Check for heading markers (e.g., "=====" or "#")
            if (textNode.content.startsWith('=====')) {
                const level = textNode.content.match(/={1,3}/)?.[0].length || 1;
                tag.tagName = `heading${level}`;
                tag.attributes = { content: textNode.content.slice(5) };
            } else if (textNode.content.startsWith('# ')) {
                const level = textNode.content.match(/#{1,3}/)?.[0].length || 1;
                tag.tagName = `heading${level}`;
                tag.attributes = { content: textNode.content.slice(2) };
            } else if (textNode.content.startsWith('**')) {
                // Bold text - wrap in custom tags
                const innerContent = textNode.content.slice(2);
                const boldTag: CustomTag = { tagName: 'strong', children: [] };

                // Split by word boundaries for better formatting
                const words = innerContent.split(/(\s+)/g).filter(Boolean);
                let currentWord = '';

                for (const word of words) {
                    if (!word.trim()) continue;

                    if (currentWord) {
                        boldTag.children?.push({ tagName: 'text', content: currentWord });
                        currentWord = '';
                    }

                    // Check if this is a new paragraph or continuation
                    const nextChar = innerContent.slice(innerContent.indexOf(word) + word.length);
                    if (nextChar === '\n' || nextChar === '' && words[words.indexOf(word) + 1]?.trim() === '') {
                        tag.children?.push(boldTag);
                        break;
                    }

                    currentWord = word;
                }

                if (currentWord) {
                    boldTag.children?.push({ tagName: 'text', content: currentWord });
                    tag.children?.push(boldTag);
                }
            } else {
                // Regular text - wrap in paragraph
                const paraTag: CustomTag = { tagName: 'paragraph' };

                // Split into words for better formatting
                const words = textNode.content.split(/(\s+)/g).filter(Boolean);
                let currentWord = '';

                for (const word of words) {
                    if (!word.trim()) continue;

                    if (currentWord) {
                        paraTag.children?.push({ tagName: 'text', content: currentWord });
                        currentWord = '';
                    }

                    // Check if this is a new paragraph or continuation
                    const nextChar = textNode.content.slice(textNode.content.indexOf(word) + word.length);
                    if (nextChar === '\n' || nextChar === '' && words[words.indexOf(word) + 1]?.trim() === '') {
                        paraTag.children?.push({ tagName: 'text', content: currentWord });
                        break;
                    }

                    currentWord = word;
                }

                if (currentWord) {
                    paraTag.children?.push({ tagName: 'text', content: currentWord });
                    root.children?.push(paraTag);
                }
            }
        }
    }

    return root;
}

/**
 * Creates an empty paragraph tag.
 */
function createEmptyParagraph(): CustomTag {
    return {
        tagName: 'paragraph',
        children: [],
    };
}

/**
 * Splits text into individual text nodes based on formatting markers.
 */
function splitIntoTextNodes(text: string): Array<{ content: string }> {
    const parts = [];
    let currentPart = '';

    for (const char of text) {
        if (char === '=====' || char === '#') {
            if (currentPart.trim()) {
                parts.push({ content: currentPart });
            }
            currentPart = char;
        } else {
            currentPart += char;
        }
    }

    if (currentPart) {
        parts.push({ content: currentPart });
    }

    return parts;
}

/**
 * Converts custom tags back to mammoth-compatible HTML.
 */
export function customHtmlToMammoth(customTags: CustomTag): string {
    const htmlParts: string[] = [];

    function visit(node: CustomTag | TextNode, indent = 0) {
        if ('tagName' in node) {
            // It's a tag
            const tagName = node.tagName;
            let attributesStr = '';

            if (node.attributes) {
                for (const [key, value] of Object.entries(node.attributes)) {
                    attributesStr += ` ${key}="${value}"`;
                }
            }

            htmlParts.push(`<${tagName}${attributesStr}>`);

            // Visit children
            if (node.children) {
                for (const child of node.children) {
                    visit(child, indent + 1);
                }
            }

            htmlParts.push(`</${tagName}>`);
        } else {
            // It's a text node
            const content = node.content;
            if (content.startsWith('**')) {
                // Bold text
                htmlParts.push(`<strong>${content.slice(2)}</strong>`);
            } else {
                htmlParts.push(content);
            }
        }
    }

    visit(customTags);

    return htmlParts.join('\n');
}

/**
 * Serializes custom tags to a string representation.
 */
export function serializeCustomTags(tags: CustomTag): string {
    const parts: string[] = [];

    function visit(node: CustomTag | TextNode, indent = 0) {
        if ('tagName' in node) {
            // It's a tag
            const tagName = node.tagName;
            let attributesStr = '';

            if (node.attributes) {
                for (const [key, value] of Object.entries(node.attributes)) {
                    attributesStr += ` ${key}="${value}"`;
                }
            }

            parts.push(`<${tagName}${attributesStr}>`);

            // Visit children with indentation
            if (node.children) {
                for (const child of node.children) {
                    visit(child, indent + 1);
                }
            }

            parts.push(`</${tagName}>`);
        } else {
            // It's a text node
            const content = node.content;
            if (content.startsWith('**')) {
                // Bold text - escape for vim editing
                parts.push(`<strong>${content.slice(2)}</strong>`);
            } else {
                parts.push(content);
            }
        }
    }

    visit(tags);

    return parts.join('\n');
}

/**
 * Parses a custom HTML string back into CustomTag objects.
 */
export function parseCustomHtml(html: string): CustomTag {
    const lines = html.split('\n').filter(line => line.trim());
    const tags: CustomTag[] = [];

    for (const line of lines) {
        // Parse opening tag
        const match = line.match(/<(\w+)([^>]*)>/);

        if (!match) continue;

        const tagName = match[1];
        const attributesStr = match[2].trim();

        const attributes: Record<string, string> = {};
        if (attributesStr) {
            for (const attr of attributesStr.split(/\s+/)) {
                const [attrName, attrValue] = attr.split('=');
                if (attrName && attrValue) {
                    // Handle quoted values
                    const value = attrValue.replace(/^["']|["']$/g, '');
                    attributes[attrName] = value;
                } else {
                    attributes[attrName] = attrValue;
                }
            }
        }

        const tag: CustomTag = { tagName };

        if (attributes) {
            tag.attributes = attributes;
        }

        tags.push(tag);
    }

    return tags[0] || createEmptyParagraph();
}

/**
 * Creates an empty document structure.
 */
export function createEmptyDocument(): Document {
    const root: CustomTag = {
        tagName: 'document',
        children: [createEmptyParagraph()],
    };

    return {
        id: '',
        type: 'word',
        fileName: 'untitled.docx',
        createdAt: new Date(),
        customHtml: serializeCustomTags(root),
        renderedHtml: '',
    };
}
