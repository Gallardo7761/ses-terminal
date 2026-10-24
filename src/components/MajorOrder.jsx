import { useEffect, useState } from 'react'
import { fetchMajorOrder } from '@/war/majorOrder.js'
import { Alert, Chip, Label, Panel } from './ui.jsx'

const REFRESH_MS = 60_000

export default function MajorOrder() {
  const [state, setState] = useState({ status: 'loading' })
  const now = useNow()

  useEffect(() => {
    let alive = true
    const load = () =>
      fetchMajorOrder()
        .then((order) => alive && setState({ status: 'ready', order }))
        .catch(() => alive && setState((s) => (s.order ? s : { status: 'error' })))
    load()
    const timer = setInterval(load, REFRESH_MS)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [])

  const { status, order } = state

  return (
    <Panel corners className="major-order">
      <div className="major-order__head">
        <Label>{order?.title ?? 'Orden Suprema'} · Alto Mando de Super Tierra</Label>
        {order && <Countdown ms={order.deadline - now} />}
      </div>

      {status === 'loading' && (
        <p className="major-order__brief hd-text-dim">
          Estableciendo enlace con el Alto Mando <span className="hd-caret" />
        </p>
      )}

      {status === 'error' && (
        <Alert tone="danger" title="Orden Suprema clasificada temporalmente">
          El Ministerio de la Verdad está revisando la transmisión. Mantenga la calma y siga luchando.
        </Alert>
      )}

      {status === 'ready' && !order && (
        <Alert title="Sin Orden Suprema activa">
          Aguarde instrucciones del Alto Mando. Mientras tanto, la Libertad no se va a extender sola.
        </Alert>
      )}

      {order && (
        <>
          {order.brief && <p className="major-order__brief">{order.brief}</p>}
          <ul className="major-order__tasks">
            {order.tasks.map((t, i) => (
              <Task key={i} task={t} />
            ))}
          </ul>
          <footer className="major-order__footer">
            {order.medals > 0 && (
              <span>
                Recompensa <strong>{order.medals} medallas</strong>
              </span>
            )}
            <span className="hd-spacer" />
            <span className="hd-rec">Transmisión en directo</span>
          </footer>
        </>
      )}
    </Panel>
  )
}

function Task({ task: t }) {
  // Las tareas de planeta progresan con su liberación; el resto, con el contador de la propia tarea
  const value = t.done ? 100 : t.planet?.liberation ?? (t.current / t.goal) * 100
  const display = t.planet ? `${value.toFixed(1)} %` : `${t.current.toLocaleString('es-ES')} / ${t.goal.toLocaleString('es-ES')}`

  return (
    <li className={`major-order__task${t.done ? ' is-done' : ''}`}>
      <span className="major-order__check" aria-label={t.done ? 'Completada' : 'Pendiente'} />
      <div className="major-order__task-body">
        <div className="major-order__task-row">
          <span className="major-order__task-text">{t.text}</span>
          {t.planet?.sector && <span className="hd-text-mute">Sector {t.planet.sector}</span>}
          <span className="hd-spacer" />
          {!t.done && t.faction && <Chip faction={t.faction} />}
        </div>
        <div className="major-order__progress">
          <span className="major-order__bar" style={{ '--value': value }} />
          <span className="hd-mono">{t.done ? 'Completada' : display}</span>
        </div>
      </div>
    </li>
  )
}

function Countdown({ ms }) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(s / 86400)
  const hms = [Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0'))
  return (
    <span className="major-order__countdown">
      Expira en <strong className="hd-mono">{days > 0 && `${days} d `}{hms.join(':')}</strong>
    </span>
  )
}

function useNow() {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  return now
}
