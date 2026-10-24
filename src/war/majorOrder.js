import PLANETS from '@/lore/planets.json'

const API = '/api/hd2'
const HEADERS = { 'Accept-Language': 'es-ES' }

// Valores conocidos por la comunidad: https://github.com/helldivers-2/json/tree/master/assignments
const VALUE = { race: 1, goal: 3, locationIndex: 12 }
const RACES = { 2: 'terminid', 3: 'automaton', 4: 'illuminate' }
const RACE_PLURAL = { terminid: 'termínidos', automaton: 'autómatas', illuminate: 'iluminados' }
const MAJOR_ORDER = 4
const SUPER_EARTH = 1

const TASKS = {
  2: ({ goal }) => `Completad ${fmt(goal)} extracciones`,
  3: ({ goal, faction }) => `Eliminad ${fmt(goal)} ${faction ? RACE_PLURAL[faction] : 'enemigos'}`,
  7: ({ goal }) => `Completad ${fmt(goal)} misiones`,
  9: ({ goal }) => `Completad ${fmt(goal)} operaciones`,
  11: ({ planet }) => `Liberad ${planet?.name ?? 'el planeta indicado'}`,
  12: ({ planet, goal }) => (planet ? `Defended ${planet.name}` : `Defended ${fmt(goal)} planetas`),
  13: ({ planet }) => `Mantened el control de ${planet?.name ?? 'los planetas indicados'}`,
  15: ({ goal }) => `Expandid el frente a ${fmt(goal)} planetas`,
}

const fmt = (n) => n.toLocaleString('es-ES')

async function get(path) {
  const res = await fetch(`${API}${path}`, { headers: HEADERS })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

function readTask(task, progress, planets) {
  const value = (type) => task.values[task.valueTypes.indexOf(type)]
  const goal = value(VALUE.goal) ?? 1
  const faction = RACES[value(VALUE.race)]
  const index = value(VALUE.locationIndex)
  const planet = index != null && PLANETS[index] ? { ...PLANETS[index], ...planets.get(index) } : null
  const describe = TASKS[task.type] ?? (() => 'Objetivo clasificado por el Ministerio de la Verdad')

  return {
    text: describe({ goal, faction, planet }),
    faction: faction ?? (planet && RACES[planet.owner]),
    planet,
    current: Math.min(progress, goal),
    goal,
    done: progress >= goal,
  }
}

async function planetStatus(warId, assignment) {
  const wanted = new Set(
    assignment.setting.tasks.map((t) => t.values[t.valueTypes.indexOf(VALUE.locationIndex)]).filter((i) => i != null),
  )
  if (!wanted.size) return new Map()

  const [status, info] = await Promise.all([get(`/WarSeason/${warId}/Status`), get(`/WarSeason/${warId}/WarInfo`)])
  const maxHealth = new Map(info.planetInfos.map((p) => [p.index, p.maxHealth]))
  return new Map(
    status.planetStatus
      .filter((p) => wanted.has(p.index))
      .map((p) => {
        const max = maxHealth.get(p.index) || 1
        const liberation = p.owner === SUPER_EARTH ? 100 : Math.max(0, 100 - (p.health / max) * 100)
        return [p.index, { owner: p.owner, liberation, players: p.players }]
      }),
  )
}

export async function fetchMajorOrder() {
  const { id: warId } = await get('/WarSeason/current/WarID')
  const assignments = await get(`/v2/Assignment/War/${warId}`)
  const assignment = assignments.find((a) => a.setting.type === MAJOR_ORDER) ?? assignments[0]
  if (!assignment) return null

  const { setting } = assignment
  const planets = await planetStatus(warId, assignment)
  const medals = (setting.rewards ?? [setting.reward]).filter(Boolean).reduce((sum, r) => sum + r.amount, 0)

  return {
    id: assignment.id32,
    title: setting.overrideTitle || 'Orden Suprema',
    brief: setting.overrideBrief || setting.taskDescription,
    deadline: Date.now() + assignment.expiresIn * 1000,
    medals,
    tasks: setting.tasks.map((t, i) => readTask(t, assignment.progress[i] ?? 0, planets)),
  }
}
