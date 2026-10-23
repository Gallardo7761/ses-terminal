import superEarthLogo from '@/assets/super-earth.webp'
import defenseIcon from '@/assets/ministries/defense.svg'
import { MINISTRIES } from '@/lore/ministries.js'
import { COMMANDER, SHIP } from '@/lore/ship.js'
import { createPaper, loadImage, signature, tint } from '../shared/paper.js'

export const WIDTH = 800
export const HEIGHT = 1132
const SCALE = 1.5

const PEN = '#0b1a4a'
const DEFENSE = 'rgb(150 22 30 / 0.92)'
const WATERMARK = 'rgb(255 255 255 / 0.55)'

export const THEMES = {
  humanity: { paper: '#cfe8f5', ink: 'rgb(10 30 40 / 0.9)', stamp: 'rgb(28 82 24 / 0.92)', title: 'VERIFICADO' },
  unity: { paper: '#dcefe9', ink: 'rgb(12 38 40 / 0.9)', stamp: 'rgb(16 106 116 / 0.92)', title: 'CONFORME' },
  truth: { paper: '#efe7d6', ink: 'rgb(35 20 30 / 0.9)', stamp: 'rgb(140 26 120 / 0.92)', title: 'APROBADO' },
  science: { paper: '#f2ecd6', ink: 'rgb(40 32 14 / 0.9)', stamp: 'rgb(176 104 0 / 0.92)', title: 'HOMOLOGADO' },
  prosperity: { paper: '#e9e2f1', ink: 'rgb(30 20 45 / 0.9)', stamp: 'rgb(86 56 150 / 0.92)', title: 'AUDITADO' },
}

const FONTS = {
  title: '800 34px Archivo',
  heading: '700 19px Archivo',
  mono: '19px "Share Tech Mono"',
  body: '17px "Share Tech Mono"',
  caption: '12px "Share Tech Mono"',
  hand: '26px "Homemade Apple"',
}

const papers = Object.fromEntries(
  Object.entries(THEMES).map(([id, t]) => [id, createPaper({ ink: t.ink, pen: PEN, fonts: FONTS })]),
)

let assetsPromise
function loadAssets() {
  const ids = Object.keys(THEMES)
  assetsPromise ??= Promise.all([
    loadImage(superEarthLogo),
    loadImage(defenseIcon),
    Promise.all(ids.map((id) => loadImage(MINISTRIES[id].icon))),
    ...[...Object.values(FONTS), '700 12px Archivo', '800 22px Archivo', '800 34px Archivo', '800 42px Archivo'].map(
      (f) => document.fonts.load(f),
    ),
  ]).then(([logoImg, defenseImg, icons]) => ({
    logoImg,
    defenseImg,
    ministryIcons: Object.fromEntries(ids.map((id, i) => [id, icons[i]])),
  }))
  return assetsPromise
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ permitId, applicant, date, duration, reason: { label, heading, ministry, endorser }, details: string[],
 *   conditions, endorser: { name, code }, resolution: { stamp, color } }} data
 */
