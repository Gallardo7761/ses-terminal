import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { getPages, metaTags } from './src/seo.js'

const MARK = /<!--social-meta-->[\s\S]*?<!--\/social-meta-->|<!--social-meta-->/

function socialMeta(siteUrl) {
  let root
  let outDir
  const wrap = (page) => `<!--social-meta-->\n    ${metaTags(page, siteUrl)}\n    <!--/social-meta-->`
  const [home, ...rest] = getPages()

  return {
    name: 'social-meta',
    configResolved(config) {
      root = config.root
      outDir = resolve(config.root, config.build.outDir)
    },
    transformIndexHtml: (html) => html.replace(MARK, wrap(home)),
    closeBundle() {
      const html = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      for (const page of rest) {
        const file = resolve(outDir, `.${page.path}.html`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html.replace(MARK, wrap(page)))
      }
      for (const page of [home, ...rest]) {
        if (!existsSync(resolve(root, 'public/og', `${page.slug}.png`))) {
          this.warn(`Falta public/og/${page.slug}.png — ejecuta "npm run og"`)
        }
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '')

  return {
    plugins: [react(), socialMeta(siteUrl)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
