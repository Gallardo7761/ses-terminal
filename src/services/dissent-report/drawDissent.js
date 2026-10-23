import superEarthLogo from '@/assets/super-earth.webp'
import truthIcon from '@/assets/ministries/truth.svg'
import { COMMANDER, SHIP } from '@/lore/ship.js'
import { censor } from '@/services/automaton-decoder/censorship.js'
import { createPaper, loadImage, signature, tint } from '../shared/paper.js'

export const WIDTH = 800
export const HEIGHT = 1132
const SCALE = 1.5

const PAPER = '#efe7d6'
const WATERMARK = 'rgb(255 255 255 / 0.6)'
const INK = 'rgb(35 20 30 / 0.9)'
const PEN = '#0b1a4a'
const TRUTH = 'rgb(140 26 120 / 0.92)'
const ALERT = 'rgb(185 22 32 / 0.8)'
const REDACTION = '#111'

const FONTS = {
  title: '800 34px Archivo',
  heading: '700 19px Archivo',
  mono: '19px "Share Tech Mono"',
  body: '17px "Share Tech Mono"',
  caption: '12px "Share Tech Mono"',
  hand: '26px "Homemade Apple"',
}

const { text, measure, fillLine, cross, stars, wrap, ministryStamp } = createPaper({ ink: INK, pen: PEN, fonts: FONTS })

let assetsPromise
function loadAssets() {
  assetsPromise ??= Promise.all([
    loadImage(superEarthLogo),
    loadImage(truthIcon),
    ...[...Object.values(FONTS), '700 12px Archivo', '800 22px Archivo', '800 28px Archivo'].map((f) =>
      document.fonts.load(f),
    ),
  ]).then(([logoImg, stampImg]) => ({ logoImg, stampImg }))
  return assetsPromise
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ caseId, suspect, informant, anonymous, date, location, offenses: string[], threat: { stamp: string },
 *   statement, measure }} data
 */
