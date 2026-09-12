# Persona v2 (skills loaded): auditor · qwen3.6:35b-a3b · 2026-09-11

Kommando: `python3 scripts/persona-smoke.py auditor 20` mot Konsult AB med planterade fel P1–P8, kontroller C1, C3.

## Turer
```
[setup] model=qwen3.6:35b-a3b persona=auditor checks=['aud-1.4-payment-booked-as-cost', 'aud-3.3-depreciation-missing', 'aud-4.1-result-disposition'] tools=59 system_chars=10425
[turn 1] prompt=14652 completion=528 finish=tool_calls tool_choice=required tools=['accounted_get_agent_briefing', 'accounted_list_fiscal_periods', 'accounted_get_kpi_report', 'accounted_get_trial_balance', 'accounted_get_general_ledger', 'accounted_get_general_ledger', 'accounted_get_general_ledger', 'accounted_get_balance_sheet', 'accounted_get_supplier_ledger', 'accounted_get_ar_ledger', 'accounted_list_voucher_gaps', 'accounted_list_transactions_without_documents', 'accounted_list_verifikat_without_documents', 'accounted_query_journal', 'accounted_list_supplier_invoices', 'accounted_list_supplier_invoices', 'accounted_get_reconciliation_status', 'accounted_get_reconciliation_status', 'accounted_query_journal', 'accounted_query_journal']
         -> accounted_get_agent_briefing({}) 6411 chars
         -> accounted_list_fiscal_periods({}) 497 chars
         -> accounted_get_kpi_report({}) 1638 chars
         -> accounted_get_trial_balance({}) 6006 chars
         -> accounted_get_general_ledger({"account_from": "1000", "account_to": "1999"}) 8012 chars
         -> accounted_get_general_ledger({"account_from": "2000", "account_to": "2999"}) 8012 chars
         -> accounted_get_general_ledger({"account_from": "4000", "account_to": "4999"}) 90 chars
         -> accounted_get_balance_sheet({}) 3461 chars
         -> accounted_get_supplier_ledger({}) 419 chars
         -> accounted_get_ar_ledger({}) 6026 chars
         -> accounted_list_voucher_gaps({"fiscal_period_id": "e5e28b49-3e17-405e-b064-f1b8915e708c"}) 60 chars
         -> accounted_list_transactions_without_documents({"limit": 50}) 8012 chars
         -> accounted_list_verifikat_without_documents({"limit": 50}) 8012 chars
         -> accounted_query_journal({"source_type": "manual", "limit": 100}) 8012 chars
         -> accounted_list_supplier_invoices({"status": "to_pay"}) 580 chars
         -> accounted_list_supplier_invoices({"status": "registered"}) 75 chars
         -> accounted_get_reconciliation_status({"account_key": "skattekonto", "date_from": "2025-01-01", "date_to": "2025-12-31"}) 203 chars ERROR
         -> accounted_get_reconciliation_status({"account_key": "bank:1930", "date_from": "2025-01-01", "date_to": "2025-12-31"}) 201 chars ERROR
         -> accounted_query_journal({"account_from": "7800", "account_to": "7999", "date_from": "2025-01-01", "date_to": "2025-12-31"}) 755 chars
         -> accounted_query_journal({"account_from": "1200", "account_to": "1299", "date_from": "2025-01-01", "date_to": "2025-12-31"}) 755 chars
[turn 2] prompt=42953 completion=581 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_query_journal', 'accounted_query_journal', 'accounted_get_general_ledger', 'accounted_get_balance_sheet', 'accounted_get_supplier_ledger', 'accounted_query_journal']
         -> accounted_query_journal({"accounts": ["2641", "1930"], "date_from": "2026-01-01", "date_to": "2026-12-31", "source_type": "manual", "text": "WeW) 1898 chars
         -> accounted_query_journal({"accounts": ["2641", "1930"], "source_type": "manual", "text": "WeWork Stockholm"}) 783 chars
         -> accounted_query_journal({"accounts": ["2641", "1930"], "source_type": "manual"}) 8012 chars
         -> accounted_get_general_ledger({"period_id": "14553daf-54cc-4c49-864a-09838a0b3df2", "account_from": "2091", "account_to": "2099"}) 678 chars
         -> accounted_get_balance_sheet({"period_id": "14553daf-54cc-4c49-864a-09838a0b3df2"}) 1620 chars
         -> accounted_get_supplier_ledger({"as_of_date": "2025-12-31"}) 139 chars
         -> accounted_query_journal({"account_from": "1200", "account_to": "1299", "date_from": "2026-01-01", "date_to": "2026-12-31"}) 1372 chars
[turn 3] prompt=49445 completion=277 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_get_supplier_invoices', 'accounted_query_journal']
         -> accounted_query_journal({"accounts": ["2641", "1930", "2440"], "date_from": "2026-01-01", "date_to": "2026-12-31", "source_type": "manual"}) 8012 chars
         -> accounted_get_supplier_invoices({"status": "to_pay", "supplier_name": "WeWork"}) 5509 chars ERROR
         -> accounted_query_journal({"account_from": "5000", "account_to": "5999", "date_from": "2026-01-01", "date_to": "2026-12-31"}) 8012 chars
[turn 4] prompt=57420 completion=155 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_list_supplier_invoices']
         -> accounted_query_journal({"accounts": ["2440"], "date_from": "2026-01-01", "date_to": "2026-12-31", "source_type": "manual"}) 771 chars
         -> accounted_list_supplier_invoices({"status": "all", "supplier_name": "WeWork"}) 7030 chars
[turn 5] prompt=61184 completion=275 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_get_supplier_ledger']
         -> accounted_query_journal({"accounts": ["5010", "2641", "2440", "1930"], "date_from": "2026-04-01", "date_to": "2026-06-30", "text": "WeWork", "in) 6689 chars
         -> accounted_get_supplier_ledger({}) 419 chars
[turn 6] prompt=64403 completion=123 finish=tool_calls tool_choice=auto tools=['accounted_query_journal']
         -> accounted_query_journal({"date_from": "2026-01-01", "date_to": "2026-12-31", "source_type": "manual", "text": "Betalning WeWork"}) 2429 chars
[turn 7] prompt=65516 completion=1861 finish=stop tool_choice=auto tools=-
[total] turns=7 prompt=355573 completion=3800 tool_calls=35 errors=3 rejections=0 time=130s
```

