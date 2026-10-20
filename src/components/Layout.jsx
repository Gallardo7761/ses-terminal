import { COMMANDER, SHIP } from '@/lore/ship.js'
import { Link } from 'react-router'
import { paths } from '@/routes.js'
import { Emblem } from './ui.jsx'
import { getLoreYear } from '@/util/year.js'

const DISPATCHES = [
  'Hoy es un día excelente para morir por la Democracia',
  'El escepticismo es la antesala de la traición. Y la traición está muy mal',
  'Los verdaderos héroes no solo combaten en el frente: también vigilan a sus vecinos',
  'El Elemento 710 es seguro, limpio y abundante. Todo rumor de vertidos es obra de disidentes',
  'Un autómata no es un ciudadano. Es un electrodoméstico con malas intenciones',
  'La ciencia de Super Tierra confirma que los termínidos no sienten dolor. No pregunte cómo',
  'Los iluminados han vuelto. La Libertad nunca se fue. Aliste a sus hijos hoy',
  'La Democracia Gestionada le libera de la pesada carga de elegir',
  'Su candidato ya ha sido seleccionado por el algoritmo. Gracias por votar',
  'Liber-Té: la infusión oficial de la Democracia. Ahora con un 3% más de Libertad',
  'Compre bonos de guerra. Los mártires de Cyberstan se lo agradecerán',
]

export function Ticker() {
  const line = DISPATCHES.map((d) => `▲ ${d}`).join('     ')
  return (
    <div className="hd-ticker" aria-hidden="true">
      <div className="hd-ticker__track">
        {line}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{line}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </div>
  )
}

export function TopBar() {
  return (
    <header className="hd-topbar">
      <div className="hd-container hd-topbar__inner">
        <Link className="hd-brand" to={paths.home}>
          <Emblem />
          <span className="hd-brand__text">
            <span className="hd-brand__name">{SHIP.name}</span>
            <span className="hd-brand__tag">{SHIP.class} · Red de Super Tierra</span>
          </span>
        </Link>
        <span className="hd-spacer" />
        <div className="hd-topbar__status">
          <span className="hd-rec">Vigilancia del Ministerio activa</span>
          <span>
            Al mando <strong>{COMMANDER}</strong>
          </span>
          <span className="hd-topbar__year">
            Año <strong>{getLoreYear()}</strong>
          </span>
        </div>
      </div>
    </header>
  )
}

export function Footer({ backTo }) {
  return (
    <footer className="hd-footer">
      <div className="hd-container hd-footer__inner">
        {backTo && (
          <Link className="hd-footer__back" to={backTo}>
            ‹ Volver a la terminal
          </Link>
        )}
        <span className="hd-footer__legal">
          © {getLoreYear()} {SHIP.name} · Servicio ofrecido a través de la Red de Super Tierra · Verificado por el
          Ministerio de la Verdad
        </span>
        <span className="hd-footer__disclaimer">
          Proyecto de fans sin ánimo de lucro. No está afiliado ni respaldado por Arrowhead Game Studios ni por Sony
          Interactive Entertainment. Helldivers™ y todo su contenido relacionado pertenecen a sus respectivos
          propietarios.
        </span>
      </div>
    </footer>
  )
}
