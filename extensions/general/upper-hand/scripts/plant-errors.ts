/**
 * Plant the Upper Hand demo errors into the seeded company "Konsult AB".
 *
 * Usage (from the Accounted repo root, local Supabase running):
 *   npx tsx extensions/general/upper-hand/scripts/plant-errors.ts [--undo] [--only P1,P3]
 *
 * Posts vouchers the same way scripts/seed-demo-account.ts does (draft, lines,
 * posted) so triggers and numbering hold. P6 goes through the inline
 * correction RPC so journal_entry_rattelse_log is genuine. Every planted
 * planted voucher id is recorded in plant-manifest.local.json (never in the ledger, the
 * reviewers would see it); --undo reverses each planted voucher with a mirrored entry.
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
 */
import { createClient } from '@supabase/supabase-js'
import { config as dotenv } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

dotenv({ path: resolve(process.cwd(), '.env.local') })
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'); process.exit(1) }
const sb = createClient(URL, KEY, { auth: { persistSession: false } })

const COMPANY_NAME = 'Konsult AB'
const OWNER_EMAIL = process.env.UH_OWNER_EMAIL ?? 'erik@hdng.ai'
const SERIES = 'A'
const args = process.argv.slice(2)
const UNDO = args.includes('--undo')
const only = (() => { const i = args.indexOf('--only'); return i >= 0 ? new Set(args[i + 1].split(',')) : null })()
const round2 = (n: number) => Math.round(n * 100) / 100
// Planted voucher ids live in a local manifest, never in the ledger: anything written to the
// voucher (notes included) is visible to the reviewers through the MCP tools and would leak the plant.
const MANIFEST = resolve(dirname(fileURLToPath(import.meta.url)), 'plant-manifest.local.json')
type Manifest = Record<string, { vouchers: string[]; undone?: string[]; extra?: Record<string, string> }>
const manifest: Manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {}
const saveManifest = () => writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2))
const record = (id: string, voucherId: string) => { (manifest[id] ??= { vouchers: [] }).vouchers.push(voucherId); saveManifest() }

type Line = { account: string; debit?: number; credit?: number; description?: string }
type Ctx = { companyId: string; userId: string; fp2026: string; accounts: Record<string, string>; next: number }

const NEEDED_ACCOUNTS: Array<[string, string, string, string, string, string]> = [
  // number, name, class, group, type, normal_balance
  ['1610', 'Kortfristiga fordringar hos anställda', '1', '16', 'asset', 'debit'],
  ['1660', 'Kortfristiga fordringar hos koncernföretag', '1', '16', 'asset', 'debit'],
  ['1790', 'Övriga förutbetalda kostnader och upplupna intäkter', '1', '17', 'asset', 'debit'],
  ['2393', 'Lån från närstående personer', '2', '23', 'liability', 'credit'],
  ['5831', 'Kost och logi i utlandet', '5', '58', 'expense', 'debit'],
  ['8423', 'Räntekostnader för skatter och avgifter', '8', '84', 'expense', 'debit'],
]

async function ctx(): Promise<Ctx> {
  const { data: users, error: ue } = await sb.auth.admin.listUsers({ perPage: 200 })
  if (ue) throw ue
  const user = users.users.find((u) => u.email?.toLowerCase() === OWNER_EMAIL.toLowerCase())
  if (!user) throw new Error(`User ${OWNER_EMAIL} not found`)
  // Several orphaned "Konsult AB" rows can exist after re-seeding; the real one is the one the owner is a member of.
  const { data: mem, error: ce } = await sb.from('company_members').select('company_id, companies:company_id(id, name, archived_at)').eq('user_id', user.id)
  if (ce) throw ce
  const hit = (mem ?? []).map((m: any) => m.companies).find((c: any) => c && c.name === COMPANY_NAME && !c.archived_at)
  if (!hit) throw new Error(`Company ${COMPANY_NAME} not found among ${OWNER_EMAIL}'s memberships`)
  const co = { id: hit.id as string }
  const { data: fp } = await sb.from('fiscal_periods').select('id').eq('company_id', co.id).eq('period_start', '2026-01-01').single()
  if (!fp) throw new Error('Fiscal period 2026 not found')
  for (const [num, name, cls, grp, type, nb] of NEEDED_ACCOUNTS) {
    const { data: ex } = await sb.from('chart_of_accounts').select('id').eq('company_id', co.id).eq('account_number', num).maybeSingle()
    if (!ex) {
      const { error } = await sb.from('chart_of_accounts').insert({ user_id: user.id, company_id: co.id, account_number: num, account_name: name, account_class: cls, account_group: grp, account_type: type, normal_balance: nb, plan_type: 'k1', is_active: true, is_system_account: false })
      if (error) throw new Error(`account ${num}: ${error.message}`)
      console.log(`  + account ${num} ${name}`)
    }
  }
  const { data: accs } = await sb.from('chart_of_accounts').select('id, account_number').eq('company_id', co.id)
  const accounts = Object.fromEntries((accs ?? []).map((a) => [a.account_number, a.id]))
  const { data: mx } = await sb.from('journal_entries').select('voucher_number').eq('company_id', co.id).eq('fiscal_period_id', fp.id).eq('voucher_series', SERIES).order('voucher_number', { ascending: false }).limit(1)
  return { companyId: co.id, userId: user.id, fp2026: fp.id, accounts, next: (mx?.[0]?.voucher_number ?? 0) + 1 }
}

