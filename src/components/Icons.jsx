import superEarthLogo from '@/assets/super-earth.webp'

export function SuperEarthLogo({ className, ...props }) {
  return (
    <span
      className={className ? `hd-logo ${className}` : 'hd-logo'}
      style={{ '--logo': `url(${superEarthLogo})` }}
      aria-hidden="true"
      {...props}
    />
  )
}

export function BinaryIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M5 4h4v10H5V8H3V6h2V4Zm8 0h6v10h-6V4Zm2 2v6h2V6h-2Zm8-2h4v10h-4V8h-2V6h2V4ZM3 18h6v10H3V18Zm2 2v6h2v-6H5Zm8-2h4v10h-4v-6h-2v-2h2v-2Zm8 0h6v10h-6V18Zm2 2v6h2v-6h-2Z" />
    </svg>
  )
}

export function AutomatonIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M6 4h20l3 6v12l-5 6H8l-5-6V10l3-6Zm3 9v4h5v-4H9Zm9 0v4h5v-4h-5Zm-6 8v3h8v-3h-8Z" />
    </svg>
  )
}

export function LockIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M16 3a7 7 0 0 0-7 7v4H6v15h20V14h-3v-4a7 7 0 0 0-7-7Zm-3 7a3 3 0 0 1 6 0v4h-6v-4Zm1.5 9h3v6h-3v-6Z" />
    </svg>
  )
}

export function EyeIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M16 7C9 7 3.6 11.4 1 16c2.6 4.6 8 9 15 9s12.4-4.4 15-9c-2.6-4.6-8-9-15-9Zm0 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-7a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </svg>
  )
}

export function StratagemIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M16 2 6 14h7v16h6V14h7L16 2Z" />
    </svg>
  )
}

export function GlobeIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28Zm9.8 12h-4.9a22 22 0 0 0-2-8.6A10.1 10.1 0 0 1 25.8 14ZM16 6.2c1.2 1.6 2.4 4.4 2.8 7.8h-5.6c.4-3.4 1.6-6.2 2.8-7.8ZM13.1 5.4a22 22 0 0 0-2 8.6H6.2a10.1 10.1 0 0 1 6.9-8.6ZM6.2 18h4.9a22 22 0 0 0 2 8.6A10.1 10.1 0 0 1 6.2 18Zm9.8 7.8c-1.2-1.6-2.4-4.4-2.8-7.8h5.6c-.4 3.4-1.6 6.2-2.8 7.8Zm2.9.8a22 22 0 0 0 2-8.6h4.9a10.1 10.1 0 0 1-6.9 8.6Z" />
    </svg>
  )
}

export function MedicalIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M6 3h20v4h-2v22H8V7H6V3Zm8 8v4h-4v4h4v4h4v-4h4v-4h-4v-4h-4Z" />
    </svg>
  )
}

export function BondIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M3 7h26v18H3V7Zm4 4v10h18V11H7Zm9 1.5 1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4 1.4-2.9Z" />
    </svg>
  )
}
