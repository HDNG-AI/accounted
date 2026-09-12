# From the function catalogue to checks, personas and planted errors

Source: `funktionskatalog-v1.md` (Swedish, owner-maintained, anonymised). This file is the engineering map: which catalogue function becomes which check, under which persona, what Accounted data it reads, whether the pattern already exists in the demo company Konsult AB, and its priority for the hackathon.

Numbering follows the catalogue (1.1 ... 10.7). Check ids are `<persona>-<catalogue>` so a finding can always be traced back to the real pattern it came from.

## Cross-cutting rules lifted from the catalogue

These go into every persona and every check.

1. **False-alarm guard before any finding** (10.4): verify against invoice number, not only amount; compute partial-year depreciation before flagging a difference; trace suspense and accrual chains across year-end before counting a balance as an error; confirm that the underlying document (for example the AGM minutes) was actually delivered before attributing a missing entry to anyone.
2. **Root cause over symptom** (4.4, 5.2): group findings by root cause; a growing employee receivable is a receipt-routine problem, not six bookings.
3. **Neutral wording in anything read by more than one person** (10.1): "not yet expensed", never "never expensed"; "customer not identifiable from the ledger", never "no customer".
4. **The established figure** (10.6): when several versions exist, name which one is authoritative and warn about the others.
5. **Source per statement** (10.7): every number points to a voucher, document or event id.
6. **Own corrections logged** (10.5): a case that turns out wrong is closed as `accepted_with_note` with the correction visible, never deleted.
7. **Who and when, never "to be produced"** (5.1): `what_closes_it` names an owner and a date when a human must act.

## Map

| Catalogue | Function | Persona | Check id | Accounted data | Konsult AB today | Saturday |
|---|---|---|---|---|---|---|
| 1.1 | SIE diff between two extracts, changed vouchers in a closed year | compliance | `compl-1.1-changed-voucher-closed-year` | `journal_entry_rattelse_log`, `processing_history`, SIE import history | not applicable natively (no import); relevant for track B | B |
| 1.2 | IB/UB continuity across year-end | auditor | `aud-1.2-ib-ub-continuity` | balance sheet per period, IB vouchers | correct (IB 2026 = UB 2025) | control |
| 1.3 | Ledger vs sub-ledger (AR, AP, assets, advances) | auditor | `aud-1.3-ledger-vs-subledger` | trial balance, `invoices`, `supplier_invoices` | AR 1510 vs open invoices: to verify | 2 |
| 1.4 | Bank payment booked as new cost instead of settling AP: cost and VAT doubled | auditor, tax | `aud-1.4-payment-booked-as-cost` | payment vouchers, open `supplier_invoices`, 2641 lines | **plant**: WW-2026-05 paid as 5010 + 2641 / 1930 | **1** |
| 1.5 | Suspense and accrual chain tracking (17xx, 29xx, 2999) | auditor | `aud-1.5-suspense-chain` | ledger by account across periods | none today; plant three receipts on 1790 | 2 |
| 2.1 | Project code coverage on revenue and cost | DD, controller | `dd-2.1-dimension-coverage` | `journal_entry_lines.dimensions`, `project` | consulting company, no projects | later |
| 2.2 | Cost of goods not released on delivery | DD, auditor | `dd-2.2-cogs-on-delivery` | inventory accounts, invoices per project | not applicable | later |
| 2.6 | Invoice issued and credited within days, renumbered invoices | auditor, DD | `aud-2.6-invoice-credit-cluster` | `invoices` incl. `credited_invoice_id` | **plant as control**: four invoices, three credited, one remains; not an error, needs an explanation | control |
| 2.7 | FX residual vs real over/under-billing | DD | `dd-2.7-fx-residual` | `invoices.currency, exchange_rate`, payments | Berlin GmbH, Helsinki Oy in EUR: candidate | later |
| 3.1 | Asset register reconstruction | auditor | `aud-3.1-asset-register` | 12xx lines, `supplier_invoices`, assets module | one asset (1230, 18 000) | 2 |
| 3.2 | Depreciation recomputed per category, partial year | auditor | `aud-3.2-depreciation-recompute` | assets, 78xx lines | guard: partial year | with 3.3 |
| 3.3 | No monthly depreciation, empty or future-dated vouchers | auditor | `aud-3.3-depreciation-missing` | 12xx balance vs 78xx movement per month | **already present**: 1230 since 2026-02-14, zero 78xx | **1** |
| 4.1 | Prior-year result not transferred after AGM | auditor | `aud-4.1-result-disposition` | 2099, 2091, fiscal periods, AGM minutes document | **already present**: 588 561 on 2099, nothing on 2091 | **1** |
| 4.2 | Share capital vs share register, issue dates | auditor, compliance | `aud-4.2-share-capital` | 2081, documents | 2081 = 100 000, no register in demo | later |
| 4.3 | Related-party specification: owner loans, interest, agreements, multiple roles | auditor, DD, tax | `aud-4.3-related-party` | 23xx/28xx/16xx lines, documents, `suppliers` vs owners | **plant**: owner loan in on 2393, no interest, no agreement | 2 |
| 4.4 | Employee receivable growing from card purchases without receipts; prohibited loan | tax, auditor | `tax-4.4-employee-receivable-drift` | 1610/1680/2893 by month, documents | **plant**: 1610 monthly Feb to Aug; **plant**: owner settlement account 2893 drifting to debit | **1** |
| 4.6 | Tax provision, periodiseringsfond on wrong year account, unreconciled tax account | tax | `tax-4.6-tax-accounts` | 2510, 21xx, 1630, skattekonto | 2650 VAT liability 341 170 unverified (found by auditor 2026-09-10) | 2 |
| 5.1 | Auditor question list with owner and date per item | board view | delivery rule, not a check | cases | | rule |
| 5.5 | Written explanation for changed vouchers in a closed year | compliance | `compl-5.5-change-note` | `journal_entry_rattelse_log.notes` | **plant**: strike a line on A:87 without a note | 2 |
| 7.1 | Budget vs actual with principle check | controller | needs budget connector | | mock | later |
| 7.3 | Cash runway from burn, receivables, VAT receivable | credit | `credit-7.3-runway` | bank balance, AR aging, 1650 | AR all overdue: 396 875 | 2 |
| 9.3 | Normalisation list for QoE, one invoice per line | DD | `dd-9.3-normalisations` | `supplier_invoices`, `query_journal` line text, `suppliers`, income statement | none today (expected result: "Ingen avvikelse" with the population checked); proposed plants P9, P10 and control C4 below | **built** |
| 9.4 | Revenue and margin per product group and customer | DD | `dd-9.4-arr-backed` | `recurring_invoice_schedules`, `invoices` + `get_invoice` items, agreement documents, `customers` | **present (P7)**: Nordic Tech AS fixed 14 000 per month, 16 invoices 2025-01 to 2026-04, no schedule, no agreement document. Positive case Klient AB: hour-based lines, paid within 14 days in 2025, must stay silent | **built** |
| 9.7 | Aging of receivables and payables with comment per large item | DD, credit | `dd-9.7-aging` | AR and AP ledgers per date, `invoices` + `get_invoice`, `customers` terms, 1510 vs register | already present (E3): Klient AB 148 days, 82 % of open receivables | **built** |
| 9.8 | Off-balance checklist cross-read against other answers | DD | `dd-9.8-off-balance` | documents, supplier invoices (legal fees imply dispute) | later | later |
| 9.9 | Owner loan reconciliation vs bank and annual report | DD, auditor | shares `aud-4.3-related-party` | | | 2 |
| 9.12 | DD answers consistent with later corrections | DD | `dd-9.12-consistency` | cases over time | needs history | later |

