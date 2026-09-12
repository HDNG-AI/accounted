import { createServiceClient } from '@/lib/supabase/server'
import type { EventPayload } from '@/lib/events/types'
import { casesNeedingRecheck, listCases, putCase } from './case-store'

async function markCompanyCasesForRecheck(companyId: string, userId: string): Promise<void> {
  const supabase = createServiceClient()
  const cases = await listCases(supabase, companyId)
  const stale = casesNeedingRecheck(cases).filter((c) => !c.needs_recheck)

  for (const upperHandCase of stale) {
    await putCase(supabase, userId, companyId, {
      ...upperHandCase,
      needs_recheck: true,
      updated_at: new Date().toISOString(),
    })
  }
}

export async function handleJournalEntryCommitted(
  payload: EventPayload<'journal_entry.committed'>
): Promise<void> {
  await markCompanyCasesForRecheck(payload.companyId, payload.userId)
}

export async function handleDocumentUploaded(
  payload: EventPayload<'document.uploaded'>
): Promise<void> {
  await markCompanyCasesForRecheck(payload.companyId, payload.userId)
}

export async function handleInvoicePaid(
  payload: EventPayload<'invoice.paid'>
): Promise<void> {
  await markCompanyCasesForRecheck(payload.companyId, payload.userId)
}
