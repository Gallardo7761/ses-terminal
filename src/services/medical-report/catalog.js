export const DIAGNOSES = [
  { id: 'freedomitis', label: 'Libertitis aguda' },
  { id: 'super-sweats', label: 'Super Sudores patrióticos' },
  { id: 'stratagem-tendinitis', label: 'Tendinitis del brazo de estratagemas' },
  { id: 'malevelon-flashbacks', label: 'Flashbacks de Malevelon Creek' },
  { id: 'acid-allergy', label: 'Alergia al ácido termínido' },
  { id: 'hellpod-back-pain', label: 'Lumbalgia por la hellpod' },
  { id: 'e710-inhalation', label: 'Exceso de inhalación de Elemento 710' },
  { id: 'bomb-deafness', label: 'Sordera por Bomba de 500 kg' },
  { id: 'friendly-fire', label: 'Fuego amigo' },
  { id: 'illuminate-flash', label: 'Conjuntivitis por destello iluminado' },
]

export const PRESCRIPTIONS = [
  '1 caja de Liber-Té y un mínimo de 24 horas difundiendo la Democracia Gestionada.',
  '3 estimulantes cada 8 horas. Las quejas no están incluidas en el tratamiento.',
  'Reposo absoluto frente a la televisión del Ministerio (12 h diarias de programación patriótica).',
  'Visionado en bucle del desfile del Día de la Libertad hasta recuperar la moral reglamentaria.',
  'Adquisición de bonos de guerra como terapia de choque. Dosis: todos los que pueda pagar.',
  'Recitar el Juramento de Lealtad tres veces antes de cada comida.',
  'Alejarse de cualquier fuente de escepticismo durante 48 horas. Incluidos familiares.',
]

export const PHYSICIANS = [
  { name: 'Dra. Libertad Ramos', code: 'MH-117' },
  { name: 'Dr. Augusto Valor', code: 'MH-042' },
  { name: 'Dra. Constancia Hierro', code: 'MH-208' },
  { name: 'Dr. Prudencio Lealtad', code: 'MH-076' },
  { name: 'Dra. Victoria Eterna', code: 'MH-301' },
]

export const MAX_DIAGNOSES = 4

export const pick = (list, not) => {
  const options = list.length > 1 ? list.filter((x) => x !== not) : list
  return options[Math.floor(Math.random() * options.length)]
}

export function randomDiagnoses(n = 3) {
  return [...DIAGNOSES]
    .sort(() => Math.random() - 0.5)
    .slice(0, n)
    .map((d) => d.id)
}

export const CODE_PREFIX = 'MH-'

export const codeSuffix = (value) =>
  value
    .toUpperCase()
    .replace(/^MH-?/, '')
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 5)
