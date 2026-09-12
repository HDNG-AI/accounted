# Persona smoke: auditor · qwen3.6:35b-a3b · 2026-09-10

Kommando: `python3 scripts/persona-smoke.py auditor 20` mot Konsult AB via lokal MCP med read-only-nyckel.

## Turer
```
[setup] model=qwen3.6:35b-a3b persona=auditor tools=59 schema_chars=46100
[turn 1] prompt=12363 completion=67 finish=tool_calls tools=['accounted_get_agent_briefing', 'accounted_list_fiscal_periods']
         -> accounted_get_agent_briefing({}) 6411 chars
         -> accounted_list_fiscal_periods({}) 497 chars
[turn 2] prompt=14630 completion=129 finish=tool_calls tools=['accounted_get_trial_balance', 'accounted_get_reconciliation_status', 'accounted_list_verifikat_without_documents']
         -> accounted_get_trial_balance({}) 4722 chars
         -> accounted_get_reconciliation_status({"account_key": "skattekonto"}) 203 chars ERROR
         -> accounted_list_verifikat_without_documents({"limit": 30}) 8012 chars
[turn 3] prompt=20202 completion=166 finish=tool_calls tools=['accounted_connect_skatteverket', 'accounted_get_reconciliation_status', 'accounted_list_reconciliation_items', 'accounted_get_balance_sheet']
         -> accounted_connect_skatteverket({}) 269 chars
         -> accounted_get_reconciliation_status({"account_number": "1930"}) 706 chars
         -> accounted_list_reconciliation_items({"account_key": "bank:1930", "bucket": "unmatched_external", "limit": 30}) 201 chars ERROR
         -> accounted_get_balance_sheet({}) 2554 chars
[turn 4] prompt=21778 completion=254 finish=tool_calls tools=['accounted_list_voucher_gaps', 'accounted_list_uncategorized_transactions', 'accounted_list_inbox_items', 'accounted_query_journal']
         -> accounted_list_voucher_gaps({"fiscal_period_id": "4e512ef3-49f5-4652-9d86-d14b0c767958"}) 60 chars
         -> accounted_list_uncategorized_transactions({"limit": 20}) 3507 chars
         -> accounted_list_inbox_items({"unprocessed_only": true, "limit": 15}) 618 chars
         -> accounted_query_journal({"accounts": ["7010", "7510"], "group_by": "voucher_series", "limit": 20}) 8012 chars
[turn 5] prompt=27244 completion=205 finish=tool_calls tools=['accounted_query_journal', 'accounted_query_journal', 'accounted_list_employees', 'accounted_list_supplier_invoices']
         -> accounted_query_journal({"accounts": ["2650"], "group_by": "voucher_series", "limit": 20}) 2052 chars
         -> accounted_query_journal({"accounts": ["1230"], "limit": 5, "include_dimensions": true}) 1392 chars
         -> accounted_list_employees({}) 1348 chars
         -> accounted_list_supplier_invoices({"status": "to_pay"}) 581 chars
[turn 6] prompt=29632 completion=93 finish=tool_calls tools=['accounted_list_invoices', 'accounted_get_ar_ledger', 'accounted_get_kpi_report']
         -> accounted_list_invoices({"limit": 10}) 4216 chars
         -> accounted_get_ar_ledger({}) 6024 chars
         -> accounted_get_kpi_report({}) 1606 chars
[turn 7] prompt=35041 completion=173 finish=tool_calls tools=['accounted_query_journal', 'accounted_query_journal', 'accounted_list_supplier_invoices']
         -> accounted_query_journal({"accounts": ["5010"], "limit": 12}) 7948 chars
         -> accounted_query_journal({"accounts": ["5420"], "limit": 10}) 6780 chars
         -> accounted_list_supplier_invoices({"date_from": "2026-05-01", "status": "registered"}) 75 chars
[turn 8] prompt=41237 completion=153 finish=tool_calls tools=['accounted_query_journal', 'accounted_get_vat_report']
         -> accounted_query_journal({"date_from": "2026-05-01", "date_to": "2026-05-31", "limit": 30}) 8012 chars
         -> accounted_get_vat_report({"period": 4, "period_type": "quarterly", "year": 2026}) 479 chars
[turn 9] prompt=45064 completion=338 finish=tool_calls tools=['accounted_get_vat_report', 'accounted_vat_declaration_status', 'accounted_query_journal', 'accounted_get_reconciliation_status']
         -> accounted_get_vat_report({"period": 1, "period_type": "quarterly", "year": 2026}) 535 chars
         -> accounted_vat_declaration_status({"period": 1, "period_type": "quarterly", "year": 2026}) 246 chars ERROR
         -> accounted_query_journal({"date_from": "2026-05-01", "date_to": "2026-05-31", "accounts": ["3001", "3305", "3308"], "group_by": "voucher_series",) 7225 chars
         -> accounted_get_reconciliation_status({"account_key": "manual:1930"}) 1480 chars
[turn 10] prompt=49546 completion=222 finish=tool_calls tools=['accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"voucher_series": "A", "voucher_number_from": 68, "voucher_number_to": 78, "include_dimensions": true, "limit": 30}) 8012 chars
         -> accounted_query_journal({"accounts": ["3305", "3308"], "date_from": "2026-01-01", "date_to": "2026-09-10", "limit": 20}) 8012 chars
[turn 11] prompt=56524 completion=190 finish=tool_calls tools=['accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"voucher_series": "A", "voucher_number_from": 120, "voucher_number_to": 123, "include_dimensions": true, "limit": 20}) 8012 chars
         -> accounted_query_journal({"voucher_series": "A", "voucher_number_from": 68, "voucher_number_to": 71, "include_dimensions": true, "limit": 20}) 8012 chars
[turn 12] prompt=63410 completion=129 finish=tool_calls tools=['accounted_list_supplier_invoices', 'accounted_get_balance_sheet']
         -> accounted_list_supplier_invoices({"supplier_name": "WeWork", "date_from": "2026-05-01"}) 581 chars
         -> accounted_get_balance_sheet({"as_of_date": "2026-03-31"}) 2702 chars
[turn 13] prompt=64817 completion=1139 finish=stop tools=-
[total] turns=13 prompt=481488 completion=3258 tool_calls=35 errors=3 time=71s
```

