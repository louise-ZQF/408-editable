import type { Plugin } from 'vite'
import { personalBridge } from '../scripts/personal-sync-core.mts'

export function personalFiles(): Plugin {
  return {
    name: 'personal-editor-files',
    configureServer(server) {
      server.middlewares.use(personalBridge())
    },
  }
}
