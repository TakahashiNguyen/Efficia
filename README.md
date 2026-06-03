# Efficia - Professional Offline-First Document Editor

Efficia is a professional, collaborative, and offline-first document editor
designed to provide a Google Docs-like experience without requiring a central
data server for document storage.

## 🚀 Key Features

- **Offline-First Architecture**: Documents are stored locally in the browser
  using IndexedDB, ensuring instant access and full functionality without an
  internet connection.
- **Real-time Collaboration**: Powered by WebRTC (PeerJS), allowing users to
  collaborate on the same document in real-time without a centralized database.
- **Professional Editor**: A rich-text editing experience built with
  Tiptap/ProseMirror, featuring a professional A4 page layout.
- **File Management**: A dedicated document browser for creating, organizing,
  and deleting collaborative files.
- **Automatic Versioning**: Fully automated release management using
  `semantic-release`.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4.0, Shadcn UI
- **Editor**: Tiptap / ProseMirror
- **Storage**: IndexedDB (via native API)
- **Communication**: WebRTC / PeerJS
- **Package Manager**: pnpm

## 📦 Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

## ⚙️ Deployment

The project is configured for static export and can be deployed to GitHub Pages
or any static hosting provider.

- **CI/CD**: Automated via GitHub Actions.
- **Release Process**: Uses `semantic-release` using a Deploy Key for branch
  protection bypass and `GITHUB_TOKEN` for API releases.
- **Deployment**: Triggered automatically after a successful release on the
  `main` branch.
