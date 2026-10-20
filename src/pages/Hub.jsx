import { useMemo } from 'react'
import { LockIcon } from '@/components/Icons.jsx'
import { Banner, Label, MinistryBadge, Panel } from '@/components/ui.jsx'
import { DIRECTIVES } from '@/lore/directives.js'
import { MINISTRIES } from '@/lore/ministries.js'
import { COMMANDER, SHIP } from '@/lore/ship.js'
import { Link } from 'react-router'
import { paths } from '@/routes.js'
import { SERVICES } from '@/services/index.js'

export default function Hub() {
  const directive = useMemo(() => DIRECTIVES[Math.floor(Math.random() * DIRECTIVES.length)], [])

  return (
    <>
      <Banner title="Terminal de Servicios" subtitle={`${SHIP.name} · Red de Super Tierra · Sesión monitorizada`}>
        <p>
          Bienvenido, ciudadano. El {SHIP.class} {SHIP.name}, bajo el mando del {SHIP.commander.rank}{' '}
          {SHIP.commander.name}, pone sus servicios a disposición de Helldivers y Superciudadanos a través de la Red
          de Super Tierra. Como {SHIP.commander.role}, el General vela personalmente por que cada consulta, cada
          pulsación y cada pausa sospechosa quede debidamente registrada ante el Ministerio de la Verdad.
        </p>
      </Banner>

      <div className="hub-intro">
        <Panel corners>
          <Label>Orden del día · {COMMANDER}</Label>
          <div className="hub-directive-row">
            <p className="hub-directive">«{directive}»</p>
            <MinistryBadge id="truth" size="lg" caption="Aprobado por el" />
          </div>
        </Panel>
      </div>

      <Label>Servicios disponibles</Label>
      <div className="hd-grid hd-grid--auto">
        {SERVICES.map((s) => (
          <ServiceTile key={s.id} service={s} />
        ))}
      </div>

      <hr className="hd-divider" />

      <Label>Gobierno de Super Tierra</Label>
      <div className="hd-grid hd-grid--auto">
        {Object.entries(MINISTRIES).map(([id, m]) => (
          <div key={id} className={`hub-ministry${id === 'truth' ? ' is-watching' : ''}`} style={{ '--ministry': m.color }}>
            <img src={m.icon} alt="" />
            <div>
              <h3 className="hd-title hd-title--sm">{m.name}</h3>
              <p>«{m.motto}»</p>
              {id === 'truth' && <span className="hd-rec">Supervisando esta terminal</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function ServiceTile({ service: s }) {
  const Icon = s.locked ? LockIcon : s.icon
  const content = (
    <>
      {s.locked && <span className="hd-corner-badge hd-corner-badge--locked" />}
      <span className="hd-tile__icon" style={{ '--tile-accent': s.locked ? 'var(--hd-text-mute)' : s.accent }}>
        <Icon />
      </span>
      <h3 className="hd-title hd-title--sm">{s.name}</h3>
      <p className="hd-tile__desc">{s.locked ? 'Información clasificada. Pendiente de aprobación ministerial.' : s.description}</p>
      {!s.locked && (
        <span className="hd-tile__ministries">
          {s.ministries.map((id) => (
            <MinistryBadge key={id} id={id} />
          ))}
        </span>
      )}
      <span className="hd-tile__meta">
        <span>{s.code}</span>
        <span>{s.locked ? 'Clasificado' : s.audience}</span>
      </span>
    </>
  )

  if (s.locked) {
    return (
      <div className="hd-tile is-locked" aria-disabled="true">
        {content}
      </div>
    )
  }
  return (
    <Link className="hd-tile" to={paths.service(s.id)}>
      {content}
    </Link>
  )
}
