# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` – start development server
- `pnpm build && pnpm serve` – production build and serve
- `pnpm lint` – ESLint formatting and running
- `pnpm test` – execute tests

## Architecture Overview

**Next.js 16 application** with the following structure:

src/
├── app/
│   ├── layout.tsx          # Root layout with Geist fonts, Tailwind setup
│   ├── globals.css         # Global styles and custom utilities
│   └── page.tsx            # Main entry point (handles document routing)
├── next.config.ts          # Production build configuration
│   - Enables server-side rendering
│   - Configures API routes
│   - Sets up SEO metadata
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts

**Additional files**: `src/api/file.ts` - File handling API for document operations

## Project Configuration

### Current State
- **Routing Structure**: Single `/` page that dynamically handles document type via URL parameters (`/doc?id=1`, `/excel?id=2`, etc.)

### Target Architecture (Refactoring Goal)
Explicitly separated routes:
├── /doc/       → Document editor (.docx support)
├── /excel/     → Spreadsheet editor (.xlsx support)
└── /ppt/       → Presentation editor (.pptx support)

## Dependencies

### Frontend Stack
- **Next.js**: "^16.2.6" - App Router, Server Components
- **React**: "^19.x" - UI components
- **TypeScript**: "^5.x" - Type safety

### Styling
- **Tailwind CSS** 4.x - Utility-first styling with custom theme setup

## Key Files to Understand and Modify

| File | Purpose | Changes Needed |
|------|---------|----------------|
| `src/app/layout.tsx` | Layout configuration with Geist fonts | Update metadata, adjust body styles |
| `src/app/globals.css` | Global styles + Tailwind integration | Add document-specific utilities |
| `src/app/page.tsx` | Main entry point for routing | Separate `/doc/`, `/excel/`, `/ppt/` routes |
| `next.config.ts` | Build configuration | Remove Vercel-specific config if not needed |

## Offline-First Implementation Notes

1. **Data Storage**:
    - Use browser IndexedDB for document content (no server storage)
    - Use localStorage for metadata and session state
    - No external file servers required

2. **WebSocket Integration**:
    - Connect to VPS-hosted Socket.io server for real-time sync
    - Client-side WebSocket handling in `src/app/page.tsx` or dedicated component
    - Broadcast messages only to matching recipient IDs

3. **Document Parsing**:
    - **.docx**: Use native Node.js ZIP parsing (no external libraries)
    - **.xlsx**: Parse XML directly from ArrayBuffer/Buffer
    - **.pptx**: Similar approach to .xlsx with XML handling

## Authentication Flow

1. Generate unique client ID on initial app load
2. Store in localStorage for session management
3. Include in WebSocket messages via `to: recipient-id` field
4. Broadcast validation at server level (if backend exists)

## Deployment Requirements

### VPS Specifications
- **CPU**: 2+ cores minimum (for Socket.io server)
- **RAM**: 2GB minimum
- **Network**: Public IP for WebSocket access
- **Storage**: 10GB+ for document storage

### Dockerized Deployment (Recommended)
```bash
# Build Next.js locally first
pnpm build

# Deploy to VPS and run WebSocket server
scp -r out/ user@your-vps:/var/www/efficia
ssh user@your-vps "docker-compose up -d"

Testing Strategy

1. Local development: pnpm dev for hot reload testing
2. Production build: pnpm build && pnpm serve
3. Test coverage: Ensure all routing paths work correctly (/doc, /excel, /ppt)
4. Offline mode: Disconnect network and verify localStorage persistence

Important Notes

- Current page uses URL-based document type detection; refactor to explicit routes
- No third-party document parsing libraries needed (native Node.js APIs suffice)
- Keep the existing Next.js 16 setup as base, just restructure routing logic
- All data persistence is client-side (IndexedDB + localStorage only)