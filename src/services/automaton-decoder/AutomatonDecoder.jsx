import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Chip, Label, Panel, Stamp, Stat, Tabs } from '@/components/ui.jsx'
import { decodeBinary, encodeText, looksBinary } from './binary.js'
import { censor, censorPlain } from './censorship.js'
import { randomTransmission } from './samples.js'
import './AutomatonDecoder.css'
import { getLoreYear } from '@/util/year.js'
import { COMMANDER, SHIP } from '@/lore/ship.js'

const TABS = [
  { id: 'decode', label: 'Descifrar' },
  { id: 'encode', label: 'Cifrar' },
]

const SEPARATORS = [
  { id: 'space', label: 'Espacio', value: ' ' },
  { id: 'none', label: 'Continuo', value: '' },
  { id: 'line', label: 'Por línea', value: '\n' },
]

const NOISE_STEPS = [0, 0.05, 0.1, 0.2, 0.35, 0.5]

export default function AutomatonDecoder() {
  const [mode, setMode] = useState('decode')
  const [binaryInput, setBinaryInput] = useState('')
  const [plainInput, setPlainInput] = useState('')
  const [origin, setOrigin] = useState('Entrada manual')
  const [faction, setFaction] = useState('automaton')
  const [propaganda, setPropaganda] = useState(false)

  return (
    <div className="hd-stack">
      <div className="hd-row">
        <Tabs tabs={TABS} value={mode} onChange={setMode} />
      </div>

      {mode === 'decode' ? (
        <DecodeView
          input={binaryInput}
          setInput={(v) => {
            setBinaryInput(v)
            setOrigin('Entrada manual')
            setPropaganda(false)
          }}
          origin={origin}
          faction={faction}
          propaganda={propaganda}
          onLoadSample={() => {
            const s = randomTransmission()
            setBinaryInput(encodeText(s.text, { noise: 0.03 }))
            setOrigin(s.origin)
            setFaction(s.faction)
            setPropaganda(s.propaganda)
          }}
        />
      ) : (
        <EncodeView
          input={plainInput}
          setInput={setPlainInput}
          onSendToDecoder={(bin) => {
            setBinaryInput(bin)
            setOrigin('Transmisión fabricada (Ministerio)')
            setPropaganda(false)
            setMode('decode')
          }}
        />
      )}
    </div>
  )
}

function DecodeView({ input, setInput, origin, faction, propaganda, onLoadSample }) {
  const result = useMemo(() => decodeBinary(input), [input])
  const { segments, count: redactions } = useMemo(() => censor(result.text), [result.text])
  const revealed = useTypewriter(result.text)
  const reference = useMemo(() => makeReference(), [result.text])
  const [copied, copy] = useCopy()

  const hasInput = input.trim().length > 0
  const wrongField = hasInput && !looksBinary(input)
  const verdict = classify(result, redactions, propaganda)

  const report = () =>
    [
      `${SHIP.name.toUpperCase()} — INFORME DE INTERCEPTACIÓN`,
      `Referencia: ${reference}`,
      `Origen: ${origin}`,
      `Clasificación: ${verdict.label}`,
      `Integridad de señal: ${result.integrity.toFixed(1)}%`,
      `Términos neutralizados: ${redactions}`,
      '',
      censorPlain(result.text),
      '',
      `— Archivado por el ${COMMANDER}, ${SHIP.commander.role}. Copia remitida al Ministerio de la Verdad.`,
    ].join('\n')

  return (
    <div className="ad-layout">
      <Panel
        label="Entrada · Señal interceptada"
        title="Transmisión binaria"
        corners
        footer={
          <>
            <span>{result.bytes} bytes</span>
            <span>{result.bits} bits</span>
            <span className="hd-spacer" />
            <Button size="sm" variant="ghost" onClick={onLoadSample}>
              Cargar intercepción
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setInput('')} disabled={!hasInput}>
              Purgar
            </Button>
          </>
        }
      >
        <div className="hd-stack">
          <textarea
            className="hd-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="01001100 01001001 01000010 01000101 01010010 01010100 01000001 01000100…"
            spellCheck={false}
            aria-label="Transmisión binaria"
          />
          {wrongField && (
            <Alert tone="danger" title="Formato no reconocido">
              Esto no es binario, ciudadano. Para fabricar transmisiones, utilice la pestaña «Cifrar».
            </Alert>
          )}
          <Alert title="Aviso del Ministerio">
            Herramienta destinada a Helldivers en servicio activo. Los Superciudadanos que la utilicen sin motivo
            justificado serán invitados a una charla informativa (obligatoria) con su Oficial de Lealtad. Todas las
            sesiones se graban para su propia protección.
          </Alert>
        </div>
      </Panel>

      <Panel
        label={`Ref. ${reference}`}
        title="Contenido descifrado"
        actions={hasInput && <Stamp tone={verdict.tone}>{verdict.label}</Stamp>}
        footer={
          <>
            <Chip faction={faction} />
            <span>Origen: {origin}</span>
            <span className="hd-spacer" />
            <Button size="sm" onClick={() => copy(report())} disabled={!hasInput}>
              {copied ? 'Copiado' : 'Copiar informe'}
            </Button>
          </>
        }
      >
        <div className="hd-stack">
          <div className="hd-terminal hd-terminal--automaton" aria-live="polite">
            {hasInput ? (
              <>
                <RevealedSegments segments={segments} limit={revealed} />
                {revealed < result.text.length && <span className="hd-caret" />}
              </>
            ) : (
              <span className="hd-terminal__placeholder">
                &gt; A la escucha en todas las frecuencias…
                <span className="hd-caret" />
              </span>
            )}
          </div>

          <div>
            <Label>Análisis</Label>
            <Stat label="Integridad de señal" value={hasInput ? result.integrity : 0} />
            <Stat
              label="Bytes corruptos"
              value={result.bytes ? (result.corrupted / result.bytes) * 100 : 0}
              display={String(result.corrupted).padStart(3, '0')}
            />
            <Stat
              label="Contenido subversivo"
              value={Math.min(100, redactions * 20 + (verdict.propaganda ? 40 : 0))}
              display={String(redactions).padStart(3, '0')}
            />
          </div>

          {verdict.propaganda && (
            <Alert tone="danger" title="Propaganda enemiga detectada">
              Esta transmisión intenta socavar su fe en la Democracia Gestionada. No la reenvíe, no la comente y,
              sobre todo, no la crea. Su exposición ha quedado registrada.
            </Alert>
          )}

          {redactions > 0 && (
            <Alert tone="success" title={`${redactions} término(s) neutralizado(s)`}>
              El Ministerio de la Verdad ha retirado las ideas peligrosas antes de que alcanzaran su cerebro. No es necesario que dé las gracias. Pero puede.
            </Alert>
          )}
        </div>
      </Panel>
    </div>
  )
}

