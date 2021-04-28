import path from 'path'
import {createServer as createViteServer, ViteDevServer} from 'vite'

export function createDevServer(opts: {silent?: boolean} = {}): Promise<ViteDevServer> {
  return createViteServer({
    // any valid user config options, plus `mode` and `configFile`
    clearScreen: false,
    logLevel: opts.silent ? 'silent' : undefined,
    configFile: path.resolve(__dirname, 'vite.config.ts'),
    root: __dirname,
    server: {
      port: 8080,
    },
  })
}
