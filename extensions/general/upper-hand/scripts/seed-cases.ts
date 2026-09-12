/**
 * Seed demo cases for the Upper Hand panel.
 *
 * Usage (from the Accounted repo root, local Supabase running):
 *   npx tsx extensions/general/upper-hand/scripts/seed-cases.ts
 *
 * Writes to extension_data for the owner's active company. Idempotent on the
 * case's idempotency_key, so re-running refreshes the same cases instead of
 * duplicating them. Reads NEXT_PUBLIC_SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY from .env.local.
 */
import { config as dotenv } from 'dotenv'
import { resolve } from 'node:path'
import { createServiceRoleClient } from '../../../../lib/supabase/service-client'
import { buildCase, putCase } from '../lib/case-store'
import type { UpperHandCaseInput } from '../lib/case-types'

dotenv({ path: resolve(process.cwd(), '.env.local') })
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OWNER_EMAIL = process.env.UH_OWNER_EMAIL ?? 'erik@hdng.ai'

if (!URL || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const sb = createServiceRoleClient(URL, KEY)

async function main() {
  const { data: users, error: usersError } = await sb.auth.admin.listUsers({ perPage: 200 })
  if (usersError) throw usersError
  const user = users.users.find((u) => u.email?.toLowerCase() === OWNER_EMAIL.toLowerCase())
  if (!user) throw new Error(`User ${OWNER_EMAIL} not found`)

  const { data: memberships, error: membershipError } = await sb
    .from('company_members')
    .select('company_id, companies:company_id(id, name, archived_at)')
    .eq('user_id', user.id)
  if (membershipError) throw membershipError

  type MembershipCompany = { id: string; name: string; archived_at: string | null }
  const rows = (memberships ?? []) as unknown as Array<{
    companies: MembershipCompany | MembershipCompany[] | null
  }>
  const company = rows
    .map((row) => (Array.isArray(row.companies) ? row.companies[0] : row.companies))
    .find((c) => c && !c.archived_at)
  if (!company) throw new Error(`No active company for ${OWNER_EMAIL}`)

  const base = {
    company_id: company.id,
    role: 'auditor',
    situation: 'audit',
    provenance_grade: 'native_full_history' as const,
    what_closes_it: { owner: null, due_date: null },
  }

  const cases: UpperHandCaseInput[] = [
    {
      ...base,
      case_id: 'seed-voucher-without-document',
      check_id: 'voucher-without-document',
      severity: 'blocking',
      due_before: '2026-10-01',
      finding: 'Voucher A:124 has no supporting document and the supplier liability remains open',
      pattern_deviated_from: 'Every voucher carries a linked supporting document.',
      evidence: {
        voucher_ids: [],
        event_ids: [],
        document_ids: [],
        counterparty_history_ref: null,
      },
      idempotency_key: 'auditor|seed-1|voucher-without-document',
    },
    {
      ...base,
      role: 'tax-reviewer',
      case_id: 'seed-foreign-receipt-local-vat',
      check_id: 'tax-foreign-receipt-local-vat',
      severity: 'attention',
      due_before: '2026-11-12',
      finding: 'German hotel invoice with local VAT booked as Swedish input VAT',
      pattern_deviated_from: 'Foreign VAT is not deductible as Swedish input VAT.',
      evidence: {
        voucher_ids: [],
        event_ids: [],
        document_ids: [],
        counterparty_history_ref: 'Hotel Alexanderplatz GmbH',
      },
      idempotency_key: 'tax-reviewer|seed-1|tax-foreign-receipt-local-vat',
    },
    {
      ...base,
      role: 'tax-reviewer',
      case_id: 'seed-wework-open',
      check_id: 'supplier-invoice-unpaid',
      severity: 'info',
      due_before: null,
      finding: 'WeWork supplier invoice approved but unpaid since 2026-06-01',
      pattern_deviated_from: 'An approved invoice falls due and is paid or credited.',
      evidence: {
        voucher_ids: [],
        event_ids: [],
        document_ids: [],
        counterparty_history_ref: 'WeWork Stockholm AB',
      },
      idempotency_key: 'tax-reviewer|seed-2|supplier-invoice-unpaid',
    },
  ]

  for (const caseInput of cases) {
    const upperHandCase = buildCase(company.id, caseInput)
    await putCase(sb, user.id, company.id, upperHandCase)
    console.log(`  ${upperHandCase.case_id} · ${upperHandCase.severity} · ${upperHandCase.finding}`)
  }

  console.log(`Seeded ${cases.length} Upper Hand cases for ${company.name} (${company.id})`)
}

main().catch((error) => {
  console.error('FATAL', error instanceof Error ? error.message : error)
  process.exit(1)
})
