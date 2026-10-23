export const OFFENSES = [
  { id: 'questioned-orders', label: 'Cuestionar órdenes del Alto Mando' },
  { id: 'liber-tea', label: 'Rechazar una taza de Liber-Té' },
  { id: 'automaton-sympathy', label: 'Simpatía hacia los Autómatas' },
  { id: 'binary-dreams', label: 'Soñar en binario' },
  { id: 'weak-salute', label: 'Saludo a la bandera insuficiente' },
  { id: 'early-extraction', label: 'Solicitar la extracción antes de tiempo' },
  { id: 'illuminate-literature', label: 'Posesión de literatura iluminada' },
  { id: 'casualty-doubts', label: 'Dudar de las cifras oficiales de bajas' },
  { id: 'peace-word', label: 'Pronunciar la palabra «paz»' },
  { id: 'dirty-cape', label: 'Capa en estado lamentable' },
  { id: 'no-reports', label: 'No haber denunciado a nadie esta semana' },
  { id: 'enemy-music', label: 'Tararear transmisiones enemigas' },
]

export const THREAT_LEVELS = [
  { id: 'low', label: 'Leve', stamp: 'SOSPECHOSO' },
  { id: 'moderate', label: 'Moderada', stamp: 'EN VIGILANCIA' },
  { id: 'severe', label: 'Grave', stamp: 'DISIDENTE' },
  { id: 'treason', label: 'Traición', stamp: 'TRAIDOR' },
]

export const LOCATIONS = [
  'Cantina del destructor',
  'Puente de mando',
  'Armería',
  'Cola de la hellpod',
  'Canal de comunicaciones del escuadrón',
  'Malevelon Creek',
  'Zona de extracción',
  'Sala de visionado obligatorio',
]

export const STATEMENTS = [
  'Durante el desayuno, el sospechoso preguntó en voz alta si la guerra terminaría algún día. Nadie supo qué contestar. Lo anoto por si acaso.',
  'Le oí decir que los autómatas «también tienen derechos». Después se rió, pero no lo suficiente.',
  'Se negó a aplaudir durante el noticiario del Ministerio alegando que «ya lo había visto». Nadie ha visto nunca suficiente noticiario.',
  'Lleva tres misiones sin gritar «¡Por la Democracia!» al aterrizar. Sospecho que lo sustituye por un silencio subversivo.',
  'Encontré en su taquilla un libro sin sello del Ministerio. Parecía de poesía. Ya me entienden.',
  'Afirmó que la retirada en Malevelon Creek fue «una derrota». Todos sabemos que fue una victoria estratégica en dirección contraria.',
]

export const MEASURES = [
  'Reeducación intensiva: 72 horas de programación del Ministerio sin pausas publicitarias.',
  'Reasignación inmediata a la primera línea de Malevelon Creek.',
  'Revisión completa de sus comunicaciones desde su nacimiento. Y las de sus padres.',
  'Lectura del manual del Helldiver, edición íntegra, en voz alta y en posición de firmes.',
  'Adquisición voluntaria y obligatoria de 50 bonos de guerra.',
  'Despliegue sin capa durante tres operaciones, para que todos vean su vergüenza.',
  'Ninguna. El sospechoso ya ha sido corregido. No pregunte cómo.',
]

export const MAX_OFFENSES = 4

export function randomOffenses(n = 3) {
  return [...OFFENSES]
    .sort(() => Math.random() - 0.5)
    .slice(0, n)
    .map((o) => o.id)
}

export const caseNumber = () => String(Math.floor(Math.random() * 1e6)).padStart(6, '0')
