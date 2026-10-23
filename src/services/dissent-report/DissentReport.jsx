import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Label, Panel, Toggle } from '@/components/ui.jsx'
import {
  LOCATIONS,
  MAX_OFFENSES,
  MEASURES,
  OFFENSES,
  STATEMENTS,
  THREAT_LEVELS,
  caseNumber,
  randomOffenses,
} from './catalog.js'
import { drawDissent } from './drawDissent.js'
import { loreDate, slugify } from '@/util/format.js'
import { pick } from '@/util/random.js'
import { toLoreYear } from '@/util/year.js'
import { COMMANDER, SHIP } from '@/lore/ship.js'
import './DissentReport.css'

const today = () => new Date().toISOString().slice(0, 10)

export default function DissentReport() {
  const [caseId] = useState(caseNumber)
  const [suspect, setSuspect] = useState('')
  const [informant, setInformant] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [date, setDate] = useState(today)
  const [location, setLocation] = useState(LOCATIONS[0])
  const [selected, setSelected] = useState(['questioned-orders', 'liber-tea'])
  const [custom, setCustom] = useState('')
  const [threat, setThreat] = useState(THREAT_LEVELS[2])
  const [statement, setStatement] = useState(STATEMENTS[0])
  const [measure, setMeasure] = useState(MEASURES[0])
  const [status, setStatus] = useState(null)
  const canvasRef = useRef(null)

  const offenses = buildOffenseRows(selected, custom)

  useEffect(() => {
    drawDissent(canvasRef.current, {
      caseId: `MV/${toLoreYear((date || today()).slice(0, 4))}/${caseId}`,
      suspect,
      informant,
      anonymous,
      date: loreDate(date),
      location,
      offenses,
      threat,
      statement,
      measure,
    })
    // `offenses` se deriva de selected + custom, por eso no va en la lista
  }, [caseId, suspect, informant, anonymous, date, location, selected, custom, threat, statement, measure])

  useEffect(() => {
    if (!status) return
    const id = setTimeout(() => setStatus(null), 2000)
    return () => clearTimeout(id)
  }, [status])

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < maxSelectable(custom) ? [...s, id] : s))

  const randomize = () => {
    setSelected(randomOffenses(1 + Math.floor(Math.random() * (custom.trim() ? 2 : 3))))
    setLocation((l) => pick(LOCATIONS, l))
    setThreat((t) => pick(THREAT_LEVELS, t))
    setStatement((s) => pick(STATEMENTS, s))
    setMeasure((m) => pick(MEASURES, m))
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = `denuncia-${slugify(suspect) || 'sospechoso'}.png`
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
    <div className="dr-layout">
      <Panel
        label="Formulario MV-1984"
        title="Datos de la denuncia"
        corners
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={randomize}>
              Denuncia aleatoria
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
            <span className="hd-field__label">Ciudadano denunciado</span>
            <input
              className="hd-input"
              value={suspect}
              onChange={(e) => setSuspect(e.target.value)}
              placeholder="Helldiver o Superciudadano sospechoso"
              maxLength={40}
            />
          </label>

          <div className="hd-field">
            <span className="hd-field__label">Denunciante</span>
            <input
              className="hd-input"
              value={informant}
              onChange={(e) => setInformant(e.target.value)}
              placeholder="Su nombre, ciudadano ejemplar"
              maxLength={40}
              disabled={anonymous}
              aria-label="Nombre del denunciante"
            />
            <Toggle checked={anonymous} onChange={setAnonymous}>
              Denuncia anónima (el Ministerio sí lo sabrá)
            </Toggle>
          </div>

          <div className="dr-row">
            <label className="hd-field">
              <span className="hd-field__label">Fecha de los hechos</span>
              <input className="hd-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="hd-field">
              <span className="hd-field__label">Lugar de los hechos</span>
              <input
                className="hd-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                list="dr-locations"
                maxLength={36}
              />
              <datalist id="dr-locations">
                {LOCATIONS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </label>
          </div>

          <div className="hd-field">
            <span className="hd-field__label">
              Conductas observadas · {selected.length + (custom.trim() ? 1 : 0)}/{MAX_OFFENSES}
            </span>
            <div className="hd-list dr-options">
              {OFFENSES.map((o) => {
                const active = selected.includes(o.id)
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={`hd-list-btn${active ? ' is-active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggle(o.id)}
                  >
                    {o.label}
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
                if (v.trim() && selected.length >= MAX_OFFENSES) setSelected((s) => s.slice(0, MAX_OFFENSES - 1))
              }}
              placeholder="Otra conducta (opcional)"
              maxLength={42}
            />
          </div>

          <div className="hd-field">
            <span className="hd-field__label">Nivel de amenaza</span>
            <div className="hd-list dr-threat" role="radiogroup" aria-label="Nivel de amenaza">
              {THREAT_LEVELS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  className={`hd-list-btn${threat.id === t.id ? ' is-active' : ''}`}
                  aria-checked={threat.id === t.id}
                  onClick={() => setThreat(t)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <label className="hd-field">
            <span className="hd-field__label">Declaración del denunciante</span>
            <textarea
              className="hd-textarea dr-textarea"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              maxLength={220}
            />
          </label>

          <label className="hd-field">
            <span className="hd-field__label">Medida recomendada</span>
            <textarea
              className="hd-textarea dr-textarea"
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              maxLength={130}
            />
          </label>

          <div className="hd-field">
            <span className="hd-field__label">Oficial receptor</span>
            <p className="dr-officer">
              {COMMANDER} · <span>{SHIP.commander.role}</span>
            </p>
          </div>

          <Alert title="Aviso del Ministerio de la Verdad">
            Toda denuncia emitida a bordo del {SHIP.name} queda archivada para siempre. Las denuncias falsas también
            son denunciables. Gracias por su vigilancia.
          </Alert>
        </div>
      </Panel>

      <div className="dr-preview">
        <Label>Vista previa del documento</Label>
        <canvas ref={canvasRef} className="dr-canvas" role="img" aria-label="Informe de disidencia generado" />
      </div>
    </div>
  )
}

function buildOffenseRows(selected, custom) {
  const rows = OFFENSES.filter((o) => selected.includes(o.id)).map((o) => o.label)
  if (custom.trim()) rows.push(custom.trim())
  return rows
}

const maxSelectable = (custom) => MAX_OFFENSES - (custom.trim() ? 1 : 0)
