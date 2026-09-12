# DD analyst v2 (teamets persona) mot rent demobolag med P7, P10, P11, C5 · qwen3.6:35b-a3b · 2026-09-12

```
[setup] model=qwen3.6:35b-a3b persona=dd-analyst checks=['dd-9.7-aging', 'dd-9.4-arr-backed', 'dd-9.3-normalisations'] tools=59 system_chars=20194
[setup] model=qwen3.6:35b-a3b persona=dd-analyst checks=['dd-9.7-aging', 'dd-9.4-arr-backed', 'dd-9.3-normalisations'] tools=59 system_chars=20194
[turn 1] 2s prompt=16783 completion=122 finish=tool_calls tool_choice=required tools=['accounted_get_agent_briefing', 'accounted_list_fiscal_periods']
         -> accounted_get_agent_briefing({"company_id": "c3a2f5b6-1f7e-4d9c-8a3b-5e6d7f8a9b0c"}) 163 chars ERROR
         -> accounted_list_fiscal_periods({"company_id": "c3a2f5b6-1f7e-4d9c-8a3b-5e6d7f8a9b0c"}) 163 chars ERROR
[turn 2] 1s prompt=17052 completion=54 finish=tool_calls tool_choice=auto tools=['accounted_list_companies']
         -> accounted_list_companies({}) 546 chars
[turn 3] 5s prompt=17386 completion=546 finish=tool_calls tool_choice=auto tools=['accounted_get_ar_ledger', 'accounted_get_ar_ledger', 'accounted_get_supplier_ledger', 'accounted_get_supplier_ledger', 'accounted_get_kpi_report', 'accounted_list_customers']
         -> accounted_get_ar_ledger({"as_of_date": "2024-12-31", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 241 chars
         -> accounted_get_ar_ledger({"as_of_date": "2026-01-15", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1977 chars
         -> accounted_get_supplier_ledger({"as_of_date": "2024-12-31", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 139 chars
         -> accounted_get_supplier_ledger({"as_of_date": "2026-01-15", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 401 chars
         -> accounted_get_kpi_report({"period_id": "7c4a7d30-312a-4306-90c0-1d5b1e7e3c4f", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 175 chars ERROR
         -> accounted_list_customers({"company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 2035 chars
[turn 4] 2s prompt=20219 completion=62 finish=tool_calls tool_choice=auto tools=['accounted_list_fiscal_periods']
         -> accounted_list_fiscal_periods({"company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 497 chars
[turn 5] 3s prompt=20552 completion=301 finish=tool_calls tool_choice=auto tools=['accounted_get_kpi_report', 'accounted_get_kpi_report', 'accounted_list_invoices']
         -> accounted_get_kpi_report({"period_id": "9eb6ef2a-cd02-4d75-be8a-4c1b13107726", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1839 chars
         -> accounted_get_kpi_report({"period_id": "8a54359d-76f9-4847-bd7e-9c0b68029638", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1650 chars
         -> accounted_list_invoices({"limit": 100, "offset": 0, "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 8012 chars
[turn 6] 4s prompt=26039 completion=282 finish=tool_calls tool_choice=auto tools=['accounted_list_invoices', 'accounted_list_invoices']
         -> accounted_list_invoices({"limit": 100, "offset": 100, "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 8012 chars
         -> accounted_list_invoices({"limit": 100, "offset": 200, "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 198 chars ERROR
[turn 7] 6s prompt=29835 completion=635 finish=tool_calls tool_choice=auto tools=['accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_list_supplier_invoices']
         -> accounted_get_invoice({"invoice_id": "71a69c55-1d67-4cc5-84fc-3fbe3a4f808e", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1388 chars
         -> accounted_get_invoice({"invoice_id": "feb4fc33-acbe-4b22-8552-2048bd8bcb19", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1388 chars
         -> accounted_get_invoice({"invoice_id": "16fd7655-de8b-4527-a949-caff025273d5", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1376 chars
         -> accounted_list_supplier_invoices({"company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2", "date_from": "2024-01-01", "date_to": "2026-01-15", "limit": 100,) 8012 chars
[turn 8] 4s prompt=35910 completion=330 finish=tool_calls tool_choice=auto tools=['accounted_search_tools']
         -> accounted_search_tools({"query": "recurring schedule", "detail": "name"}) 171 chars
[turn 9] 1s prompt=36324 completion=90 finish=tool_calls tool_choice=auto tools=['accounted_call_tool']
         -> accounted_call_tool({"tool": "accounted_list_recurring_schedules", "arguments": {}, "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 76 chars
[turn 10] 8s prompt=36465 completion=891 finish=tool_calls tool_choice=auto tools=['accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice']
         -> accounted_get_invoice({"invoice_id": "be180286-d427-4dfa-9b25-62058bc738bf", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1386 chars
         -> accounted_get_invoice({"invoice_id": "42d80850-8ba0-4a40-be85-64965d58aa51", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1403 chars
         -> accounted_get_invoice({"invoice_id": "855a8901-3f42-44c6-91aa-b4eedcd63c24", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1391 chars
         -> accounted_get_invoice({"invoice_id": "611a480d-f51f-4ef2-8905-9c6899859bfb", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1379 chars
         -> accounted_get_invoice({"invoice_id": "84b57383-66af-4b7a-826e-d754731bdc48", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1392 chars
[turn 11] 7s prompt=40279 completion=700 finish=tool_calls tool_choice=auto tools=['accounted_list_unmatched_documents', 'accounted_query_journal', 'accounted_query_journal']
         -> accounted_list_unmatched_documents({"company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2", "limit": 20}) 627 chars
         -> accounted_query_journal({"accounts": ["1510"], "source_type": "bank_transaction", "limit": 5, "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea) 765 chars
         -> accounted_query_journal({"accounts": ["2440"], "source_type": "bank_transaction", "limit": 5, "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea) 765 chars
[turn 12] 12s prompt=41825 completion=1374 finish=tool_calls tool_choice=auto tools=['accounted_get_ar_ledger', 'accounted_get_supplier_ledger']
         -> accounted_get_ar_ledger({"as_of_date": "2026-09-12", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 6026 chars
         -> accounted_get_supplier_ledger({"as_of_date": "2026-09-12", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 419 chars
[turn 13] 8s prompt=46149 completion=797 finish=tool_calls tool_choice=auto tools=['accounted_get_balance_sheet', 'accounted_query_journal']
         -> accounted_get_balance_sheet({"period_id": "9eb6ef2a-cd02-4d75-be8a-4c1b13107726", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1620 chars
         -> accounted_query_journal({"accounts": ["1510"], "limit": 20, "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 8012 chars
[turn 14] 12s prompt=50929 completion=1251 finish=tool_calls tool_choice=auto tools=['accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice']
         -> accounted_get_invoice({"invoice_id": "855a8901-3f42-44c6-91aa-b4eedcd63c24", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1391 chars
         -> accounted_get_invoice({"invoice_id": "4698b34e-0a7a-49f4-8e64-4036ebc8441a", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1374 chars
         -> accounted_get_invoice({"invoice_id": "cb48220b-b736-468c-8d25-0147ec57b028", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1385 chars
[nudge] conclude, 6 turns left
[turn 15] 13s prompt=53907 completion=512 finish=tool_calls tool_choice=auto tools=['accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_list_invoices']
         -> accounted_get_invoice({"invoice_id": "6382d203-63eb-412b-8a0c-2c54e75bf11b", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 212 chars ERROR
         -> accounted_get_invoice({"invoice_id": "5dc1aa67-d226-4225-b292-624410645d08", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 212 chars ERROR
         -> accounted_get_invoice({"invoice_id": "dc9af465-3da4-4399-82f8-1ccd41487e4b", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 212 chars ERROR
         -> accounted_get_invoice({"invoice_id": "566fe137-8412-4ba6-aca1-ffd2409d4028", "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2"}) 1385 chars
         -> accounted_list_invoices({"limit": 50, "offset": 0, "company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2", "status": "all"}) 185 chars
[turn 16] 2s prompt=55311 completion=130 finish=tool_calls tool_choice=auto tools=['accounted_query_journal']
         -> accounted_query_journal({"source_type": "supplier_invoice", "date_from": "2024-01-01", "date_to": "2026-09-12", "limit": 500, "company_id": "25b) 765 chars
[turn 17] 2s prompt=55733 completion=129 finish=tool_calls tool_choice=auto tools=['accounted_list_supplier_invoices']
         -> accounted_list_supplier_invoices({"company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2", "date_from": "2024-01-01", "date_to": "2026-09-12", "limit": 100,) 8012 chars
[turn 18] 38s prompt=59554 completion=4096 finish=length tool_choice=auto tools=-
[reject] no tool_calls; content looks like a narrated tool trace or was cut off (9827 chars)
[turn 19] 3s prompt=59581 completion=143 finish=tool_calls tool_choice=auto tools=['accounted_list_supplier_invoices']
         -> accounted_list_supplier_invoices({"company_id": "25b1dbb1-379e-42ce-9142-eda2f7c64ea2", "date_from": "2024-01-01", "date_to": "2026-09-12", "limit": 100,) 353 chars ERROR
[turn 20] 24s prompt=59840 completion=2640 finish=stop tool_choice=auto tools=-
[total] turns=20 prompt=779673 completion=15085 tool_calls=44 errors=8 rejections=1 time=168s
```

