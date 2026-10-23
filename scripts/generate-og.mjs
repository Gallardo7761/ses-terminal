import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { MINISTRIES } from '../src/lore/ministries.js'
import { COMMANDER, SHIP } from '../src/lore/ship.js'
import { OG_SIZE, getPages } from '../src/seo.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const font = (pkg, file) => `${root}node_modules/@fontsource/${pkg}/files/${file}.woff2`
const TITLE = font('archivo', 'archivo-latin-800-normal')
const LABEL = font('chakra-petch', 'chakra-petch-latin-600-normal')
const BODY = font('chakra-petch', 'chakra-petch-latin-400-normal')
const LOGO = `${root}src/assets/super-earth.webp`

const { width: W, height: H } = OG_SIZE
const YELLOW = '#ffe900'
const COL = 430
const TEXT_W = W - COL - 70

function grid() {
  const lines = []
  for (let x = 48; x < W; x += 48) lines.push(`line ${x},0 ${x},${H}`)
  for (let y = 48; y < H; y += 48) lines.push(`line 0,${y} ${W},${y}`)
  return ['-stroke', '#ffffff08', '-strokewidth', '1', '-draw', lines.join(' ')]
}

const text = (str, { font, size, color, x, y, w, h, kerning = 0 }) => [
  '(', '-density', '72', '-stroke', 'none', '-size', `${w}x${h}`, '-background', 'none', '-font', font,
  '-pointsize', String(size),
  '-kerning', String(kerning), '-fill', color, '-gravity', 'NorthWest', `caption:${str}`,
  ')', '-gravity', 'NorthWest', '-geometry', `+${x}+${y}`, '-composite',
]

const image = (src, { size, x, y, tint }) => [
  '(', '-background', 'none', '-density', '300', src, '-resize', `${size}x${size}`,
  ...(tint ? ['-fill', tint, '-colorize', '100'] : []),
  ')', '-gravity', 'NorthWest', '-geometry', `+${x}+${y}`, '-composite',
]

function render(page) {
  const ministries = (page.ministries ?? []).map((id) => MINISTRIES[id])
  const icon = ministries.length > 3 ? 44 : 64
  const step = icon + 12
  const textX = COL + ministries.length * step + 8
  const names = ministries.length > 2
    ? `${ministries.length} ministerios competentes`
    : ministries.length > 1
      ? ministries.map((m) => m.name.replace('Ministerio', 'Min.')).join(' · ')
      : ministries[0]?.name
  const footer = ministries.length
    ? [
        ...ministries.flatMap((m, i) => image(fileURLToPath(m.icon), { size: icon, x: COL + i * step, y: 500 + (64 - icon) / 2 })),
        ...text(`BAJO LA AUTORIDAD DE\n${names.toUpperCase()}`, {
          font: LABEL, size: 22, color: ministries.length > 1 ? '#e9e9e6' : ministries[0].color,
          x: textX, y: 503, w: W - textX - 40, h: 70, kerning: 2,
        }),
      ]
    : text(`VIGILANCIA DEL MINISTERIO ACTIVA\nAL MANDO: ${COMMANDER.toUpperCase()}`, {
        font: LABEL, size: 22, color: '#ff7171', x: COL, y: 503, w: TEXT_W, h: 70, kerning: 2,
      })

  const args = [
    '-size', `${W}x${H}`, 'xc:#0c0d0e',
    ...grid(),
    '-stroke', 'none', '-fill', YELLOW, '-draw', `rectangle 0,0 ${W},5 rectangle 0,${H - 5} ${W},${H}`,
    '-fill', page.color, '-draw', `rectangle 0,5 10,${H - 5}`,
    ...image(LOGO, { size: 300, x: 75, y: 165, tint: YELLOW }),
    ...text(`${SHIP.name.toUpperCase()} · ${page.code ?? 'RED DE SUPER TIERRA'}`, {
      font: LABEL, size: 22, color: '#a3a3a0', x: COL, y: 70, w: TEXT_W, h: 40, kerning: 3,
    }),
    ...text(page.heading.toUpperCase(), { font: TITLE, size: 66, color: YELLOW, x: COL, y: 120, w: TEXT_W, h: 170 }),
    ...text(page.description, { font: BODY, size: 30, color: '#e9e9e6', x: COL, y: 310, w: TEXT_W, h: 170 }),
    ...footer,
    `${root}public/og/${page.slug}.png`,
  ]
  execFileSync('magick', args, { stdio: 'inherit' })
  console.log(`public/og/${page.slug}.png`)
}

getPages().forEach(render)
