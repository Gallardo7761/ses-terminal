import superEarthLogo from '@/assets/super-earth.webp'
import humanityIcon from '@/assets/ministries/humanity.svg'
import { SHIP } from '@/lore/ship.js'
import { createPaper, loadImage, signature, tint } from '../shared/paper.js'

export const WIDTH = 800
export const HEIGHT = 1132
const SCALE = 1.5

const PAPER = '#cfe8f5'
const WATERMARK = 'rgb(255 255 255 / 0.55)'
const INK = 'rgb(10 30 40 / 0.9)'
const PEN = '#0b1a4a'
const HUMANITY = 'rgb(28 82 24 / 0.92)'

const FONTS = {
  title: '800 34px Archivo',
  heading: '700 19px Archivo',
  mono: '19px "Share Tech Mono"',
  caption: '12px "Share Tech Mono"',
  hand: '26px "Homemade Apple"',
}

let assetsPromise
function loadAssets() {
  assetsPromise ??= Promise.all([
    loadImage(superEarthLogo),
    loadImage(humanityIcon),
    ...[...Object.values(FONTS), '700 12px Archivo', '800 22px Archivo'].map((f) => document.fonts.load(f)),
  ]).then(([logoImg, stampImg]) => ({ logoImg, stampImg }))
  return assetsPromise
}

const { text, measure, fillLine, cross, stars, wrap, ministryStamp } = createPaper({ ink: INK, pen: PEN, fonts: FONTS })

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ patient, date, diagnoses: { label: string, checked: boolean }[], prescription, physician, code }} data
 */
export async function drawReport(canvas, data) {
  const { logoImg, stampImg } = await loadAssets()
  canvas.width = WIDTH * SCALE
  canvas.height = HEIGHT * SCALE
  const ctx = canvas.getContext('2d')
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0)
  ctx.textBaseline = 'alphabetic'

  // --- Fondo
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.drawImage(tint(logoImg, WATERMARK), 140, 250, 520, 520)
  ctx.drawImage(tint(logoImg, INK), 672, 990, 96, 96)

  // --- Cabecera
  ctx.drawImage(tint(logoImg, INK), 365, 28, 70, 70)
  text(ctx, 'SUPER TIERRA', 400, 138, { font: FONTS.title, align: 'center', stretch: true })
  text(ctx, 'MINISTERIO DE HUMANIDAD', 400, 166, { font: FONTS.mono, align: 'center', spacing: 3 })
  stars(ctx, 400, 186, [9, 11, 13, 16, 13, 11, 9])
  text(ctx, `EMITIDO A BORDO DEL ${SHIP.name.toUpperCase()}`, 400, 216, {
    font: FONTS.caption,
    align: 'center',
    spacing: 2,
  })

  // --- Cuerpo
  const x0 = 55
  text(ctx, 'A QUIEN CORRESPONDA', x0, 262, { font: FONTS.heading, stretch: true })

  fillLine(ctx, 'Se ruega excusar a', data.patient, '(Nombre del paciente)', x0, 335, 745)
  fillLine(ctx, 'de toda actividad el día', data.date, '(Fecha)', x0, 405, 560)

  text(ctx, 'tras el diagnóstico de:', x0, 470, { font: FONTS.mono })
  let y = 518
  if (!data.diagnoses.length) {
    text(ctx, '—', x0 + 10, y, { font: FONTS.mono })
    y += 44
  }
  for (const d of data.diagnoses) {
    ctx.strokeStyle = INK
    ctx.lineWidth = 2
    ctx.strokeRect(x0 + 10, y - 21, 26, 26)
    if (d.checked) cross(ctx, x0 + 10, y - 21, 26)
    text(ctx, d.label, x0 + 56, y, { font: FONTS.mono, maxWidth: 640 })
    y += 44
  }

  y += 30
  text(ctx, 'Prescripción:', x0, y, { font: FONTS.mono })
  y += 36
  for (const line of wrap(ctx, data.prescription || '—', 690, FONTS.mono).slice(0, 3)) {
    text(ctx, line, x0, y, { font: FONTS.mono })
    y += 28
  }

  // --- Firma
  const sigY = Math.max(y + 50, 820)
  text(ctx, 'MÉDICO DE A BORDO:', x0, sigY, { font: FONTS.heading, stretch: true })
  const sigX = x0 + measure(ctx, 'MÉDICO DE A BORDO:', FONTS.heading, true) + 16
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(sigX, sigY + 4)
  ctx.lineTo(sigX + 280, sigY + 4)
  ctx.stroke()
  ctx.save()
  ctx.translate(sigX + 10, sigY - 8)
  ctx.rotate(-0.06)
  text(ctx, signature(data.physician), 0, 0, { font: '32px "Homemade Apple"', color: PEN, maxWidth: 260 })
  ctx.restore()

  // --- Sello del médico
  const sy = sigY + 40
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.strokeRect(x0, sy, 230, 100)
  stars(ctx, x0 + 115, sy + 24, [9, 10, 11, 13, 11, 10, 9])
  text(ctx, data.code || 'MH-000', x0 + 115, sy + 82, { font: '800 42px Archivo', align: 'center', stretch: true, maxWidth: 200 })
  text(ctx, (data.physician || '').toUpperCase(), x0, sy + 132, { font: FONTS.heading, stretch: true, maxWidth: 330 })

  // --- Sello del Ministerio de Humanidad
  ministryStamp(ctx, stampImg, 525, sy + 50, { color: HUMANITY, title: 'VERIFICADO', ministry: 'MINISTERIO DE HUMANIDAD' })

  // --- Pie
  text(ctx, '[EL SERVICIO ES OBLIGATORIO · LOS DESERTORES SERÁN EJECUTADOS]', 400, 1080, {
    font: '700 15px Archivo',
    align: 'center',
    stretch: true,
    maxWidth: 520,
  })
}