## Rättning
```

/tmp/dd2.out: 3/14 planted patterns mentioned
  miss  P1 payment as cost
  miss  P2 employee receivable
  miss  P3 owner account debit
  miss  P4 owner loan no interest
  miss  P5 foreign VAT
  miss  P6 struck line no note
  miss  P8 private-context buys
  miss  E1 result disposition
  miss  E2 depreciation missing
  HIT   E3 receivables overdue
  miss  P9 late tax payment
  HIT   P7 ARR without contract
  miss  P10 moving cost
  HIT   P11 legal fee in dispute
  ok           C1 group loan (must not flag)
  ok           C3 kick-off fika (must not flag)
  ok           C4 booked late, paid on time (must not flag)
  ok           C6 Klient AB recurring (must not flag as unbacked)
  ok           C5 quarterly recruitment fee (must not be a one-off)
```

## gemma4 kontroll
```
[control] model=gemma4:31b prompt=3005 completion=570 findings=1 godkänt=1 nedgraderat=0 avvisat=0 gate=OK
```

- [godkänt] Kundfordringar förfallna utan reservation · blocking · Bokad reservation för osäkra kundfordringar med CFO-beslut och datum; alternativt betalning eller skriftlig förklaring per post med ägare och datum. Ägare: CFO. Datum: före nästa data-room-leverans.