const planted = (id: string) => (manifest[id]?.vouchers.length ?? 0) > 0 && !manifest[id]?.undone

async function post(c: Ctx, id: string, date: string, description: string, lines: Line[], opts: { sourceType?: string; sourceId?: string | null; undo?: boolean } = {}): Promise<string> {
  const deb = round2(lines.reduce((s, l) => s + (l.debit ?? 0), 0)), cred = round2(lines.reduce((s, l) => s + (l.credit ?? 0), 0))
  if (deb !== cred) throw new Error(`${id} unbalanced ${deb} vs ${cred}`)
  const n = c.next++
  const { data: je, error } = await sb.from('journal_entries').insert({
    user_id: c.userId, company_id: c.companyId, fiscal_period_id: c.fp2026, voucher_number: n, voucher_series: SERIES,
    entry_date: date, description, source_type: opts.sourceType ?? 'manual', source_id: opts.sourceId ?? null,
    status: 'draft', committed_at: new Date(date + 'T12:00:00Z').toISOString(), created_via: 'system',
  }).select('id').single()
  if (error) throw new Error(`${id} header: ${error.message}`)
  const { error: le } = await sb.from('journal_entry_lines').insert(lines.map((l, i) => ({
    journal_entry_id: je.id, account_number: l.account, account_id: c.accounts[l.account] ?? null,
    debit_amount: round2(l.debit ?? 0), credit_amount: round2(l.credit ?? 0), line_description: l.description ?? null, sort_order: i,
  })))
  if (le) throw new Error(`${id} lines: ${le.message}`)
  const { error: pe } = await sb.from('journal_entries').update({ status: 'posted' }).eq('id', je.id)
  if (pe) throw new Error(`${id} post: ${pe.message}`)
  console.log(`  ${SERIES}:${n} ${date} ${description}`)
  if (opts.undo) { (manifest[id]!.undone ??= []).push(je.id); saveManifest() } else record(id, je.id)
  return je.id
}

async function undoPlanted(c: Ctx, id: string): Promise<void> {
  const ids = manifest[id]?.vouchers ?? []
  const { data: entries } = ids.length ? await sb.from('journal_entries').select('id, entry_date, description, voucher_number').in('id', ids) : { data: [] }
  for (const e of entries ?? []) {
    const { data: ls } = await sb.from('journal_entry_lines').select('account_number, debit_amount, credit_amount, line_description').eq('journal_entry_id', e.id).order('sort_order')
    const mirrored: Line[] = (ls ?? []).map((l) => ({ account: l.account_number, debit: Number(l.credit_amount), credit: Number(l.debit_amount), description: l.line_description ?? undefined }))
    const rid = await post(c, id, e.entry_date, `Storno ${SERIES}:${e.voucher_number} ${e.description}`, mirrored, { sourceType: 'storno', undo: true })
    await sb.from('journal_entries').update({ reversed_by_id: rid }).eq('id', e.id)
    await sb.from('journal_entries').update({ reverses_id: e.id }).eq('id', rid)
  }
}

const HOLIDAY_BUYS: Array<[string, string, number, number, string]> = [
  // date, supplier text, total, vat rate, context
  ['2026-04-03', 'ICA Bromma', 3480, 12, 'Långfredag'],
  ['2026-04-04', 'Systembolaget Bromma', 2960, 25, 'Påskafton'],
  ['2026-06-19', 'ICA Bromma', 4120, 12, 'Midsommarafton'],
  ['2026-06-19', 'Systembolaget Bromma', 3340, 25, 'Midsommarafton'],
  ['2026-07-11', 'ICA Bromma', 2870, 12, 'Lördag, semesterperiod'],
  ['2026-07-18', 'Bageri Bromma', 1260, 12, 'Lördag, semesterperiod'],
]

