import { BinaryIcon, EyeIcon, PermitIcon } from '@/components/Icons.jsx'
import AutomatonDecoder from './automaton-decoder/AutomatonDecoder.jsx'
import DissentReport from './dissent-report/DissentReport.jsx'
import LeavePermit from './leave-permit/LeavePermit.jsx'
import { SERVICE_META } from './meta.js'

const UI = {
  'automaton-decoder': { icon: BinaryIcon, component: AutomatonDecoder },
  'leave-permit': { icon: PermitIcon, component: LeavePermit },
  'dissent-registry': { icon: EyeIcon, component: DissentReport },
}

export const SERVICES = SERVICE_META.map((meta) => ({ ...meta, ...UI[meta.id] }))

export const findService = (id) => SERVICES.find((s) => s.id === id && !s.locked)
