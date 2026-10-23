import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Label, Panel } from '@/components/ui.jsx'
import {
  DURATIONS,
  MAX_DETAILS,
  REASONS,
  RESOLUTIONS,
  codePrefix,
  codeSuffix,
  findReason,
  permitNumber,
  randomDetails,
} from './catalog.js'
import { THEMES, drawPermit } from './drawPermit.js'
import { loreDate, slugify } from '@/util/format.js'
import { pick } from '@/util/random.js'
import { toLoreYear } from '@/util/year.js'
import { MINISTRIES } from '@/lore/ministries.js'
import { COMMANDER, SHIP } from '@/lore/ship.js'
import './LeavePermit.css'

const today = () => new Date().toISOString().slice(0, 10)

export default function LeavePermit() {
  const [permitId] = useState(permitNumber)
  const [applicant, setApplicant] = useState('')
  const [date, setDate] = useState(today)
  const [duration, setDuration] = useState(DURATIONS[1])
  const [reasonId, setReasonId] = useState(REASONS[0].id)
  const [selected, setSelected] = useState(REASONS[0].details.slice(0, 3))
  const [custom, setCustom] = useState('')
  const [conditions, setConditions] = useState(REASONS[0].conditions[0])
  const [endorser, setEndorser] = useState(REASONS[0].endorsers[0])
  const [resolution, setResolution] = useState(RESOLUTIONS[0])
  const [status, setStatus] = useState(null)
  const canvasRef = useRef(null)

  const reason = findReason(reasonId)
  const prefix = codePrefix(reason)
  const details = buildDetailRows(reason, selected, custom)

  useEffect(() => {
    drawPermit(canvasRef.current, {
      permitId: `PD/${toLoreYear((date || today()).slice(0, 4))}/${permitId}`,
      applicant,
      date: loreDate(date),
      duration,
      reason,
      details,
      conditions,
      endorser: { ...endorser, code: endorser.code.length > prefix.length ? endorser.code : `${prefix}000` },
      resolution,
    })
    // `reason`, `prefix` y `details` se derivan del resto del estado, por eso no van en la lista
  }, [permitId, applicant, date, duration, reasonId, selected, custom, conditions, endorser, resolution])

  useEffect(() => {
    if (!status) return
    const id = setTimeout(() => setStatus(null), 2000)
    return () => clearTimeout(id)
  }, [status])

  const selectReason = (r, n = 3) => {
    setReasonId(r.id)
    setSelected(randomDetails(r, Math.min(n, maxSelectable(custom))))
    setConditions(pick(r.conditions))
    setEndorser(pick(r.endorsers))
  }

  const toggle = (label) =>
    setSelected((s) =>
      s.includes(label) ? s.filter((x) => x !== label) : s.length < maxSelectable(custom) ? [...s, label] : s,
    )

  const randomize = () => {
    selectReason(pick(REASONS, reason), 1 + Math.floor(Math.random() * 3))
    setDuration((d) => pick(DURATIONS, d))
    setResolution((r) => pick(RESOLUTIONS, r))
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = `permiso-${slugify(applicant) || 'ciudadano'}.png`
    a.click()
  }

  const copyImage = async () => {
    try {
      const blob = await new Promise((r) => canvasRef.current.toBlob(r, 'image/png'))
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setStatus('Imagen copiada')
    } catch {
      setStatus('Su navegador no lo permite')
    }
  }

  return (
    <div className="lp-layout">
      <Panel
        label="Formulario MD-27B"
        title="Solicitud de permiso"
        corners
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={randomize}>
              Excusa aleatoria
            </Button>
            <span className="hd-spacer" />
            <Button size="sm" variant="ghost" onClick={copyImage}>
              {status ?? 'Copiar imagen'}
            </Button>
            <Button size="sm" solid onClick={download}>
              Descargar
            </Button>
          </>
        }
      >
        <div className="hd-stack">
          <label className="hd-field">
            <span className="hd-field__label">Nombre del solicitante</span>
            <input
              className="hd-input"
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
              placeholder="Helldiver o Superciudadano que se excusa"
              maxLength={40}
            />
          </label>

          <div className="lp-row">
            <label className="hd-field">
              <span className="hd-field__label">A partir del</span>
              <input className="hd-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="hd-field">
              <span className="hd-field__label">Duración</span>
              <input
                className="hd-input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                list="lp-durations"
                maxLength={28}
              />
              <datalist id="lp-durations">
                {DURATIONS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </label>
          </div>

          <div className="hd-field">
            <span className="hd-field__label">Motivo · lo expide el {MINISTRIES[reason.ministry].name}</span>
            <div className="hd-list lp-reasons" role="radiogroup" aria-label="Motivo">
              {REASONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  className={`hd-list-btn${reasonId === r.id ? ' is-active' : ''}`}
                  aria-checked={reasonId === r.id}
                  onClick={() => reasonId !== r.id && selectReason(r)}
                >
                  <img className="lp-reasons__icon" src={MINISTRIES[r.ministry].icon} alt="" />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hd-field">
            <span className="hd-field__label">
              {reason.heading} · {selected.length + (custom.trim() ? 1 : 0)}/{MAX_DETAILS}
            </span>
            <div className="hd-list lp-options">
              {reason.details.map((d) => {
                const active = selected.includes(d)
                return (
                  <button
                    key={d}
                    type="button"
                    className={`hd-list-btn${active ? ' is-active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggle(d)}
                  >
                    {d}
                    <span className="hd-list-btn__value">{active ? '✔' : ''}</span>
                  </button>
                )
              })}
            </div>
            <input
              className="hd-input"
              value={custom}
              onChange={(e) => {
                const v = e.target.value
                setCustom(v)
                if (v.trim() && selected.length >= MAX_DETAILS) setSelected((s) => s.slice(0, MAX_DETAILS - 1))
              }}
              placeholder="Otro (opcional)"
              maxLength={42}
            />
          </div>

          <div className="hd-field">
            <span className="hd-field__label">{reason.endorser}</span>
            <div className="lp-endorser">
              <input
                className="hd-input"
                value={endorser.name}
                onChange={(e) => setEndorser((p) => ({ ...p, name: e.target.value }))}
                aria-label={`Nombre del ${reason.endorser.toLowerCase()}`}
                maxLength={30}
              />
              <div className="lp-code">
                <span className="lp-code__prefix" aria-hidden="true">
                  {prefix}
                </span>
                <input
                  className="hd-input"
                  value={endorser.code.slice(prefix.length)}
                  onChange={(e) => setEndorser((p) => ({ ...p, code: prefix + codeSuffix(e.target.value, prefix) }))}
                  placeholder="000"
                  aria-label={`Código de acreditación (${prefix}…)`}
                />
              </div>
            </div>
          </div>

          <label className="hd-field">
            <span className="hd-field__label">Condiciones</span>
            <textarea
              className="hd-textarea lp-textarea"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              maxLength={180}
            />
          </label>

          <div className="hd-field">
            <span className="hd-field__label">Resolución</span>
            <div className="hd-list lp-resolution" role="radiogroup" aria-label="Resolución">
              {RESOLUTIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  className={`hd-list-btn${resolution.id === r.id ? ' is-active' : ''}`}
                  aria-checked={resolution.id === r.id}
                  onClick={() => setResolution(r)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hd-field">
            <span className="hd-field__label">Oficial autorizante</span>
            <p className="lp-officer">
              {COMMANDER} · <span>{SHIP.commander.rank}</span>
            </p>
          </div>

          <Alert title="Aviso del Ministerio de Defensa">
            Todo permiso expedido a bordo del {SHIP.name} queda sujeto a revocación inmediata si la Democracia lo
            requiere. Que es siempre.
          </Alert>
        </div>
      </Panel>

      <div className="lp-preview">
        <Label>Vista previa del documento</Label>
        <canvas
          ref={canvasRef}
          className="lp-canvas"
          style={{ background: THEMES[reason.ministry].paper }}
          role="img" aria-label="Permiso de excusa del servicio generado"
        />
      </div>
    </div>
  )
}

function buildDetailRows(reason, selected, custom) {
  const rows = reason.details.filter((d) => selected.includes(d))
  if (custom.trim()) rows.push(custom.trim())
  return rows
}

const maxSelectable = (custom) => MAX_DETAILS - (custom.trim() ? 1 : 0)