function EncodeView({ input, setInput, onSendToDecoder }) {
  const [sepIndex, setSepIndex] = useState(0)
  const [noiseIndex, setNoiseIndex] = useState(0)
  const [copied, copy] = useCopy()

  const separator = SEPARATORS[sepIndex]
  const noise = NOISE_STEPS[noiseIndex]
  const output = useMemo(
    () => encodeText(input, { separator: separator.value, noise }),
    [input, separator.value, noise],
  )

  return (
    <div className="ad-layout">
      <Panel
        label="Módulo de entrenamiento"
        title="Simulacro de intercepción"
        corners
        footer={
          <>
            <span>{input.length} caracteres</span>
            <span className="hd-spacer" />
            <Button size="sm" variant="ghost" onClick={() => setInput('')} disabled={!input}>
              Purgar
            </Button>
          </>
        }
      >
        <div className="hd-stack">
          <textarea
            className="hd-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Redacte lo que el enemigo «ha dicho»…"
            aria-label="Mensaje en texto plano"
          />
          <div className="ad-settings">
            <SettingRow label="Formato">
              <Stepper
                value={separator.label}
                onPrev={() => setSepIndex((i) => (i - 1 + SEPARATORS.length) % SEPARATORS.length)}
                onNext={() => setSepIndex((i) => (i + 1) % SEPARATORS.length)}
              />
            </SettingRow>
            <SettingRow label="Interferencia">
              <Stepper
                value={noise === 0 ? 'Ninguna' : `${Math.round(noise * 100)}%`}
                onPrev={() => setNoiseIndex((i) => Math.max(0, i - 1))}
                onNext={() => setNoiseIndex((i) => Math.min(NOISE_STEPS.length - 1, i + 1))}
              />
            </SettingRow>
          </div>
          <Alert title="Nota para el operador">
            La interferencia sustituye bytes al azar por basura: ideal para intercepciones «dañadas» que los
            Helldivers deban interpretar. Correctamente.
          </Alert>
        </div>
      </Panel>

      <Panel
        label="Salida"
        title="Binario"
        footer={
          <>
            <span>{output ? output.replace(/\s/g, '').length : 0} bits</span>
            <span className="hd-spacer" />
            <Button size="sm" variant="ghost" onClick={() => onSendToDecoder(output)} disabled={!input}>
              Probar en descifrador
            </Button>
            <Button size="sm" onClick={() => copy(output)} disabled={!input}>
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </>
        }
      >
        <div className="hd-terminal">
          {output || <span className="hd-terminal__placeholder">&gt; Sin datos que cifrar</span>}
        </div>
      </Panel>
    </div>
  )
}

function RevealedSegments({ segments, limit }) {
  let remaining = limit
  return segments.map((seg, i) => {
    if (remaining <= 0) return null
    const text = seg.text.slice(0, remaining)
    remaining -= seg.text.length
    return seg.redacted ? (
      <span key={i} className="hd-redacted" title="Contenido retirado por el Ministerio de la Verdad">
        {text}
      </span>
    ) : (
      <span key={i}>{text}</span>
    )
  })
}

function SettingRow({ label, children }) {
  return (
    <div className="ad-setting">
      <span className="hd-field__label">{label}</span>
      {children}
    </div>
  )
}

function Stepper({ value, onPrev, onNext }) {
  return (
    <div className="hd-stepper">
      <button type="button" onClick={onPrev} aria-label="Anterior">
        ◀
      </button>
      <span className="hd-stepper__value">{value}</span>
      <button type="button" onClick={onNext} aria-label="Siguiente">
        ▶
      </button>
    </div>
  )
}

function classify(result, redactions, propaganda) {
  if (!result.bytes) return { label: 'Sin señal', tone: 'yellow' }
  if (propaganda || redactions > 0) return { label: 'Propaganda hostil', tone: 'red', propaganda: true }
  if (result.integrity < 70) return { label: 'Señal degradada', tone: 'yellow' }
  return { label: 'Inteligencia verificada', tone: undefined }
}

function makeReference() {
  const n = () => Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `MV-${getLoreYear()}-${n()}-${n()}`
}

function useTypewriter(text) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0)
    if (!text) return
    const step = Math.max(1, Math.ceil(text.length / 90)) // ~1.5 s
    const id = setInterval(() => {
      setCount((c) => {
        const next = c + step
        if (next >= text.length) clearInterval(id)
        return Math.min(next, text.length)
      })
    }, 16)
    return () => clearInterval(id)
  }, [text])
  return count
}

function useCopy() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(id)
  }, [copied])
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch { }
  }
  return [copied, copy]
}
