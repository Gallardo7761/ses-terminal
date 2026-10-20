import { AutomatonIcon, BinaryIcon, EyeIcon, MedicalIcon } from '@/components/Icons.jsx'
import AutomatonDecoder from './automaton-decoder/AutomatonDecoder.jsx'
import MedicalReport from './medical-report/MedicalReport.jsx'
import { SERVICE_META } from './meta.js'

const UI = {
  'automaton-decoder': { icon: BinaryIcon, component: AutomatonDecoder },
  'medical-certificate': { icon: MedicalIcon, component: MedicalReport },
  'dissent-registry': { icon: EyeIcon },
  bestiary: { icon: AutomatonIcon },
}

export const SERVICES = SERVICE_META.map((meta) => ({ ...meta, ...UI[meta.id] }))

export const findService = (id) => SERVICES.find((s) => s.id === id && !s.locked)