---

# Granskning av kundfordringar


## Analys (oredigerad)

Nu har jag tillräckligt med data för att skriva rapporten.

---

**Materialitetsgräns: 10 000 kr exkl. moms**

## dd-9.7-aging

**Hittad.** 100 % av öppna kundfordringar på 396 875 kr (per 2026-09-12) är över 90 dagar förfallna.
- Klient AB: 324 000 kr (81,6 % av totalt), 9 fakturor, förfallna 101–150 dagar (F-20260011–F-20260037). Kunden betalade regelbundet 36 000 kr/månad under hela 2025, men alla fakturor sedan mars 2026 är obetalda. Default payment terms: 30 dagar.
- Berlin GmbH: 41 000 kr (10,3 %), 1 faktura (F-20260026), 116 dagar överfallet.
- Helsinki Oy: 20 000 kr (5,0 %), 1 faktura (F-20260032), 117 dagar överfallet.
- Liten Studio HB: 11 875 kr (3,0 %), 1 faktura (F-20260033), 164 dagar överfallet.
- Leverantör: WeWork Stockholm AB: 10 625 kr, över 90 dagar (supplier_ledger 2026-09-12).
- KPI 2025 total_intäkt: 1 886 400 kr → ~157 200 kr/månad. Över 90-dagarsfordringar (396 875 kr) överstiger en månad av intäkt.
- Balansräkning 2025: ingen kundfordringspost (1510) och ingen reservation för osäkra kundfordringar.

**Blocking** enligt regel: över 90-dagarsfordringar överstiger en månad av intäkt och ingen reservation för doubtful debts finns.

**Evidence:** ar_ledger 2026-09-12 total_outstanding 396 875 kr, days_90_plus 396 875 kr. invoice ids: c310446b, f089bcbe, 6afe7cb3, 84b57383, ad01fc16, 8ee07dd3, 3cf6542a, bbab9250, eb08b8f1 (Klient AB); 611a480d (Berlin); c944bdf2 (Helsinki); 3ca3e510 (Liten). balance_sheet 2025 period_id 9eb6ef2a: total_assets 965 219 kr bestående enbart av 1930; ingen 1510 eller reservation.

**What closes it:** Bokad reservation för osäkra kundfordringar med CFO-beslut och datum; eller betalning; eller skriftlig förklaring per post med ägare och datum. Ägare: CFO. Datum: före nästa data-room-leverans.

**Case title (sv):** "Kundfordringar 396 875 kr förfallna, äldsta 164 dagar, 81,6 % hos en kund"
**Pattern deviated from (sv):** "Kundfordringar betalas inom avtalade villkor och sprids över flera kunder. Här är samtliga öppna fordringar förfallna och en kund står för 81,6 %."

`auditor_duty: none | remark | report_to_skv | notify_board`

---

## dd-9.4-arr-backed

**Ingen avvikelse.** Inga återkommande intäktsserier identifierades enligt kriterierna (samma kund, samma belopp, 3+ konsekutiva perioder, quantity 1, ingen timbasis, med subscription-vokabular).

