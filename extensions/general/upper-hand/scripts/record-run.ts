/**
 * Record a reviewer run so the panel can show what is live and what ran last.
 *
 *   npx tsx extensions/general/upper-hand/scripts/record-run.ts start <persona> <check1,check2> <model> [control_model] [provider]
 *     -> prints the run_id
 *   npx tsx extensions/general/upper-hand/scripts/record-run.ts finish <run_id> '<json: {turns, tool_calls, findings, controls_ok, gate_ok, status, cases?, usage?}>'
 *
 * Writes to extension_data (key run:<id>) for the owner's active company, service role, like seed-cases.ts.
 */
import { config as dotenv } from 'dotenv'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createServiceRoleClient } from '../../../../lib/supabase/service-client'
import { listRuns, putRun, type UpperHandRun } from '../lib/run-store'
import { upsertCaseByIdempotencyKey } from '../lib/case-store'
import type { UpperHandCaseInput, UpperHandSeverity } from '../lib/case-types'

dotenv({ path: resolve(process.cwd(), '.env.local') })
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'); process.exit(1) }
const sb = createServiceRoleClient(URL, KEY)
const OWNER_EMAIL = process.env.UH_OWNER_EMAIL ?? 'erik@hdng.ai'
const COMPANY_NAME = process.env.UH_COMPANY_NAME ?? 'Konsult AB'

async function context(): Promise<{ userId: string; companyId: string }> {
  const { data: users, error } = await sb.auth.admin.listUsers({ perPage: 200 })
  if (error) throw error
  const user = users.users.find((u) => u.email?.toLowerCase() === OWNER_EMAIL.toLowerCase())
  if (!user) throw new Error(`User ${OWNER_EMAIL} not found`)
  const { data: rows } = await sb.from('company_members').select('company_id, companies:company_id(id, name, archived_at)').eq('user_id', user.id)
  type Co = { id: string; name: string; archived_at: string | null }
  const hit = ((rows ?? []) as unknown as Array<{ companies: Co | Co[] | null }>)
    .map((m) => (Array.isArray(m.companies) ? m.companies[0] : m.companies))
    .find((c) => c && c.name === COMPANY_NAME && !c.archived_at)
  if (!hit) throw new Error(`Company ${COMPANY_NAME} not found`)
  return { userId: user.id, companyId: hit.id }
}

type RunCase = {
  check_id?: string; severity?: string; finding?: string; pattern_deviated_from?: string
  evidence?: { voucher_refs?: string[]; document_ids?: string[]; event_ids?: string[] }
  what_closes_it?: { owner?: string | null; due_date?: string | null }
  auditor_duty?: string | null
}
const SITUATION: Record<string, string> = { auditor: 'audit', 'tax-reviewer': 'tax_review', 'dd-analyst': 'sale' }
const SEVERITIES = new Set(['info', 'attention', 'blocking'])

function toCaseInput(companyId: string, persona: string, c: RunCase): UpperHandCaseInput | null {
  if (!c.check_id || !c.finding) return null
  const severity = (SEVERITIES.has(c.severity ?? '') ? c.severity : 'attention') as UpperHandSeverity
  const vouchers = (c.evidence?.voucher_refs ?? []).map(String).filter(Boolean)
  const anchor = vouchers[0] ?? c.finding.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)
  return {
    case_id: '',
    company_id: companyId,
    role: persona,
    check_id: c.check_id,
    situation: SITUATION[persona] ?? 'audit',
    severity,
    due_before: c.what_closes_it?.due_date && /^\d{4}-\d{2}-\d{2}$/.test(c.what_closes_it.due_date) ? c.what_closes_it.due_date : null,
    finding: c.finding,
    pattern_deviated_from: c.pattern_deviated_from ?? '',
    evidence: { voucher_ids: vouchers, event_ids: c.evidence?.event_ids ?? [], document_ids: c.evidence?.document_ids ?? [], counterparty_history_ref: null },
    provenance_grade: 'native_full_history',
    what_closes_it: { owner: c.what_closes_it?.owner ?? null, due_date: c.what_closes_it?.due_date ?? null },
    idempotency_key: `${persona}|${c.check_id}|${anchor}`,
  }
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  const { userId, companyId } = await context()
  if (cmd === 'start') {
    const [persona, checks, model, control, provider] = rest
    const run: UpperHandRun = {
      run_id: randomUUID(), persona, checks: (checks ?? '').split(',').filter(Boolean), model: model ?? 'unknown', control_model: control ?? null, provider: provider ?? null, usage: null,
      started_at: new Date().toISOString(), finished_at: null, status: 'running',
      turns: null, tool_calls: null, findings: null, controls_ok: null, gate_ok: null,
    }
    await putRun(sb, userId, companyId, run)
    process.stdout.write(run.run_id + '\n')
    return
  }
  if (cmd === 'finish') {
    const [runId, json] = rest
    const runs = await listRuns(sb, companyId)
    const run = runs.find((r) => r.run_id === runId)
    if (!run) throw new Error(`run ${runId} not found`)
    const payload = JSON.parse(json ?? '{}') as Partial<UpperHandRun> & { cases?: RunCase[] }
    const { cases, ...patch } = payload
    let created = 0
    for (const c of cases ?? []) {
      const input = toCaseInput(companyId, run.persona, c)
      if (!input) continue
      await upsertCaseByIdempotencyKey(sb, userId, input)
      created++
    }
    await putRun(sb, userId, companyId, { ...run, ...patch, findings: patch.findings ?? created, finished_at: new Date().toISOString(), status: patch.status ?? 'done' })
    process.stdout.write(`ok cases=${created}\n`)
    return
  }
  throw new Error('usage: record-run.ts start <persona> <checks> <model> [control] [provider] | finish <run_id> <json>')
}
main().catch((e) => { console.error('FATAL', e.message ?? e); process.exit(1) })