## Modellens svar (oredigerat)

Nu har jag allt underlag. Låt mig sammanställa rapporten.

---

## Revision: Konsult AB (org.nr 5591234567)

### aud-1.4 – Betalning bokförd som ny kostnad

**Avvikelse hittad.** Manualvouchers A:124 (2026-06-03) "Betalning WeWork juni" bokfördes som ny kostnad med ingående moms istället för att reglera den registrerade skulden mot 2440.

**Hitta:** 
- Manualvoucher A:124 (2026-06-03) debiterar 5010 (8 500 kr) och 2641 (2 125 kr moms), krediterar 1930 (10 625 kr). Beskrivning: "Betalning WeWork juni".
- Leverantörsfakturan WW-2026-04 (id: `31b048b6-22a5-4648-ba3a-d0de3b62cfc6`, total 10 625 kr, status: paid) är redan registrerad och betald via supplier_invoice_paid-voucher A:86 (2026-04-05).
- Leverantörsfakturan WW-2026-05 (id: `cbaac289-f8c0-4a2e-97e7-3b4bd0c8c824`, total 10 625 kr, status: overdue, remaining: 10 625 kr) står kvar som skuld.
- Totalt har kostnaden bokförts två gånger (voucher A:85 och A:124) och momsen två gånger (voucher A:85 och A:124).

**Vad det innebär:** Momsen på 2 125 kr är avdragen twice (i både A:85 och A:124). Det innebär att ingående moms är överavdragen med 2 125 kr. Skulden till WeWork på 10 625 kr står kvar som obetald trots att betalningen redan är bokförd (men mot fel konto).

**Severity:** `attention` – betalningsperioden 2026-Q2 är inte deklarerad än (vi har endast 2026-perioder).

**Vägande:** Detta är en systematisk bokföringsbortfall. Alla WeWork-månadsfakturor betalas via supplier_invoice_paid (korrekt), men juni-betalningen registrerades extra som manualvoucher.

