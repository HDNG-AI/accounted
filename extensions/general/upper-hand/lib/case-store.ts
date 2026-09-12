import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  UpperHandCase,
  UpperHandCaseInput,
  UpperHandCaseStatus,
  UpperHandSeverity,
} from './case-types'

export const UPPER_HAND_EXTENSION_ID = 'general/upper-hand'
export const CASE_KEY_PREFIX = 'case:'

export const ALLOWED_TRANSITIONS: Record<UpperHandCaseStatus, UpperHandCaseStatus[]> = {
  open: ['acknowledged', 'accepted_with_note', 'closed', 'reopened'],
  acknowledged: ['open', 'accepted_with_note', 'closed'],
  reopened: ['acknowledged', 'accepted_with_note', 'closed'],
  accepted_with_note: ['reopened'],
  closed: ['reopened'],
}

const TRANSITION_ACTION: Record<UpperHandCaseStatus, string> = {
  open: 'Återöppnat',
  acknowledged: 'Ansvarig satt',
  accepted_with_note: 'Accepterat med not',
  closed: 'Stängt efter omkörning',
  reopened: 'Återöppnat',
}

const SEVERITY_RANK: Record<UpperHandSeverity, number> = {
  blocking: 0,
  attention: 1,
  info: 2,
}

export class CaseTransitionError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'CaseTransitionError'
    this.code = code
  }
}

export interface TransitionOptions {
  actor: string
  note?: string | null
  owner?: string | null
  dueDate?: string | null
  verification?: string | null
  now?: Date
}

export function applyTransition(
  current: UpperHandCase,
  to: UpperHandCaseStatus,
  options: TransitionOptions
): UpperHandCase {
  if (current.status === to) return current

  if (!ALLOWED_TRANSITIONS[current.status].includes(to)) {
    throw new CaseTransitionError(
      'INVALID_TRANSITION',
      `Cannot move case ${current.case_id} from ${current.status} to ${to}`
    )
  }

  const note = options.note?.trim() || null
  const owner = options.owner?.trim() || current.what_closes_it.owner
  const dueDate = options.dueDate?.trim() || current.what_closes_it.due_date

  if (to === 'acknowledged' && !owner && !dueDate) {
    throw new CaseTransitionError(
      'OWNER_REQUIRED',
      'A case needs an owner or a due date before it can be acknowledged'
    )
  }

  if (to === 'accepted_with_note' && (!note || note.length < 8)) {
    throw new CaseTransitionError(
      'NOTE_REQUIRED',
      'Accepting a case requires a note of at least 8 characters'
    )
  }

  if (to === 'closed' && !options.verification) {
    throw new CaseTransitionError(
      'VERIFICATION_REQUIRED',
      'A case can only be closed by a verification from a re-run'
    )
  }

  const at = (options.now ?? new Date()).toISOString()
  const verification = to === 'closed' ? options.verification ?? null : current.verification

  return {
    ...current,
    status: to,
    what_closes_it: { owner, due_date: dueDate },
    verification,
    needs_recheck: false,
    updated_at: at,
    history: [
      ...current.history,
      {
        at,
        by: options.actor,
        action: TRANSITION_ACTION[to],
        from: current.status,
        to,
        note,
        verification: to === 'closed' ? verification : null,
      },
    ],
  }
}

export function sortCases(cases: UpperHandCase[]): UpperHandCase[] {
  return [...cases].sort((a, b) => {
    const severityDelta = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
    if (severityDelta !== 0) return severityDelta
    return b.updated_at.localeCompare(a.updated_at)
  })
}

export function casesNeedingRecheck(cases: UpperHandCase[]): UpperHandCase[] {
  return cases.filter((c) => c.status !== 'closed' && c.status !== 'accepted_with_note')
}

function caseKey(caseId: string): string {
  return `${CASE_KEY_PREFIX}${caseId}`
}

function parseCase(value: unknown): UpperHandCase | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<UpperHandCase>
  if (!candidate.case_id || !candidate.company_id || !candidate.status) return null
  return candidate as UpperHandCase
}

export async function listCases(
  supabase: SupabaseClient,
  companyId: string
): Promise<UpperHandCase[]> {
  const { data, error } = await supabase
    .from('extension_data')
    .select('value')
    .eq('company_id', companyId)
    .eq('extension_id', UPPER_HAND_EXTENSION_ID)
    .like('key', `${CASE_KEY_PREFIX}%`)

  if (error) {
    throw new Error(`Failed to list Upper Hand cases: ${error.message}`)
  }

  return sortCases(
    (data ?? [])
      .map((row) => parseCase(row.value))
      .filter((c): c is UpperHandCase => c !== null)
  )
}

export async function getCase(
  supabase: SupabaseClient,
  companyId: string,
  caseId: string
): Promise<UpperHandCase | null> {
  const { data, error } = await supabase
    .from('extension_data')
    .select('value')
    .eq('company_id', companyId)
    .eq('extension_id', UPPER_HAND_EXTENSION_ID)
    .eq('key', caseKey(caseId))
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to read Upper Hand case ${caseId}: ${error.message}`)
  }

  return data ? parseCase(data.value) : null
}

export async function putCase(
  supabase: SupabaseClient,
  userId: string,
  companyId: string,
  upperHandCase: UpperHandCase
): Promise<void> {
  const { error } = await supabase.from('extension_data').upsert(
    {
      user_id: userId,
      company_id: companyId,
      extension_id: UPPER_HAND_EXTENSION_ID,
      key: caseKey(upperHandCase.case_id),
      value: upperHandCase,
    },
    { onConflict: 'company_id,extension_id,key' }
  )

  if (error) {
    throw new Error(`Failed to save Upper Hand case ${upperHandCase.case_id}: ${error.message}`)
  }
}

export function buildCase(
  companyId: string,
  input: UpperHandCaseInput,
  now: Date = new Date()
): UpperHandCase {
  const at = now.toISOString()
  return {
    ...input,
    company_id: companyId,
    status: input.status ?? 'open',
    verification: input.verification ?? null,
    needs_recheck: input.needs_recheck ?? false,
    updated_at: input.updated_at ?? at,
    history: input.history ?? [
      {
        at,
        by: 'system',
        action: 'Ärende öppnat',
        from: 'open',
        to: 'open',
        note: null,
        verification: null,
      },
    ],
  }
}

export async function upsertCaseByIdempotencyKey(
  supabase: SupabaseClient,
  userId: string,
  caseInput: UpperHandCaseInput
): Promise<UpperHandCase> {
  const existing = (await listCases(supabase, caseInput.company_id)).find(
    (c) => c.idempotency_key === caseInput.idempotency_key
  )

  if (existing) {
    const refreshed: UpperHandCase = {
      ...existing,
      ...caseInput,
      case_id: existing.case_id,
      status: existing.status,
      verification: existing.verification,
      history: existing.history,
      needs_recheck: false,
      updated_at: new Date().toISOString(),
    }
    await putCase(supabase, userId, caseInput.company_id, refreshed)
    return refreshed
  }

  const created = buildCase(caseInput.company_id, {
    ...caseInput,
    case_id: caseInput.case_id || crypto.randomUUID(),
  })
  await putCase(supabase, userId, caseInput.company_id, created)
  return created
}
