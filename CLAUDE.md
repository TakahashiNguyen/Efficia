# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` – start development server (hot reload)
- `pnpm build && pnpm serve` – production build and serve
- `pnpm lint` – ESLint formatting and running
- `pnpm release` – trigger semantic-release

## Architecture Overview

**Next.js 16 application** with offline-first architecture:

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Geist fonts, Tailwind setup
│   ├── globals.css         # Global styles + custom utilities
│   └── page.tsx            # Main entry point (handles routing)
├── next.config.ts          # Production build configuration
│   - Enables server-side rendering
│   - Configures API routes
│   - Sets up SEO metadata
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── src/
    ├── api/
    │   └── file.ts         # File handling API
```

**Target Routes**:
- `/doc/` → Document editor (.docx support)
- `/excel/` → Spreadsheet editor (.xlsx support)
- `/ppt/` → Presentation editor (.pptx support)

## Dependencies

### Frontend Stack
- **Next.js**: "^16.2.6" - App Router, Server Components
- **React**: "^19.x" - UI components
- **TypeScript**: "^5.x" - Type safety

### Styling
- **Tailwind CSS** 4.x - Utility-first styling with custom theme setup

## Offline-First Implementation

### Data Storage Strategy

1. **IndexedDB** for document content (no server storage)
   - Store each document's binary data locally as BLOBs
   - Handle large documents efficiently
   - No external file servers required

2. **localStorage** for metadata and session state
   - Client ID / user IDs
   - Sync status flags
   - Last accessed timestamps

3. **WebSocket messages** use localStorage with `to:` field for recipient identification

### WebSocket Handling

1. Initialize connection on page mount in page.tsx or dedicated component
2. Handle connection states:
   - `connected`: Messages can be sent/received
   - `disconnected`: Connection failed, reconnection attempt
   - `connecting`: Attempting to connect to server
3. Send messages with format: `{ type, data, to: recipientId }`

## Testing Strategy

### Unit Tests (Jest)

```typescript
// tests/__mocks__/websocketServer.ts
import { createConnection } from './websocket-server';

describe('WebSocket Server', () => {
  let conn: any;

  beforeEach(async () => {
    // Setup WebSocket connection mock
    conn = await createConnection();
    server.listen(conn);
  });

  afterEach(async () => {
    if (conn) {
      server.close();
      conn.destroy();
    }
  });

  it('should handle incoming messages', async () => {
    // Mock message handlers
    expect(() => { /* test */ }).toThrow();
  });

  it('should handle outgoing messages with recipient field', async () => {
    const mockId = 'test-recipient-id';
    const msg = { type: 'sync', data, to: mockId };
    // Verify message format validation
  });
});
```

### Integration Tests (React Testing Library)

```typescript
// tests/effective-offline-editor.test.tsx
import { render, screen } from '@testing-library/react';

describe('Offline Editor App', () => {
  it('should display document list with three types', () => {
    render(<MyApp />);
    expect(screen.getByText(/Documents/)).toBeInTheDocument();
    expect(screen.getByText(/Docs/)).toBeInTheDocument();
    expect(screen.getByText(/Exce/)).toBeInTheDocument();
  });

  it('should accept user ID for notifications', () => {
    const mockId = 'test-recipient-id';
    render(<MyApp onMessage={handleMessage} />);
    
    screen.getByRole('button').click();
    
    expect(screen.getByLabelText(/recipient/)).toBeInTheDocument();
  });

  it('should handle disconnected state properly', () => {
    const mockWs = jest.fn().mockImplementation(() => null);
    render(<MyApp ws={mockWs} />);
    
    expect(mockWs).toBeDefined();
  });
});
```

## Key Files to Understand and Modify

| File | Purpose | Changes Needed |
|------|---------|----------------|
| `src/app/layout.tsx` | Layout configuration with Geist fonts | Update metadata, adjust body styles |
| `src/app/globals.css` | Global styles + Tailwind integration | Add document-specific utilities |
| `src/app/page.tsx` | Main entry point for routing | Separate `/doc/`, `/excel/`, `/ppt/` routes |
| `next.config.ts` | Build configuration | Remove Vercel-specific config if not needed |

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
```

## Important Notes

1. **No third-party document parsing libraries** needed - use native Node.js APIs since documents are stored locally
2. **All client-side operations** should be optimized for large IndexedDB records (BLOBs)
3. **WebSocket reconnection logic** must handle network partitions gracefully
4. **Session tokens** should use UUIDv4 format to avoid conflicts