## Modellens svar (oredigerat)

I now have sufficient evidence to prepare my audit findings. Here is the report:

---

## Revisorssyn – Konsult AB (org.nr 559123-4567) – Första genomgång

### Finde 1
**Hög skuldställning på momsredovisningskonto utan verifiering mot inlämnade deklarationer** · konto 2650 balanserar på 341 170 kr (enbart debet/credit: två poster – öppningsbalans 1/1 2026 via A:1 och momsavräkning 31/12 2025 via A:294); Skatteverket-integrationen är inte aktiv, så inlämnat-status kan inte verifieras. · Lämna in momsdeklarationerna manuellt och kontrollera kvitto via skatteverket.se för Q1–Q3 2026. · **blocking**

### Finde 2
**Leverantörsfaktura WeWork Stockholm AB för maj 2026 obetaltd med förfallodatum 2026-06-01** · leverantörsfaktura WW-2026-05 (id cbaac289), belopp 10 625 kr, status "approved" men ej "paid"; verifikat A:87 bokfördes hyra + skuld; förfallen >3 månader. · Betala fakturan och koppla betalningen mot verifikat via accounted_link_supplier_invoice_to_voucher. · **attention**

### Finde 3
**Manuell verifikat utan dokument: skattebetalningar och Stripe-avgifter** · Verifikat A:123 (2026-05-12, 99 895 kr, inbetalning skatt+sociala 4/2026), A:120 (2026-04-12, 99 895 kr, 3/2026), A:117 (2026-03-12, 99 895 kr), A:114 (2026-02-12, 99 895 kr), A:112 (2026-01-12, 99 895 kr) – samt A:78 (863 kr, A:71 278 kr, A:68 566 kr, Stripe-avgifter). Källtyp "manual", inga underlagsdokument kopplade. · Tillförsel av verifikatunderlag (bankkvitto, Skattekontoutdrag) via accounted_create_voucher med dokument. · **attention**

### Finde 4
**Alla kundfordringar är förfallna – sammanlagd 396 875 kr utan förfallna rader på 90+ dagar** · Kundreskontra per 2026-09-10: totalt 12 obetalda fakturor; Klient AB 9 fakturor om 324 000 kr (äldsta F-20260011 från 2026-03-17, 148 dagar försenad); Berlin GmbH 41 000 kr; Helsinki Oy 20 000 kr; Liten Studio HB 11 875 kr. Ingen förfallna fakturor inom 0–90 dagar. · Företaget ska bedöma avsätt för tvivelaktiva fordringar; kontakta kunderna för betalning. · **attention**

### Finde 5
**Majs månad visar anomal nettointäkt på +179 353 kr i KPI-rapporten med noga kostnader – möjlig inkorrekt periodisering** · Månadsdata: inkomst 189 560 kr (från 11 fakturor 1–5 maj, verifikat A:60–A:76), utgifter endast 10 207 kr (3 Stripe-avgifter + WeWork-hyra + SJ + Linear). Ingen lönebokföring eller sociala avgifter för maj 2026 har bokförts. · Verifiera om lön och avgifter för april/май 2026 är korrekte; boka eventuellt efterfört löne- och avgiftsverifikat innan periodavstängning. · **attention**

---

**Ej verifierat:** Jag kunde inte verifiera om Q1–Q3 2026 momsdeklarationer har inlämnats hos Skatteverket, eftersom integrationen är inaktiv och verktyget `accounted_vat_declaration_status` returnerade `EXTENSION_DISABLED`. Jag kunde också inte verifiera bankreconciliation mot 1930 (bankkontot) då kontot inte är kopplat till en bankkälla i systemet.
