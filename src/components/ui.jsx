import { FACTIONS } from '@/lore/factions.js'
import { MINISTRIES } from '@/lore/ministries.js'
import { SuperEarthLogo } from './Icons.jsx'

const cx = (...c) => c.filter(Boolean).join(' ')

export function Label({ children, tone, as: Tag = 'h3', className }) {
  return <Tag className={cx('hd-label', tone && `hd-label--${tone}`, className)}>{children}</Tag>
}

export function Emblem({ size, icon: Icon = SuperEarthLogo }) {
  return (
    <span
      className={cx('hd-emblem', size === 'lg' && 'hd-emblem--lg', Icon === SuperEarthLogo && 'hd-emblem--logo')}
    >
      <Icon />
    </span>
  )
}

export function Banner({ title, subtitle, children, icon, aside }) {
  return (
    <section className="hd-banner hd-fade-in">
      <Emblem size="lg" icon={icon} />
      <div className="hd-banner__body">
        {subtitle && <p className="hd-subtitle">{subtitle}</p>}
        <h1 className="hd-title hd-title--xl hd-title--yellow">{title}</h1>
        {children}
      </div>
      {aside && <div className="hd-banner__aside">{aside}</div>}
    </section>
  )
}

export function Panel({ title, label, actions, footer, corners, dashed, className, children }) {
  return (
    <section className={cx('hd-panel', corners && 'hd-panel--corners', dashed && 'hd-panel--dashed', className)}>
      {(title || label || actions) && (
        <header className="hd-panel__header">
          <div>
            {label && <p className="hd-subtitle">{label}</p>}
            {title && <h2 className="hd-title hd-title--md">{title}</h2>}
          </div>
          <span className="hd-spacer" />
          {actions}
        </header>
      )}
      {children}
      {footer && <footer className="hd-panel__footer">{footer}</footer>}
    </section>
  )
}

export function Button({ variant, size, solid, block, className, children, ...rest }) {
  return (
    <button
      type="button"
      className={cx(
        'hd-btn',
        variant && `hd-btn--${variant}`,
        size && `hd-btn--${size}`,
        solid && 'hd-btn--solid',
        block && 'hd-btn--block',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="hd-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === value}
          className="hd-tab"
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ checked, onChange, children }) {
  return (
    <label className="hd-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="hd-toggle__box" />
      <span>{children}</span>
    </label>
  )
}

export function Stat({ label, value, display }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="hd-stat">
      <span>{label}</span>
      <span className="hd-stat__bar" style={{ '--value': v }} />
      <span className="hd-stat__value">{display ?? String(Math.round(v)).padStart(3, '0')}</span>
    </div>
  )
}

export function Alert({ tone, title, children }) {
  return (
    <div className={cx('hd-alert', tone && `hd-alert--${tone}`)} role="note">
      <div>
        <strong>{title}</strong>
        {children && <p>{children}</p>}
      </div>
    </div>
  )
}

export function Stamp({ tone, children }) {
  return <span className={cx('hd-stamp', tone && `hd-stamp--${tone}`)}>{children}</span>
}

export function Chip({ faction, children }) {
  const f = FACTIONS[faction]
  return <span className={cx('hd-chip', `hd-chip--${f?.css ?? faction}`)}>{children ?? f?.name}</span>
}

export function MinistryBadge({ id, size, caption }) {
  const m = MINISTRIES[id]
  if (!m) return null
  return (
    <span className={cx('hd-ministry', size === 'lg' && 'hd-ministry--lg')} style={{ '--ministry': m.color }}>
      <img src={m.icon} alt="" />
      <span>
        {caption && <small>{caption}</small>}
        {m.name}
      </span>
    </span>
  )
}