**Ägare:** Löne- och redovisningsansvarig (bookkeeper). **Datum:** Före nästa momsdeklaration.

**Vad som stänger:** Återföring av manualvoucher A:124 och korrigering av momsavdraget. Om fakturan WW-2026-05 är den som avses med "juni", ska betalningen bokföras mot 2440 istället.

---

### aud-3.3 – Avskrivning saknas

**Avvikelse hittad.** Inventariet på 1230 "Inventarier och verktyg" anskaffat 2026-02-14 (iPad Pro 13", 18 000 kr, voucher A:104) har inte skrivits av sedan anskaffningen.

**Hitta:**
- 1230 har en debetpost på 18 000 kr (2026-02-14, A:104).
- 78xx-kontot (avskrivningar) har noll transaktioner för 2026.
- Ingen avskrivning har bokförts för perioderna februari–augusti 2026 (7 månader).
- En iPad Pro är förbrukningsinventarie med beräknad användningstid om 36 månader. Månadsavskrivning bör vara 18 000 / 36 = 500 kr/månad.

**Vad det innebär:** Resultatet för 2026 är överskattat med cirka 3 000 kr (7 månader × 500 kr) i uteblivna avskrivningar.

**Severity:** `attention` – det uteblivna beloppet (3 000 kr) är mindre än 1 % av periodens resultat (30 671,96 kr), men det påverkar fortfarande månadernas resultat.

**Vägande:** Det är bara ett inventarium, men det bör bokföras löpande varje månad.

**Ägare:** Redovisningsansvarig. **Datum:** Före nästa månadavslut.

**Vad som stänger:** Avskrivning bokförd för de uteblivna månaderna (eget eller ett upphämtande verifikat med noter).

---

### aud-4.1 – Resultatdisposition saknas

**Ingen avvikelse.** Räkenskapsåret 2025 är inte "closed" i systemet – periodstatus är `active`, vilket innebär att bokslut inte är genomfört. Årets resultat för 2025 står på 2099 med 588 561,25 kr efter årsbokslutsvoucher A:295 (2025-12-31). Eftersom räkenskapsåret 2025 fortfarande har status `active` och ingen årsstämma har ägt rum med disposition, är detta inte en avvikelse än – det är ett öppet bokslut.

**Verifierat:** Period 2025 har status `active`. Inget årsskifte har genomförts (inga öppningsbalanser från 2026 års 2091). Inget 2091-dispositionsvoucher finns. 2099 bär fortfarande 2025-års resultat på 588 561,25 kr.

---

### Vad jag inte kunde verifiera

- **Bankreconciliation:** Skattekonto och bankkonto 1930 kunde inte kopplas för reconciliation (okända account_keys). Jag kan inte verifiera att bankkontot stämmer mot kontoutdrag, eller att momskontot (2650, 341 170 kr) stämmer överens med deklarerad moms.
- **Kundfordringar:** 396 875 kr i kundfordringar varav 324 000 kr hos Klient AB är över 90 dagar försenade (149 dagar senast). Jag kunde inte verifiera om dessa fordringar är värdelösa och behöver värdeminskning, eller om det finns avtal om sen betalning.
- **Återstående WeWork-faktura:** WW-2026-05 (10 625 kr) står som overdue. Jag kunde inte verifiera om detta är en faktura som redan är betald men inte kopplad till en betalning, eller om betalningen verkligen uteblir.
- **Verifikationsluckor:** Inga luckor hittades för 2026 (gaps: 0). Detta stämmer med att verifikatserien är kontinuerlig.
- **Underlag till manualvouchers:** Flera manualvouchers har inget underlag (kвитto saknas, representation etc.). Det påverkar inte de tre specifika checkarna direkt, men är ett allmänt redovisningsmässigt问题.
- **Personalskatt:** Jag kunde inte verifiera om inbetald personalskatt och sociala avgifter stämmer överens med deklarerade AGI.
- **Lån från närstående:** 300 000 kr lån från Anna Andersson på 2393. Jag kunde inte verifiera låneavtal eller ränteberäkning.
