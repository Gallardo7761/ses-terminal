import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Label, Panel } from '@/components/ui.jsx'
import {
  CODE_PREFIX,
  DIAGNOSES,
  MAX_DIAGNOSES,
  PHYSICIANS,
  PRESCRIPTIONS,
  codeSuffix,
  randomDiagnoses,
} from './catalog.js'
import { drawReport } from './drawReport.js'
import { loreDate, slugify } from '@/util/format.js'
import { pick } from '@/util/random.js'
import { SHIP } from '@/lore/ship.js'
import './MedicalReport.css'

const today = () => new Date().toISOString().slice(0, 10)

export default function MedicalReport() {
  const [patient, setPatient] = useState('')
  const [date, setDate] = useState(today)
  const [selected, setSelected] = useState(['freedomitis', 'super-sweats', 'stratagem-tendinitis'])
  const [custom, setCustom] = useState('')
  const [prescription, setPrescription] = useState(PRESCRIPTIONS[0])
  const [physician, setPhysician] = useState(PHYSICIANS[0])
  const [status, setStatus] = useState(null)
  const canvasRef = useRef(null)

  const diagnoses = buildDiagnosisRows(selected, custom)

  useEffect(() => {
    drawReport(canvasRef.current, {
      patient,
      date: loreDate(date),
      diagnoses,
      prescription,
      physician: physician.name,
      code: physician.code.length > CODE_PREFIX.length ? physician.code : `${CODE_PREFIX}000`,
    })
    // `diagnoses` se deriva de selected + custom, por eso no va en la lista
  }, [patient, date, selected, custom, prescription, physician])

  useEffect(() => {
    if (!status) return
    const id = setTimeout(() => setStatus(null), 2000)
    return () => clearTimeout(id)
  }, [status])

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < maxSelectable(custom) ? [...s, id] : s))

  const randomize = () => {
    setSelected(randomDiagnoses(1 + Math.floor(Math.random() * (custom.trim() ? 2 : 3))))
    setPrescription((p) => pick(PRESCRIPTIONS, p))
    setPhysician((p) => pick(PHYSICIANS, p))
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = `justificante-${slugify(patient) || 'ciudadano'}.png`
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
    <div className="mr-layout">
      <Panel
        label="Formulario MH-27B"
        title="Datos del paciente"
        corners
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={randomize}>
              Diagnóstico aleatorio
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
            <span className="hd-field__label">Nombre del paciente</span>
            <input
              className="hd-input"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              placeholder="Helldiver o Superciudadano afectado"
              maxLength={40}
            />
          </label>

          <label className="hd-field">
            <span className="hd-field__label">Fecha de la baja</span>
            <input className="hd-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <div className="hd-field">
            <span className="hd-field__label">
              Diagnóstico · {selected.length + (custom.trim() ? 1 : 0)}/{MAX_DIAGNOSES}
            </span>
            <div className="hd-list mr-diagnoses">
              {DIAGNOSES.map((d) => {
                const active = selected.includes(d.id)
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`hd-list-btn${active ? ' is-active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggle(d.id)}
                  >
                    {d.label}
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
                if (v.trim() && selected.length >= MAX_DIAGNOSES) setSelected((s) => s.slice(0, MAX_DIAGNOSES - 1))
              }}
              placeholder="Otro diagnóstico (opcional)"
              maxLength={42}
            />
          </div>

          <label className="hd-field">
            <span className="hd-field__label">Prescripción</span>
            <textarea
              className="hd-textarea mr-prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              maxLength={180}
            />
          </label>

          <div className="hd-field">
            <span className="hd-field__label">Médico responsable</span>
            <div className="mr-physician">
              <input
                className="hd-input"
                value={physician.name}
                onChange={(e) => setPhysician((p) => ({ ...p, name: e.target.value }))}
                aria-label="Nombre del médico"
                maxLength={30}
              />
              <div className="mr-code">
                <span className="mr-code__prefix" aria-hidden="true">
                  {CODE_PREFIX}
                </span>
                <input
                  className="hd-input"
                  value={physician.code.slice(CODE_PREFIX.length)}
                  onChange={(e) => setPhysician((p) => ({ ...p, code: CODE_PREFIX + codeSuffix(e.target.value) }))}
                  placeholder="000"
                  aria-label={`Código de colegiado (${CODE_PREFIX}…)`}
                />
              </div>
            </div>
          </div>

          <Alert title="Aviso del Ministerio de Humanidad">
            Todo justificante emitido a bordo del {SHIP.name} es revisado por el Ministerio de Humanidad.
            Falsificar uno es traición; emitirlo aquí es atención sanitaria.
          </Alert>
        </div>
      </Panel>

      <div className="mr-preview">
        <Label>Vista previa del documento</Label>
        <canvas ref={canvasRef} className="mr-canvas" role="img" aria-label="Justificante médico generado" />
      </div>
    </div>
  )
}

function buildDiagnosisRows(selected, custom) {
  const rows = DIAGNOSES.filter((d) => selected.includes(d.id)).map((d) => ({ label: d.label, checked: true }))
  if (custom.trim()) rows.push({ label: custom.trim(), checked: true })
  return rows
}

const maxSelectable = (custom) => MAX_DIAGNOSES - (custom.trim() ? 1 : 0)
