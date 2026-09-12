import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { UpperHandRun } from './run-store'

export interface PersonaSummary {
  id: string
  title: string
  description: string
  checks: string[]
}

const SKILLS_DIR = join(process.cwd(), 'extensions', 'general', 'upper-hand', 'skills')

function frontmatter(text: string, field: string): string {
  const m = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))
  return m ? m[1].trim().replace(/^"|"$/g, '') : ''
}

/** Personas are the skill files: whatever is in skills/personas is what the panel can run. */
export function listPersonas(): PersonaSummary[] {
  const dir = join(SKILLS_DIR, 'personas')
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const file = join(dir, d.name, 'SKILL.md')
      if (!existsSync(file)) return null
      const text = readFileSync(file, 'utf8')
      const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? d.name
      const checksLine = text.match(/\*\*Checks[^\n]*/)?.[0] ?? text
      const checks = Array.from(checksLine.matchAll(/`([a-z]+-[A-Za-z0-9.]+-[a-z0-9-]+)`/g)).map((m) => m[1])
      const unique = Array.from(new Set(checks)).filter((c) => existsSync(join(SKILLS_DIR, 'checks', c, 'SKILL.md')))
      return { id: d.name, title, description: frontmatter(text, 'description'), checks: unique }
    })
    .filter((p): p is PersonaSummary => p !== null)
}

export interface PanelStatus {
  personas: Array<PersonaSummary & { last_run: UpperHandRun | null; live: boolean }>
  live: boolean
  models: { analysis: string; control: string; provider: string }
  access: string
  generated_at: string
}
