export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function tint(img, color) {
  const c = document.createElement('canvas')
  c.width = img.naturalWidth || 512
  c.height = img.naturalHeight || 512
  const g = c.getContext('2d')
  g.drawImage(img, 0, 0, c.width, c.height)
  g.globalCompositeOperation = 'source-in'
  g.fillStyle = color
  g.fillRect(0, 0, c.width, c.height)
  return c
}

export function signature(name = '') {
  const parts = name
    .replace(/^(Dra?\.|Agente)\s*/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return ''
  return parts.length > 1 ? `${parts[0][0]}. ${parts.at(-1)}` : parts[0]
}

/**
 * Herramientas de dibujo ligadas a la tinta y tipografías de un documento.
 * @param {{ ink: string, pen: string, fonts: { mono: string, caption: string, hand: string } }} style
 */
export function createPaper({ ink, pen, fonts }) {
  function text(ctx, str, x, y, { font, color = ink, align = 'left', stretch = false, spacing = 0, maxWidth } = {}) {
    ctx.font = font
    if ('fontStretch' in ctx) ctx.fontStretch = stretch ? 'expanded' : 'normal'
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${spacing}px`
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.fillText(str, x, y, maxWidth)
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  }

  function measure(ctx, str, font, stretch = false) {
    ctx.font = font
    if ('fontStretch' in ctx) ctx.fontStretch = stretch ? 'expanded' : 'normal'
    return ctx.measureText(str).width
  }

  function fillLine(ctx, label, value, caption, x, y, endX) {
    text(ctx, label, x, y, { font: fonts.mono })
    const start = x + measure(ctx, label, fonts.mono) + 14
    ctx.strokeStyle = ink
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(start, y + 4)
    ctx.lineTo(endX, y + 4)
    ctx.stroke()
    const mid = (start + endX) / 2
    text(ctx, caption, mid, y + 22, { font: fonts.caption, align: 'center' })
    if (value) text(ctx, value, mid, y - 6, { font: fonts.hand, color: pen, align: 'center', maxWidth: endX - start - 10 })
  }

  function cross(ctx, x, y, size) {
    ctx.save()
    ctx.strokeStyle = pen
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x + 3, y + 4)
    ctx.quadraticCurveTo(x + size / 2, y + size / 2 + 2, x + size + 3, y + size - 1)
    ctx.moveTo(x + size - 1, y + 1)
    ctx.quadraticCurveTo(x + size / 2 - 2, y + size / 2, x + 2, y + size + 2)
    ctx.stroke()
    ctx.restore()
  }

  function stars(ctx, cx, cy, sizes) {
    const gap = 6
    const total = sizes.reduce((a, s) => a + s * 2, 0) + gap * (sizes.length - 1)
    let x = cx - total / 2
    ctx.fillStyle = ink
    for (const s of sizes) {
      star(ctx, x + s, cy, s)
      x += s * 2 + gap
    }
  }

  function wrap(ctx, str, maxWidth, font) {
    ctx.font = font
    if ('fontStretch' in ctx) ctx.fontStretch = 'normal'
    const lines = []
    let line = ''
    for (const word of str.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line)
        line = word
      } else {
        line = test
      }
    }
    if (line) lines.push(line)
    return lines
  }

  function ministryStamp(ctx, icon, cx, cy, { color, title, ministry }) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(-0.12)
    ctx.globalAlpha = 0.85
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.strokeRect(-125, -42, 250, 84)
    ctx.lineWidth = 1
    ctx.strokeRect(-119, -36, 238, 72)
    ctx.drawImage(tint(icon, color), -110, -26, 52, 52)
    text(ctx, title, -48, -8, { font: '800 22px Archivo', color, stretch: true, maxWidth: 160 })
    text(ctx, ministry, -48, 16, { font: '700 12px Archivo', color, maxWidth: 160 })
    ctx.restore()
  }

  return { text, measure, fillLine, cross, stars, wrap, ministryStamp }
}

function star(ctx, cx, cy, r) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.42 : r
    const a = (Math.PI / 5) * i - Math.PI / 2
    ctx.lineTo(cx + rad * Math.cos(a), cy + rad * Math.sin(a))
  }
  ctx.closePath()
  ctx.fill()
}
