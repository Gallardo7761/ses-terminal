import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SOURCE = 'https://raw.githubusercontent.com/helldivers-2/json/master/planets/planets.json'
const OUT = fileURLToPath(new URL('../src/lore/planets.json', import.meta.url))

const res = await fetch(SOURCE)
if (!res.ok) throw new Error(`${SOURCE} → ${res.status}`)

const planets = Object.fromEntries(
  Object.entries(await res.json()).map(([index, p]) => [index, { name: p.names?.['es-ES'] ?? p.name, sector: p.sector }]),
)

const lines = Object.entries(planets).map(([index, p]) => `  ${JSON.stringify(index)}: ${JSON.stringify(p)}`)
writeFileSync(OUT, `{\n${lines.join(',\n')}\n}\n`)
console.log(`${Object.keys(planets).length} planetas → src/lore/planets.json`)
