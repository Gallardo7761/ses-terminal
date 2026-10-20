const CORRUPT = '▓'

/**
 * Descifra una transmisión binaria a texto UTF-8.
 * Admite bytes separados por espacios/comas/saltos o un bloque continuo de bits.
 * Los grupos ilegibles se sustituyen por ▓ en lugar de abortar: una señal
 * degradada sigue siendo información útil para el Ministerio.
 */
export function decodeBinary(input) {
  const tokens = input.trim().split(/[\s,;|]+/).filter(Boolean)
  const chunks = [] // cada elemento: number (byte) | null (corrupto)

  for (const token of tokens) {
    if (!/^[01]+$/.test(token)) {
      chunks.push(null)
      continue
    }
    if (token.length <= 8) {
      chunks.push(parseInt(token, 2))
    } else if (token.length % 8 === 0) {
      for (let i = 0; i < token.length; i += 8) chunks.push(parseInt(token.slice(i, i + 8), 2))
    } else {
      chunks.push(null)
    }
  }

  // Decodificamos los tramos de bytes válidos como UTF-8 (soporta tildes y ñ)
  // e intercalamos el marcador de corrupción donde haga falta.
  const decoder = new TextDecoder('utf-8')
  let text = ''
  let run = []
  const flush = () => {
    if (run.length) text += decoder.decode(new Uint8Array(run))
    run = []
  }
  for (const c of chunks) {
    if (c === null) {
      flush()
      text += CORRUPT
    } else {
      run.push(c)
    }
  }
  flush()

  // Caracteres de control (salvo saltos de línea y tabs) → punto medio.
  text = text.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '·')
  // Secuencias UTF-8 rotas (p. ej. una tilde a medio corromper) → mismo marcador de corrupción.
  text = text.replace(/\uFFFD/g, CORRUPT)

  const corrupted = chunks.filter((c) => c === null).length
  return {
    text,
    bytes: chunks.length,
    bits: chunks.length * 8,
    corrupted,
    integrity: chunks.length ? ((chunks.length - corrupted) / chunks.length) * 100 : 0,
  }
}

/**
 * Cifra texto a binario. `noise` (0–1) degrada la señal sustituyendo bytes
 * por basura, ideal para que el GM fabrique intercepciones "dañadas".
 */
export function encodeText(text, { separator = ' ', noise = 0 } = {}) {
  const bytes = new TextEncoder().encode(text)
  return Array.from(bytes, (b) => {
    if (noise > 0 && Math.random() < noise) return randomGarbage()
    return b.toString(2).padStart(8, '0')
  }).join(separator)
}

function randomGarbage() {
  const pool = '01X#?'
  let s = ''
  for (let i = 0; i < 8; i++) s += pool[Math.floor(Math.random() * pool.length)]
  // Garantizamos que no sea binario válido por casualidad.
  return /^[01]+$/.test(s) ? 'X' + s.slice(1) : s
}

/** ¿Parece binario? Útil para avisar si alguien pega texto en el campo equivocado. */
export function looksBinary(input) {
  const clean = input.replace(/[\s,;|]/g, '')
  if (!clean) return false
  const ones = (clean.match(/[01]/g) || []).length
  return ones / clean.length > 0.8
}
