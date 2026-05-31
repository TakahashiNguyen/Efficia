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