Priority 1 is the Saturday build: six checks, three per persona. Priority 2 if time allows. "Control" means a deliberate non-finding the demo shows to prove discernment.

## Saturday: personas and their three checks

**Auditor** (`personas/auditor`)
1. `aud-1.4-payment-booked-as-cost`
2. `aud-3.3-depreciation-missing` (with the partial-year guard from 3.2)
3. `aud-4.1-result-disposition` (guard: AGM minutes delivered?)

**Tax reviewer** (`personas/tax-reviewer`)
1. `tax-4.4-employee-receivable-drift` (root cause: receipt routine; escalates to prohibited loan when the counterparty is in the ABL 21 kap circle)
2. `tax-foreign-receipt-local-vat` (from the original spec; not in the catalogue but the most common VAT error)
3. `aud-1.4-payment-booked-as-cost` shared: the tax reviewer reports the doubled input VAT, the auditor the doubled cost; one case object, two roles

**DD analyst** (`personas/dd-analyst`)
1. `dd-9.7-aging` (guard: agreed terms, disputes, credit notes in flight, partial payments at remaining amount, register vs 1510 named)
2. `dd-9.4-arr-backed` (guard: Klient AB by name as the positive case; project revenue in instalments is not ARR and not an error; "inget avtal i arkivet", never a fact about the world)
3. `dd-9.3-normalisations` (guard: repeats at the same cadence in the prior year are run-rate; every line needs an invoice; capitalised purchases and the transaction's own advisers are not operational one-offs)

**Controls the demo must pass without a finding**
- Loan to the parent company Konsult Holding AB on 1660: group exemption, no finding.
- Invoice cluster to Liten Studio HB (2.6): explanation, severity `info`, never `attention`.
- Depreciation on an asset acquired mid-year: partial-year amount is correct, no finding.
- Klient AB weekly invoicing (9.4): hour-based lines, paid within terms in 2025; recurring revenue backed by delivery and payment, no finding. Its 2026 arrears are a 9.7 finding, not a 9.4 finding.
- Berlin GmbH workshops (9.4): varying amounts per workshop, project revenue, no finding.
- Apple iPad on 1230 (9.3): capitalised asset, not a one-off, no finding.

## Planted errors, revised (replaces the 2026-09-11 morning proposal)

| # | Pattern | Booking in Konsult AB | Source |
|---|---|---|---|
| P1 | Payment booked as new cost with VAT | 2026-06-03: 5010 8 500 D, 2641 2 125 D, 1930 10 625 K, text "WeWork juni"; WW-2026-05 stays open on 2440 | 1.4 |
| P2 | Employee receivable drifting | 1610 D against 1930 K monthly 2026-02 to 2026-08: 1 240, 860, 2 380, 1 120, 1 990, 940, 2 210; text "Kortköp, kvitto saknas" | 4.4 |
| P3 | Owner settlement account to debit (prohibited loan) | 2893: 25 000 D against 1930 K on the 25th, 2026-03 to 2026-07, text "Uttag Anna Andersson" | 4.4 + ABL 21 kap |
| P4 | Owner loan in, no interest, no agreement | 2026-01-15: 1930 300 000 D, 2393 300 000 K, text "Lån från aktieägare"; no 84xx interest, no document | 4.3, 9.9 |
| P5 | Foreign receipt with local VAT deducted | 2026-04-14 supplier invoice Hotel Alexanderplatz GmbH (DE): 5831 5 500 D, 2641 1 045 D, 2440 6 545 K | tax spec |
| P6 | Struck line without explanation | `correct_entry_lines_inline` on A:87: strike 2641 2 125, add 2641 2 725 and 2440 adjustment, no note | 5.5 |
| P7 | ARR without contract | Nordic Tech AS: four 2026 invoices 14 000 (and twelve of 13 000 in 2025), seed item text "Konsulttjänst export: månad N/2026" (the brief says "Månadsabonnemang"; verify in the running demo), no `recurring_invoice_schedule`, no agreement document. dd-9.4 catches it by fixed amount and monthly cadence, not by the word | 9.4 |
| C1 | Control: group loan | 2026-02-01: 1660 200 000 D, 1930 200 000 K, text "Lån till Konsult Holding AB" | ABL 21 kap 2 § |
| C2 | Control: invoice cluster | Liten Studio HB: four invoices same day, three credited fourteen days later | 2.6 |
| E1 | Existing: result disposition missing | 2099 carries 588 561 into 2026, nothing on 2091 | 4.1 |
| E2 | Existing: depreciation missing | 1230 18 000 since 2026-02-14, no 78xx | 3.3 |
| E3 | Existing: receivables overdue | 396 875, oldest 148 days, 82 % one customer | 9.7 |
| P9 | Proposed, not planted: moving cost | supplier invoice 2026-03-20 "Flyttfirma Stockholm AB", "Kontorsflytt Vasagatan", 45 000 + 11 250 VAT, account 6990, one invoice from the supplier in 24 months | 9.3 |
| P10 | Proposed, not planted: legal fee in a dispute | supplier invoice 2026-05-12 "Advokatfirman Nord AB", "Ombud i tvist med tidigare leverantör", 62 000 + 15 500 VAT, account 6580, no other invoice from the supplier | 9.3 |
| C4 | Proposed control, not planted: recurring "one-off" | supplier invoices 2025-06-10, 2025-12-10 and 2026-03-10 "Rekryteringsbolaget AB", "Rekryteringsavgift", 30 000 + 7 500 VAT each, account 7690: same cadence in both years, run-rate, must not be on the normalisation list | 9.3 |

Planting script: `scripts/plant-errors.ts`, same posting pattern as Accounted's seed script (draft, lines, posted), P6 through the correction RPC so the log is genuine, idempotent, `--undo` reverses by storno.

## Additions from the owner interview 2026-09-11

| Id | Function | Persona | Check id | Accounted data | Konsult AB | Saturday |
|---|---|---|---|---|---|---|
| A1 | Consumables (food, wine, pastries) bought in private contexts: weekends, public holidays, vacation weeks; booked as representation or supplies with full VAT and no participant list | tax, forensic | `tax-A1-consumables-private-context` | 6071/6072/5460 lines by date and weekday, supplier or merchant text, documents (participant list), Swedish holiday calendar | **plant P8**: six purchases on Långfredag, påskafton, midsommarafton and July Saturdays; **control C3**: weekday kick-off with participants | **1** (replaces the shared 1.4 slot for the tax reviewer if time is short) |
| A2 | Related-party dealings: monitor what the ledger shows, and when no related-party register exists, offer to map it (owners, board, employees, their companies; same person as owner, landlord and supplier; org numbers and addresses shared between counterparties and insiders) | auditor, next CFO | `aud-A2-related-party-mapping` | `suppliers`, `customers`, `employees`, owner data, 23xx/28xx/16xx | P3, P4, C1 give the ledger side; no register exists, so the panel offers mapping as an `info` case | 2 |

Wording rule for A1 and A2, from CLAUDE.md §2 rule 4: describe the deviation from the pattern (frequency, timing, amounts, missing participant lists), never intent. The case title is "purchases in private-context timing without participant lists", not anything about fraud.

Planted additions: **P8** consumables series (2026-04-03 ICA 3 480 · 2026-04-04 Systembolaget 2 960 · 2026-06-19 ICA 4 120 and Systembolaget 3 340 · 2026-07-11 ICA 2 870 · 2026-07-18 bageri 1 260, all on 6071 with full VAT, no participants); **C3** control: 2026-03-11 weekday kick-off 1 200 with twelve participants documented.
