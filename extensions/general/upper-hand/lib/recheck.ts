import type { SupabaseClient } from '@supabase/supabase-js'
import type { UpperHandCase } from './case-types'

export interface RecheckOutcome {
  resolved: boolean
  verification: string | null
  checked: string[]
}

type RecheckFn = (
  supabase: SupabaseClient,
  upperHandCase: UpperHandCase
) => Promise<RecheckOutcome>

export const RECHECK_IMPLEMENTED = ['voucher-without-document'] as const

const voucherWithoutDocument: RecheckFn = async (supabase, upperHandCase) => {
  const voucherIds = upperHandCase.evidence.voucher_ids
  if (voucherIds.length === 0) {
    return { resolved: false, verification: null, checked: ['inga verifikat i beviskedjan'] }
  }

  const { data, error } = await supabase
    .from('document_attachments')
    .select('journal_entry_id')
    .in('journal_entry_id', voucherIds)

  if (error) {
    throw new Error(`Recheck voucher-without-document failed: ${error.message}`)
  }

  const linked = new Set((data ?? []).map((row) => row.journal_entry_id))
  const missing = voucherIds.filter((id) => !linked.has(id))

  if (missing.length > 0) {
    return {
      resolved: false,
      verification: null,
      checked: [`${missing.length} av ${voucherIds.length} verifikat saknar fortfarande underlag`],
    }
  }

  return {
    resolved: true,
    verification: `Omkörning: samtliga ${voucherIds.length} verifikat i beviskedjan har nu ett länkat underlag.`,
    checked: [`${linked.size} länkade dokument`],
  }
}

const RECHECKS: Record<string, RecheckFn> = {
  'voucher-without-document': voucherWithoutDocument,
}

export async function recheckCase(
  supabase: SupabaseClient,
  upperHandCase: UpperHandCase
): Promise<RecheckOutcome> {
  const recheck = RECHECKS[upperHandCase.check_id]
  if (!recheck) {
    return {
      resolved: false,
      verification: null,
      checked: [`ingen omkörning implementerad för ${upperHandCase.check_id}`],
    }
  }
  return recheck(supabase, upperHandCase)
}
