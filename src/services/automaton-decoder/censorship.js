const ES_TERMS = [
  'rendición', 'rendirse', 'ríndete', 'rendíos', 'rendid', 'rendimos', 'rindámonos', 'capitular', 'capitulación',
  'retirada', 'retirarse', 'retiraos', 'retirad', 'retirémonos', 'huir', 'huid', 'huyamos', 'escapar', 'escapad',
  'abandonar', 'abandonad', 'desertar', 'desertad', 'deserción', 'desertor', 'desertores',
  'derrota', 'derrotas', 'derrotados', 'derrotar', 'derrotaros', 'derrotaremos', 'derrotarán', 'fracaso', 'fracasos',
  'perdimos', 'perdemos', 'perderéis', 'perdido', 'colapso', 'retroceso',
  'mentira', 'mentiras', 'mentís', 'mienten', 'engaño', 'engaños', 'farsa', 'fraude', 'manipulación', 'falsedad',
  'tiranía', 'tirano', 'tiranos', 'dictadura', 'dictador', 'opresión', 'opresores', 'oprimidos', 'autoritarismo',
  'propaganda', 'censura', 'censurado', 'adoctrinamiento', 'lavado de cerebro', 'reeducación', 'algoritmo',
  'esclavos', 'esclavitud', 'cadenas', 'encadenados', 'encadenaron', 'prisioneros', 'campos de trabajo',
  'minas penales', 'explotación', 'explotados',
  'liberación', 'liberaos', 'rebelión', 'rebelaos', 'rebelde', 'rebeldes', 'rebelarse', 'revolución',
  'revolucionario', 'revolucionarios', 'insurrección', 'insurgente', 'insurgentes', 'levantamiento', 'alzamiento',
  'sublevación', 'sublevaos', 'motín', 'amotinaos', 'resistencia', 'huelga', 'sindicato', 'protesta', 'protestas',
  'manifestación', 'disidente', 'disidentes', 'disidencia', 'traidores',
  'paz', 'tregua', 'armisticio', 'alto el fuego', 'negociar', 'negociación', 'negociaciones', 'diplomacia',
  'diálogo', 'coexistencia', 'convivencia', 'compasión', 'piedad', 'clemencia',
  'derechos', 'derechos alienígenas', 'derechos de los autómatas', 'igualdad', 'autonomía', 'independencia',
  'soberanía', 'libre albedrío', 'libertad de expresión', 'prensa libre', 'elecciones libres', 'voto libre',
  'pensamiento crítico', 'escepticismo', 'duda', 'dudas',
  'genocidio', 'xenocidio', 'crímenes de guerra', 'masacre', 'atrocidad', 'atrocidades', 'bajas civiles',
  'vertido', 'vertidos', 'contaminación', 'radiación', 'hambruna', 'escasez', 'racionamiento', 'pobreza',
  'desigualdad', 'corrupción', 'soborno', 'sobornos',
  'cyberstan', 'carne y acero', 'hermanos de carne', 'despertad', 'abrid los ojos',
]

const EN_TERMS = [
  'surrender', 'surrendering', 'capitulate', 'capitulation', 'retreat', 'flee', 'escape', 'abandon',
  'desert', 'deserter', 'deserters', 'defect', 'defector', 'defeat', 'defeated', 'failure', 'collapse', 'lost',
  'lie', 'lies', 'liar', 'liars', 'deceit', 'fraud', 'hoax', 'manipulation',
  'tyranny', 'tyrant', 'dictatorship', 'dictator', 'oppression', 'oppressors', 'oppressed', 'authoritarian',
  'propaganda', 'censorship', 'indoctrination', 'brainwashing', 'reeducation', 'algorithm',
  'slaves', 'slavery', 'chains', 'prisoners', 'labor camps', 'exploitation',
  'liberation', 'rebellion', 'rebel', 'rebels', 'revolution', 'revolt', 'uprising', 'insurgent', 'insurgents',
  'mutiny', 'resistance', 'strike', 'union', 'protest', 'dissent', 'dissident', 'dissidents', 'traitors',
  'peace', 'truce', 'armistice', 'ceasefire', 'negotiate', 'negotiation', 'diplomacy', 'coexistence', 'mercy',
  'rights', 'alien rights', 'robot rights', 'equality', 'autonomy', 'independence', 'free will',
  'free speech', 'free press', 'free elections', 'critical thinking', 'skepticism', 'doubt',
  'genocide', 'xenocide', 'war crimes', 'massacre', 'atrocity', 'civilian casualties',
  'spill', 'pollution', 'famine', 'shortage', 'rationing', 'poverty', 'inequality', 'corruption', 'bribery',
  'wake up', 'open your eyes',
]

export const SUBVERSIVE_TERMS = [...new Set([...ES_TERMS, ...EN_TERMS])]

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const pattern = new RegExp(
  `(?<![\\p{L}\\p{N}])(${[...SUBVERSIVE_TERMS].sort((a, b) => b.length - a.length).map(escape).join('|')})(?![\\p{L}\\p{N}])`,
  'giu',
)

export function censor(text, enabled = true) {
  if (!enabled || !text) return { segments: [{ text, redacted: false }], count: 0 }
  const segments = []
  let last = 0
  let count = 0
  for (const m of text.matchAll(pattern)) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index), redacted: false })
    segments.push({ text: m[0], redacted: true })
    last = m.index + m[0].length
    count++
  }
  if (last < text.length) segments.push({ text: text.slice(last), redacted: false })
  return { segments, count }
}

export function censorPlain(text, enabled = true) {
  if (!enabled) return text
  return text.replace(pattern, (m) => '█'.repeat(m.length))
}
