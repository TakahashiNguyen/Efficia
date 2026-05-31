# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `pnpm dev` – start dev server (hot reload)
- `pnpm build && pnpm serve` – production build and serve
- `pnpm test -- --watch` – run tests under watch (if available)

## Architecture
Next.js 13+ app with API routes (`src/api/file.ts`) serving compiled bundles via `/public/<id>`. Real-time sync via Socket.io in `websocket-server/`. Shared metadata stored in `metadata.json`.

## Key Files
- `src/app/page.tsx` – entry for each document type.
- `src/utils/WebSocketConnector.tsx` – client socket handling.
- `src/api/file.ts` – API route (load/edit/upload).
- `src/components/ui/*` – Tailwind UI components.

# Context
User wants to build an offline-first web application that mimics Microsoft Word, Excel, and PowerPoint functionality. The app should work fully offline and be shareable without storing data on a server - all data lives locally in the browser.

## Current State
- Next.js 16 project already exists with TypeScript and Tailwind CSS configured
- Basic structure has `src/app/` directory (currently uses generic `/` page)
- Dependencies: next, react, react-dom, tailwindcss, typescript, eslint-config-next

## Routing Structure (Current → Target)
**Current**: Single `/` page that dynamically handles document type via URL parameters  
**Target**: Explicitly separated routes for each document type:
- `/doc/` → Document editor (.docx support)
- `/excel/` → Spreadsheet editor (.xlsx support)
- `/ppt/` → Presentation editor (.pptx support)

## Requirements
1. Offline-first architecture - no external file server or cloud storage
2. Real-time collaborative editing via WebSocket (hosted on your VPS)
3. Support for Word (.docx), Excel (.xlsx), PowerPoint (.pptx) formats
4. All data stored locally in browser (IndexedDB, localStorage)
5. Self-hostable on your own VPS - no third-party cloud dependencies
6. **Client authentication via unique ID** - Users must enter their ID to send/receive notifications

## Tech Stack (No Third-Party Online APIs)
```json
{
  "frontend": {
    "Next.js 16",      // App Router, File System API
    "React 19",        // UI components
    "TypeScript 5.9"   // Type safety
  },
  "styling": {
    "Tailwind CSS 4.3" // Utility-first styling
  },
  "storage": {
    "IndexedDB",       // Browser database (offline data)
    "Web Storage API"  // Fallback for small data
  },
  "real-time": {
    "Socket.io-client" // WebSocket client (connects to your VPS server)
  },
  "document parsing": {
    "ZIP.js",          // Extract .docx/.xlsx/.pptx archives
    "xml2js",          // Parse XML files inside archives
    "PapaParse"        // Parse Excel formulas
  }
}
```

## Authentication Flow (Client ID Based)
1. User opens app → Generates unique client ID (UUID or random string)
2. Client displays ID for sharing with collaborators
3. To send notification to another user:
   - Enter recipient's ID in the UI
   - Send WebSocket message with `to: "recipient-id"` field
4. Server broadcasts messages only to matching recipient IDs

## Deployment (Self-Hosted on Your Own VPS)
### Docker Containerized Deployment

**Recommended: Single Docker container with embedded Next.js + Socket.io server**

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/out ./out
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "src/lib/websocket-server.js"]
```

**Docker Compose (Frontend + Backend)**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      PORT: 3001
      HOST: 0.0.0.0
```

**Run:** `docker-compose up -d`

### VPS Requirements
- **CPU**: 2 cores minimum (for Socket.io server)
- **RAM**: 2GB minimum (optimized for static files + lightweight Node.js server)
- **Storage**: 10GB+ (document storage in IndexedDB is client-side only)
- **Network**: Public IP for WebSocket access

### Deployment Commands
```bash
# Build Next.js app locally first
pnpm build

# Copy to VPS and run Docker container
scp -r out/ user@your-vps:/var/www/efficia
ssh user@your-vps "docker-compose up -d"
```

## Verification
1. Run dev server: `pnpm dev`
2. Open in 2+ browser tabs to test real-time sync
3. Test offline mode by disconnecting network
4. Verify data persists after page refresh (IndexedDB)