export async function drawPermit(canvas, data) {
  const { logoImg, defenseImg, ministryIcons } = await loadAssets()
  const theme = THEMES[data.reason.ministry]
  const ministry = MINISTRIES[data.reason.ministry]
  const icon = ministryIcons[data.reason.ministry]
  const { text, measure, fillLine, cross, stars, wrap, ministryStamp } = papers[data.reason.ministry]
  const INK = theme.ink

  canvas.width = WIDTH * SCALE
  canvas.height = HEIGHT * SCALE
  const ctx = canvas.getContext('2d')
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0)
  ctx.textBaseline = 'alphabetic'

  // --- Fondo
  ctx.fillStyle = theme.paper
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.drawImage(tint(icon, WATERMARK), 160, 280, 480, 480)
  ctx.drawImage(tint(logoImg, INK), 672, 990, 96, 96)

  // --- Cabecera
  text(ctx, `PERMISO N.º ${data.permitId}`, 40, 44, { font: FONTS.caption, spacing: 1 })
  ctx.drawImage(tint(icon, INK), 365, 28, 70, 70)
  text(ctx, 'SUPER TIERRA', 400, 138, { font: FONTS.title, align: 'center', stretch: true })
  text(ctx, ministry.name.toUpperCase(), 400, 166, { font: FONTS.mono, align: 'center', spacing: 3 })
  stars(ctx, 400, 186, [9, 11, 13, 16, 13, 11, 9])
  text(ctx, `EXPEDIDO A BORDO DEL ${SHIP.name.toUpperCase()}`, 400, 216, {
    font: FONTS.caption,
    align: 'center',
    spacing: 2,
  })

  // --- Sello permanente del Ministerio de Defensa: es quien excusa del servicio
  ctx.save()
  ctx.translate(668, 100)
  ctx.scale(0.72, 0.72)
  ministryStamp(ctx, defenseImg, 0, 0, { color: DEFENSE, title: 'EXCUSADO', ministry: 'MINISTERIO DE DEFENSA' })
  ctx.restore()

  // --- Cuerpo
  const x0 = 55
  text(ctx, 'PERMISO DE EXCUSA DEL SERVICIO', x0, 258, { font: FONTS.heading, stretch: true })

  fillLine(ctx, 'Se autoriza a', data.applicant, '(Nombre del solicitante)', x0, 318, 745)
  fillLine(ctx, 'a excusarse del servicio durante', data.duration, '(Duración)', x0, 374, 745)
  fillLine(ctx, 'a partir del', data.date, '(Fecha)', x0, 430, 320)
  fillLine(ctx, 'por', data.reason.label, '(Motivo)', 345, 430, 745)

  text(ctx, `${data.reason.heading}:`, x0, 486, { font: FONTS.mono })
  let y = 524
  if (!data.details.length) {
    text(ctx, '—', x0 + 10, y, { font: FONTS.mono })
    y += 36
  }
  for (const label of data.details) {
    ctx.strokeStyle = INK
    ctx.lineWidth = 2
    ctx.strokeRect(x0 + 10, y - 19, 24, 24)
    cross(ctx, x0 + 10, y - 19, 24)
    text(ctx, label, x0 + 52, y, { font: FONTS.mono, maxWidth: 640 })
    y += 36
  }

  y += 14
  text(ctx, 'Condiciones:', x0, y, { font: FONTS.mono })
  y += 30
  for (const line of wrap(ctx, data.conditions || '—', 690, FONTS.body).slice(0, 3)) {
    text(ctx, line, x0, y, { font: FONTS.body })
    y += 26
  }

  // --- Sello de resolución
  resolutionStamp(ctx, text, measure, data.resolution, 610, 590)

  // --- Firma del oficial autorizante
  const sigY = Math.max(y + 46, 880)
  text(ctx, 'OFICIAL AUTORIZANTE:', x0, sigY, { font: FONTS.heading, stretch: true })
  const sigX = x0 + measure(ctx, 'OFICIAL AUTORIZANTE:', FONTS.heading, true) + 16
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(sigX, sigY + 4)
  ctx.lineTo(sigX + 260, sigY + 4)
  ctx.stroke()
  ctx.save()
  ctx.translate(sigX + 10, sigY - 8)
  ctx.rotate(-0.06)
  text(ctx, signature(SHIP.commander.name), 0, 0, { font: '32px "Homemade Apple"', color: PEN, maxWidth: 240 })
  ctx.restore()
  text(ctx, COMMANDER.toUpperCase(), sigX + 130, sigY + 22, { font: FONTS.caption, align: 'center', spacing: 1 })

  // --- Aval del ministerio que expide
  const sy = sigY + 44
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.strokeRect(x0, sy, 230, 84)
  stars(ctx, x0 + 115, sy + 20, [7, 8, 9, 10, 9, 8, 7])
  text(ctx, data.endorser.code, x0 + 115, sy + 72, {
    font: '800 42px Archivo',
    align: 'center',
    stretch: true,
    maxWidth: 200,
  })
  text(ctx, (data.endorser.name || '').toUpperCase(), x0, sy + 112, { font: FONTS.heading, stretch: true, maxWidth: 400 })
  text(ctx, data.reason.endorser.toUpperCase(), x0, sy + 132, { font: FONTS.caption, spacing: 1, maxWidth: 400 })

  // --- Sello del ministerio que expide
  ministryStamp(ctx, icon, 525, sy + 42, { color: theme.stamp, title: theme.title, ministry: ministry.name.toUpperCase() })

  // --- Pie
  text(ctx, '[EL SERVICIO ES OBLIGATORIO · LOS DESERTORES SERÁN EJECUTADOS]', 400, 1100, {
    font: '700 15px Archivo',
    align: 'center',
    stretch: true,
    maxWidth: 520,
  })
}

function resolutionStamp(ctx, text, measure, { stamp, color }, cx, cy) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(0.16)
  ctx.globalAlpha = 0.9
  const w = Math.max(measure(ctx, stamp, '800 34px Archivo', true) + 48, 190)
  ctx.strokeStyle = color
  ctx.lineWidth = 4
  ctx.strokeRect(-w / 2, -34, w, 68)
  ctx.lineWidth = 1.5
  ctx.strokeRect(-w / 2 + 6, -28, w - 12, 56)
  text(ctx, stamp, 0, 12, { font: '800 34px Archivo', color, align: 'center', stretch: true })
  ctx.restore()
}
