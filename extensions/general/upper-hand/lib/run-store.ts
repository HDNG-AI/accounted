import type { SupabaseClient } from '@supabase/supabase-js'
import { UPPER_HAND_EXTENSION_ID } from './case-store'

export const RUN_KEY_PREFIX = 'run:'

export type UpperHandRunStatus = 'running' | 'done' | 'failed'

export interface UpperHandRun {
  run_id: string
  persona: string
  checks: string[]
  model: string
  control_model: string | null
  started_at: string
  finished_at: string | null
  status: UpperHandRunStatus
  turns: number | null
  tool_calls: number | null
  findings: number | null
  controls_ok: boolean | null
  gate_ok: boolean | null
}

function runKey(runId: string): string {
  return `${RUN_KEY_PREFIX}${runId}`
}

export async function listRuns(supabase: SupabaseClient, companyId: string): Promise<UpperHandRun[]> {
  const { data, error } = await supabase
    .from('extension_data')
    .select('value')
    .eq('company_id', companyId)
    .eq('extension_id', UPPER_HAND_EXTENSION_ID)
    .like('key', `${RUN_KEY_PREFIX}%`)
  if (error) throw new Error(`Failed to list Upper Hand runs: ${error.message}`)
  return (data ?? [])
    .map((row) => row.value as UpperHandRun)
    .filter((r) => r && typeof r.run_id === 'string')
    .sort((a, b) => b.started_at.localeCompare(a.started_at))
}

export async function putRun(
  supabase: SupabaseClient,
  userId: string,
  companyId: string,
  run: UpperHandRun
): Promise<void> {
  const { error } = await supabase.from('extension_data').upsert(
    { user_id: userId, company_id: companyId, extension_id: UPPER_HAND_EXTENSION_ID, key: runKey(run.run_id), value: run },
    { onConflict: 'company_id,extension_id,key' }
  )
  if (error) throw new Error(`Failed to save Upper Hand run ${run.run_id}: ${error.message}`)
}

/** A run that started more than this long ago without finishing is shown as stale, not live. */
export const RUN_STALE_MS = 30 * 60 * 1000

export function isLive(run: UpperHandRun, now = Date.now()): boolean {
  return run.status === 'running' && now - Date.parse(run.started_at) < RUN_STALE_MS
}
