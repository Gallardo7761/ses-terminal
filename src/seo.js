import { SHIP } from './lore/ship.js'
import { paths } from './routes.js'
import { SERVICE_META } from './services/meta.js'

export const OG_SIZE = { width: 1200, height: 630 }

export function getPages() {
  return [
    {
      path: paths.home,
      slug: 'home',
      title: `${SHIP.name} · Terminal de Servicios`,
      heading: 'Terminal de Servicios',
      description: `Servicios del ${SHIP.class} ${SHIP.name} para Helldivers y Superciudadanos, a través de la Red de Super Tierra.`,
      color: '#ffe900',
    },
    ...SERVICE_META.filter((s) => !s.locked).map((s) => ({
      path: paths.service(s.id),
      slug: s.id,
      title: `${s.name} · ${SHIP.name}`,
      heading: s.name,
      description: s.description,
      color: s.accent,
      ministries: s.ministries,
      code: s.code,
    })),
  ]
}

export const findPage = (pathname) => getPages().find((p) => p.path === (pathname.replace(/\/+$/, '') || '/'))

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function metaTags(page, siteUrl) {
  const url = siteUrl + page.path
  const image = `${siteUrl}/og/${page.slug}.png`
  return [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<meta name="theme-color" content="${page.color}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="es_ES" />`,
    `<meta property="og:site_name" content="${escape(SHIP.name)}" />`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="${OG_SIZE.width}" />`,
    `<meta property="og:image:height" content="${OG_SIZE.height}" />`,
    `<meta property="og:image:alt" content="${escape(page.heading)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ')
}
