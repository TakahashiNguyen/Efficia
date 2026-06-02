import type { MetadataRoute } from 'next'

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
    return {
        "name": "Efficia Offline Editor",
        "short_name": "Efficia",
        "description": "An offline-first collaborative document editor",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
    }
}