export async function drawDissent(canvas, data) {
  const { logoImg, stampImg } = await loadAssets()
  canvas.width = WIDTH * SCALE
  canvas.height = HEIGHT * SCALE
  const ctx = canvas.getContext('2d')
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0)
  ctx.textBaseline = 'alphabetic'

  // --- Fondo
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.drawImage(tint(stampImg, WATERMARK), 160, 280, 480, 480)
  ctx.drawImage(tint(logoImg, INK), 672, 990, 96, 96)

  // --- Cabecera
  text(ctx, `EXP. ${data.caseId}`, 40, 44, { font: FONTS.caption, spacing: 1 })
  text(ctx, 'CONFIDENCIAL', 760, 44, { font: '700 12px Archivo', color: ALERT, align: 'right', stretch: true, spacing: 2 })
  ctx.drawImage(tint(logoImg, INK), 365, 28, 70, 70)
  text(ctx, 'SUPER TIERRA', 400, 138, { font: FONTS.title, align: 'center', stretch: true })
  text(ctx, 'MINISTERIO DE LA VERDAD', 400, 166, { font: FONTS.mono, align: 'center', spacing: 3 })
  stars(ctx, 400, 186, [9, 11, 13, 16, 13, 11, 9])
  text(ctx, `REGISTRADO A BORDO DEL ${SHIP.name.toUpperCase()}`, 400, 216, {
    font: FONTS.caption,
    align: 'center',
    spacing: 2,
  })

  // --- Cuerpo
  const x0 = 55
  text(ctx, 'INFORME DE CONDUCTA ANTIDEMOCRÁTICA', x0, 258, { font: FONTS.heading, stretch: true })

  fillLine(ctx, 'Ciudadano denunciado', data.suspect, '(Nombre del sospechoso)', x0, 318, 745)
  fillLine(
    ctx,
    'Denunciado por',
    data.anonymous ? 'Anónimo' : data.informant,
    data.anonymous ? '(Identidad protegida por el Ministerio)' : '(Ciudadano ejemplar)',
    x0,
    374,
    745,
  )
  fillLine(ctx, 'Fecha', data.date, '(De los hechos)', x0, 430, 290)
  fillLine(ctx, 'Lugar', data.location, '(De los hechos)', 315, 430, 745)

  text(ctx, 'Conductas observadas:', x0, 486, { font: FONTS.mono })
  let y = 524
  if (!data.offenses.length) {
    text(ctx, '—', x0 + 10, y, { font: FONTS.mono })
    y += 36
  }
  for (const label of data.offenses) {
    ctx.strokeStyle = INK
    ctx.lineWidth = 2
    ctx.strokeRect(x0 + 10, y - 19, 24, 24)
    cross(ctx, x0 + 10, y - 19, 24)
    text(ctx, label, x0 + 52, y, { font: FONTS.mono, maxWidth: 640 })
    y += 36
  }

  y += 14
  text(ctx, 'Declaración del denunciante:', x0, y, { font: FONTS.mono })
  y += 30
  y = redactedParagraph(ctx, data.statement || '—', x0, y, 690, 3)

  y += 14
  text(ctx, 'Medida recomendada:', x0, y, { font: FONTS.mono })
  y += 30
  for (const line of wrap(ctx, data.measure || '—', 690, FONTS.body).slice(0, 2)) {
    text(ctx, line, x0, y, { font: FONTS.body })
    y += 26
  }

  // --- Sello de nivel de amenaza
  threatStamp(ctx, data.threat.stamp, 615, 545)

  // --- Firma
  const sigY = Math.max(y + 40, 910)
  text(ctx, 'OFICIAL RECEPTOR:', x0, sigY, { font: FONTS.heading, stretch: true })
  const sigX = x0 + measure(ctx, 'OFICIAL RECEPTOR:', FONTS.heading, true) + 16
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(sigX, sigY + 4)
  ctx.lineTo(sigX + 280, sigY + 4)
  ctx.stroke()
  ctx.save()
  ctx.translate(sigX + 10, sigY - 8)
  ctx.rotate(-0.06)
  text(ctx, signature(SHIP.commander.name), 0, 0, { font: '32px "Homemade Apple"', color: PEN, maxWidth: 260 })
  ctx.restore()

  // --- Placa del oficial
  const sy = sigY + 26
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.strokeRect(x0, sy, 230, 84)
  stars(ctx, x0 + 115, sy + 22, Array(10).fill(7))
  text(ctx, SHIP.commander.role.toUpperCase(), x0 + 115, sy + 66, {
    font: '800 28px Archivo',
    align: 'center',
    stretch: true,
    maxWidth: 206,
  })
  text(ctx, COMMANDER.toUpperCase(), x0, sy + 112, { font: FONTS.heading, stretch: true, maxWidth: 330 })

  // --- Sello del Ministerio de la Verdad
  ministryStamp(ctx, stampImg, 525, sy + 42, { color: TRUTH, title: 'ARCHIVADO', ministry: 'MINISTERIO DE LA VERDAD' })

  // --- Pie
  text(ctx, '[SI NO HA DENUNCIADO A NADIE ESTA SEMANA, PREGÚNTESE POR QUÉ]', 400, 1090, {
    font: '700 15px Archivo',
    align: 'center',
    stretch: true,
    maxWidth: 520,
  })
}

/** Escribe un párrafo tachando con barras negras los términos subversivos. Devuelve la nueva `y`. */
function redactedParagraph(ctx, str, x, y, maxWidth, maxLines) {
  const words = censor(str).segments.flatMap(({ text: t, redacted }) =>
    t
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, redacted })),
  )
  ctx.font = FONTS.body
  if ('fontStretch' in ctx) ctx.fontStretch = 'normal'
  const space = ctx.measureText(' ').width

  const lines = [[]]
  let width = 0
  for (const word of words) {
    const w = ctx.measureText(word.w).width
    if (width + w > maxWidth && lines.at(-1).length) {
      lines.push([])
      width = 0
    }
    lines.at(-1).push({ ...word, width: w })
    width += w + space
  }

  for (const line of lines.slice(0, maxLines)) {
    let cx = x
    for (const word of line) {
      if (word.redacted) {
        ctx.fillStyle = REDACTION
        ctx.fillRect(cx - 1, y - 14, word.width + 2, 19)
      } else {
        text(ctx, word.w, cx, y, { font: FONTS.body })
      }
      cx += word.width + space
    }
    y += 26
  }
  return y
}

function threatStamp(ctx, label, cx, cy) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(0.16)
  ctx.globalAlpha = 0.9
  const w = Math.max(measure(ctx, label, '800 34px Archivo', true) + 48, 190)
  ctx.strokeStyle = ALERT
  ctx.lineWidth = 4
  ctx.strokeRect(-w / 2, -34, w, 68)
  ctx.lineWidth = 1.5
  ctx.strokeRect(-w / 2 + 6, -28, w - 12, 56)
  text(ctx, label, 0, 12, { font: '800 34px Archivo', color: ALERT, align: 'center', stretch: true })
  ctx.restore()
}