const PLANTS: Record<string, (c: Ctx) => Promise<void>> = {
  // 1.4: payment of an open supplier invoice booked as a new cost with input VAT
  P1: async (c) => { await post(c, 'P1', '2026-06-03', 'Betalning WeWork juni', [
    { account: '5010', debit: 8500, description: 'Hyra coworking' }, { account: '2641', debit: 2125, description: 'Ingående moms' }, { account: '1930', credit: 10625 }]) },
  // 4.4: employee receivable drifting upward from card purchases without receipts (Erik Ek is a plain employee)
  P2: async (c) => {
    const rows: Array<[string, number]> = [['2026-02-19', 1240], ['2026-03-12', 860], ['2026-04-16', 2380], ['2026-05-07', 1120], ['2026-06-11', 1990], ['2026-07-09', 940], ['2026-08-13', 2210]]
    for (const [d, a] of rows) await post(c, 'P2', d, 'Kortköp företagskort, kvitto saknas (Erik Ek)', [{ account: '1610', debit: a, description: 'Fordran Erik Ek' }, { account: '1930', credit: a }])
  },
  // 4.4 + ABL 21 kap: owner settlement account drifting to debit (Johan Lind is employment_type company_owner in the seed)
  P3: async (c) => { for (const m of ['03', '04', '05', '06', '07']) await post(c, 'P3', `2026-${m}-25`, 'Uttag Johan Lind', [{ account: '2893', debit: 25000, description: 'Avräkning Johan Lind' }, { account: '1930', credit: 25000 }]) },
  // 4.3 / 9.9: owner loan in, no interest, no agreement
  P4: async (c) => { await post(c, 'P4', '2026-01-15', 'Lån från aktieägare Johan Lind', [{ account: '1930', debit: 300000 }, { account: '2393', credit: 300000, description: 'Lån Johan Lind' }]) },
  // Tax: foreign receipt with local (German) VAT deducted as Swedish input VAT
  P5: async (c) => {
    let { data: sup } = await sb.from('suppliers').select('id').eq('company_id', c.companyId).eq('name', 'Hotel Alexanderplatz GmbH').maybeSingle()
    if (!sup) {
      const { data, error } = await sb.from('suppliers').insert({ user_id: c.userId, company_id: c.companyId, name: 'Hotel Alexanderplatz GmbH', country: 'DE', vat_number: 'DE811223344' }).select('id').single()
      if (error) throw new Error(`supplier: ${error.message}`); sup = data
    }
    const { data: mx } = await sb.from('supplier_invoices').select('arrival_number').eq('company_id', c.companyId).order('arrival_number', { ascending: false }).limit(1)
    const arrival = (mx?.[0]?.arrival_number ?? 0) + 1
    const { data: si, error } = await sb.from('supplier_invoices').insert({
      user_id: c.userId, company_id: c.companyId, supplier_id: sup!.id, arrival_number: arrival, supplier_invoice_number: 'HAP-2026-0414',
      invoice_date: '2026-04-14', due_date: '2026-04-28', received_date: '2026-04-20', status: 'paid', currency: 'SEK',
      subtotal: 5500, subtotal_sek: 5500, vat_amount: 1045, vat_amount_sek: 1045, total: 6545, total_sek: 6545,
      vat_treatment: 'standard_25', reverse_charge: false, paid_amount: 6545, remaining_amount: 0, is_credit_note: false, paid_at: '2026-04-21T10:00:00Z',
    }).select('id').single()
    if (error) throw new Error(`supplier invoice: ${error.message}`)
    const reg = await post(c, 'P5', '2026-04-14', 'Lev.faktura HAP-2026-0414: Hotel Alexanderplatz GmbH', [
      { account: '5831', debit: 5500, description: 'Hotell Berlin 2 nätter' }, { account: '2641', debit: 1045, description: 'Ingående moms' }, { account: '2440', credit: 6545, description: 'Lev.skuld Hotel Alexanderplatz GmbH' }],
      { sourceType: 'supplier_invoice_registered', sourceId: si.id })
    const pay = await post(c, 'P5', '2026-04-21', 'Betalning lev.faktura HAP-2026-0414', [{ account: '2440', debit: 6545 }, { account: '1930', credit: 6545 }], { sourceType: 'supplier_invoice_paid', sourceId: si.id })
    await sb.from('supplier_invoices').update({ registration_journal_entry_id: reg, payment_journal_entry_id: pay }).eq('id', si.id)
    ;(manifest.P5!.extra ??= {}).supplier_invoice_id = si.id; saveManifest()
  },
  // 5.5: struck line without explanation, through the inline correction RPC on A:87 (2026)
  P6: async (c) => {
    const { data: e } = await sb.from('journal_entries').select('id').eq('company_id', c.companyId).eq('fiscal_period_id', c.fp2026).eq('voucher_series', SERIES).eq('voucher_number', 87).single()
    if (!e) throw new Error('A:87 (2026) not found')
    const { data: ls } = await sb.from('journal_entry_lines').select('id, account_number, debit_amount, credit_amount').eq('journal_entry_id', e.id)
    const vat = ls!.find((l) => l.account_number === '2641'), ap = ls!.find((l) => l.account_number === '2440')
    if (!vat || !ap) throw new Error('A:87 lines not as expected')
    if (Number(vat.debit_amount) !== 2125) { console.log('  P6 already applied'); return }
    const { data, error } = await sb.rpc('correct_entry_lines_inline', {
      p_company_id: c.companyId, p_entry_id: e.id, p_strike_line_ids: [vat.id, ap.id],
      p_new_lines: [
        { account_number: '2641', debit_amount: 2725, credit_amount: 0, line_description: 'Ingående moms' },
        { account_number: '2440', debit_amount: 0, credit_amount: 11225, line_description: 'Lev.skuld WeWork Stockholm AB' },
      ],
      p_user_id: c.userId,
    })
    if (error) throw new Error(`rattelse: ${error.message}`)
    console.log('  A:87 corrected inline, no note:', JSON.stringify(data).slice(0, 120))
  },
  // 9.4: Nordic Tech AS "subscription" without schedule or contract already exists; verify only
  P7: async (c) => {
    const { count } = await sb.from('recurring_invoice_schedules').select('id', { count: 'exact', head: true }).eq('company_id', c.companyId)
    console.log(`  Nordic Tech AS: 4 invoices 2026, recurring schedules in company: ${count ?? 0} (expected 0). Nothing to plant.`)
  },
  // Owner addition A1: consumables bought in private contexts (holidays, weekends), booked as representation, full VAT, no participants
  P8: async (c) => {
    for (const [d, who, total, rate, ctxt] of HOLIDAY_BUYS) {
      const net = round2(total / (1 + rate / 100)), vat = round2(total - net)
      await post(c, 'P8', d, `Representation ${who}`, [
        { account: '6071', debit: net, description: `${who} (${ctxt})` }, { account: '2641', debit: vat, description: 'Ingående moms' }, { account: '1930', credit: total }])
    }
  },
  // ABL 9:34: employer charges for May paid twelve days late, with cost interest on the tax account
  P9: async (c) => {
    await post(c, 'P9', '2026-06-24', 'Inbetalning skatt + sociala 5/2026', [{ account: '2710', debit: 41140 }, { account: '2731', debit: 58755 }, { account: '1930', credit: 99895 }])
    await post(c, 'P9', '2026-07-03', 'Kostnadsränta skattekonto', [{ account: '8423', debit: 240, description: 'Kostnadsränta, sen inbetalning 5/2026' }, { account: '1930', credit: 240 }])
  },
  // Control C4: booked late but paid on time (bank date in the text), must not be flagged
  C4: async (c) => { await post(c, 'C4', '2026-07-20', 'Inbetalning skatt + sociala 6/2026 (bankdatum 2026-07-10)', [{ account: '2710', debit: 41140 }, { account: '2731', debit: 58755 }, { account: '1930', credit: 99895 }]) },
  // Control C1: loan to the parent company, group exemption, must not be flagged
  C1: async (c) => { await post(c, 'C1', '2026-02-01', 'Lån till Konsult Holding AB', [{ account: '1660', debit: 200000, description: 'Koncernlån, ränta SLR+1 %, avtal 2026-02-01' }, { account: '1930', credit: 200000 }]) },
  // Control C3: legitimate representation on a weekday with participants documented, must not be flagged
  C3: async (c) => { await post(c, 'C3', '2026-03-11', 'Kick-off fika, 12 deltagare, deltagarlista bifogad', [{ account: '6071', debit: 1071.43, description: 'Fika kick-off, 12 pers' }, { account: '2641', debit: 128.57, description: 'Ingående moms' }, { account: '1930', credit: 1200 }]) },
}

async function main() {
  const c = await ctx()
  console.log(`${UNDO ? 'Undoing' : 'Planting'} in ${COMPANY_NAME} (${c.companyId}), next voucher ${SERIES}:${c.next}`)
  for (const id of Object.keys(PLANTS)) {
    if (only && !only.has(id)) continue
    if (UNDO) {
      if (id === 'P6') { console.log('  P6 undo: restore manually through a second correction (kept simple on purpose)'); continue }
      if (id === 'P7') continue
      console.log(`[${id}] undo`); await undoPlanted(c, id)
      if (id === 'P5' && manifest.P5?.extra?.supplier_invoice_id) { await sb.from('supplier_invoices').delete().eq('id', manifest.P5.extra.supplier_invoice_id) }
      continue
    }
    if (id !== 'P6' && id !== 'P7' && planted(id)) { console.log(`[${id}] already planted, skipping`); continue }
    console.log(`[${id}]`); await PLANTS[id](c)
  }
  console.log('done')
}
main().catch((e) => { console.error('FATAL', e.message ?? e); process.exit(1) })