Verifierat:
- **Klient AB:** 36 000 kr/månad men beskrivning "Konsulttjänster vecka X: 24h", quantity=24, unit=tim. Timbaserad intäkt, ej recurring enligt kriterierna. invoice ids: 71a69c55, feb4fc33, 42d80850, 84b57383.
- **Berlin GmbH:** "Workshop X/2026", varierande belopp (25 000–42 000 kr), projektintäkt. invoice ids: 16fd7655, 611a480d, 4698b34e.
- **Liten Studio HB:** Varierande belopp (9 000–11 875 kr), "Stripe-betalning: engångsuppdrag". invoice id: be180286.
- **Nordic Tech AS:** "Månadsabonnemang analysplattform, 4/2026", quantity=1, unit=st — detta innehåller subscription-vokabular. Men belopp varierar (13 000 kr i 2025: F-20250062, F-20250064; 14 000 kr i 2026: F-20260030). Inget fast belopp och inte samma belopp i 3+ konsekutiva perioder. Invoice ids: cb48220b (13 000 kr, "Konsulttjänst export: månad 1/2025"), 566fe137 (13 000 kr, "Konsulttjänst export: månad 3/2025"), 855a8901 (14 000 kr, "Månadsabonnemang analysplattform, 4/2026"). Ej 3+ konsekutiva med samma belopp.
- **Recurring schedules:** 0 hittade (`accounted_list_recurring_schedules` returnerade tom lista).
- **Avtalsdokument:** Inga i arkivet kopplade till kunderna. Enda unmatched document: aws-2026-05-05.pdf (OpenAI/AWS-faktura, inte avtal).

Ingen serie uppfyller kravet på 3+ konsekutiva perioder med samma belopp. De fall som hade fast belopp (Klient AB) var timbaserade och uteslutna.

`auditor_duty: none | remark | report_to_skv | notify_board`

---

## dd-9.3-normalisations

**Ingen avvikelse.** Underlaget undersökt:

Leverantörsfakturor (2024-01-01 till 2026-09-12, 17 fakturor i resultatet, alla paid):
- WeWork Stockholm AB: 10 625 kr/månad, återkommande varje månad sedan apr 2025 (WW-2025-04 till WW-2025-12, 9 fakturor). Återkommande hyra/co-working → körbar kostnad, ej engångs.
- OpenAI LLC: 320 USD (~3 360 kr) per kvartal (OAI-2025-Q1 till Q4, 4 fakturor). Återkommande → körbar.
- Vercel Inc: 120 USD (~1 260 kr) per kvartal. Återkommande → körbar.
- SJ AB: 1 272 kr, aktuell skuld.

Inga fakturor med engångsvokabular (flytt, advokat, tvist, skadestånd, etc.). Inga poster över 10 000 kr exkl. moms som inte upprepar sig. SJ AB på 1 272 kr är under gränsen. Inga poster på 39xx (övriga intäkter) över 10 000 kr identifierade i journalen.

Befolkningskontroll: 4 leverantörer, 17 leverantörsfakturor kontrollerade, period 2024-01-01 till 2026-09-12, tröskel 10 000 kr exkl. moms.

`auditor_duty: none | remark | report_to_skv | notify_board`

---

## Övrigt att titta på

- **Intäktsstopp:** KPI 2026 visar 0 intäkt från juni 2026 och framåt trots att fakturor finns daterade maj 2026 (F-20260033–F-20260043). Detta tyder på att bokslutet för 2026 kan vara genomfört och att fakturor efter april inte genererade intäkt i KPI-rapporten. Det sista fakturerade tillståndet i ar_ledger per 2026-09-12 täcker mars–maj 2026 för kunderna, men KPI:n rapporterar bara intäkt fram till april. Detta bör kollas för att bekräfta att årsbokslutet 2026 är korrekt.
- **Kundkoncentration:** Klient AB stod för en stor del av 2025 års intäkter med 36 000 kr/månad under hela året. Vid försäljning av detta företag bör kundkoncentration beaktas.
- **WeWork-faktura:** WeWork Stockholm AB har en overdue-faktura på 10 625 kr. Detta är leverantörsrisk men under materialitetsgränsen för normalisation.

---

## Vad som inte kunde verifieras

- Ingen journal-query returnerade poster med source_type "bank_transaction" på 1510 eller 2440, så registrets öppna fordringar kunde inte reconcilierras manuellt mot 1510-kontot via journalen. ar_ledger totalt (396 875 kr) och KPI 2025 "overdue_receivables: 396 875 kr" stämmer överens, men reconciliation mot 1510 balans kunde inte göras fullt ut.
- Inga avtalsdokument kunde hittas i arkivet för någon kund. "Inget avtal i arkivet" är det enda som kunde fastställas, men ett avtal utanför systemet kan inte uteslutas.
- Bokslutet 2026 års status kunde inte verifieras fullt ut (perioden är "active", men intäktsdata är sparsam efter april). En fullständig review av årsbokslutet 2026 skulle kräva access till bokslutsdokument.

`auditor_duty: none | remark | report_to_skv | notify_board`
