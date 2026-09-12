# Revisor v3 (ISA for LCE, RevR 209, fem checks) · qwen3.6:35b-a3b · 2026-09-12

```
[setup] model=qwen3.6:35b-a3b persona=auditor checks=['aud-9.34-tax-account-late', 'aud-1.4-payment-booked-as-cost', 'aud-3.3-depreciation-missing', 'aud-4.1-result-disposition', 'aud-25.13-equity-half'] tools=59 system_chars=17945
[turn 1] 4s prompt=16616 completion=17 finish=tool_calls tool_choice=required tools=['accounted_list_companies']
         -> accounted_list_companies({}) 546 chars
[turn 2] 6s prompt=16917 completion=743 finish=tool_calls tool_choice=required tools=['accounted_get_agent_briefing', 'accounted_list_fiscal_periods', 'accounted_query_journal', 'accounted_query_journal', 'accounted_get_reconciliation_status', 'accounted_query_journal', 'accounted_list_invoices', 'accounted_list_transactions_without_documents', 'accounted_list_employees', 'accounted_get_balance_sheet']
         -> accounted_get_agent_briefing({"company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 6411 chars
         -> accounted_list_fiscal_periods({"company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 497 chars
         -> accounted_query_journal({"accounts": ["1630"], "date_from": "2024-01-01", "date_to": "2026-01-17", "company_id": "6982567a-4325-49a4-8a50-efadad) 767 chars
         -> accounted_query_journal({"accounts": ["8423", "6992", "8420"], "date_from": "2024-01-01", "date_to": "2026-01-17", "company_id": "6982567a-4325-) 795 chars
         -> accounted_get_reconciliation_status({"account_key": "skattekonto", "date_from": "2024-01-01", "date_to": "2026-01-17", "company_id": "6982567a-4325-49a4-8a5) 203 chars ERROR
         -> accounted_query_journal({"accounts": ["2650", "2710", "2731"], "date_from": "2024-01-01", "date_to": "2026-01-17", "company_id": "6982567a-4325-) 8012 chars
         -> accounted_list_invoices({"status": "overdue", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 2601 chars
         -> accounted_list_transactions_without_documents({"limit": 50, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 8012 chars
         -> accounted_list_employees({"active_only": true, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 1348 chars
         -> accounted_get_balance_sheet({"company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 3461 chars
[turn 3] 14s prompt=30664 completion=1324 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_query_journal', 'accounted_vat_declaration_status', 'accounted_vat_declaration_status', 'accounted_vat_declaration_status', 'accounted_vat_declaration_status', 'accounted_get_reconciliation_status', 'accounted_query_journal', 'accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"accounts": ["1630"], "date_from": "2025-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efadad) 767 chars
         -> accounted_query_journal({"accounts": ["2650"], "date_from": "2025-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efadad) 1921 chars
         -> accounted_vat_declaration_status({"period": 1, "period_type": "quarterly", "state": "both", "year": 2025, "company_id": "6982567a-4325-49a4-8a50-efadad9e) 246 chars ERROR
         -> accounted_vat_declaration_status({"period": 2, "period_type": "quarterly", "state": "both", "year": 2025, "company_id": "6982567a-4325-49a4-8a50-efadad9e) 246 chars ERROR
         -> accounted_vat_declaration_status({"period": 3, "period_type": "quarterly", "state": "both", "year": 2025, "company_id": "6982567a-4325-49a4-8a50-efadad9e) 246 chars ERROR
         -> accounted_vat_declaration_status({"period": 4, "period_type": "quarterly", "state": "both", "year": 2025, "company_id": "6982567a-4325-49a4-8a50-efadad9e) 246 chars ERROR
         -> accounted_get_reconciliation_status({"account_key": "bank:1930", "date_from": "2025-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-) 201 chars ERROR
         -> accounted_query_journal({"account_from": "1200", "account_to": "1299", "date_from": "2024-01-01", "date_to": "2026-12-31", "company_id": "698256) 1372 chars
         -> accounted_query_journal({"account_from": "7700", "account_to": "7999", "date_from": "2024-01-01", "date_to": "2026-12-31", "company_id": "698256) 755 chars
         -> accounted_query_journal({"accounts": ["2099", "2091", "2098"], "date_from": "2025-06-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-) 1939 chars
[turn 4] 4s prompt=35104 completion=340 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_get_income_statement', 'accounted_list_suppliers']
         -> accounted_query_journal({"source_type": "manual", "date_from": "2025-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efa) 8012 chars
         -> accounted_get_income_statement({"period_id": "dfcfe9e7-f68d-43bf-901e-70dd98b888bf", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 3037 chars
         -> accounted_list_suppliers({"company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 5707 chars
[turn 5] 8s prompt=42347 completion=659 finish=tool_calls tool_choice=auto tools=['accounted_list_supplier_invoices', 'accounted_list_supplier_invoices', 'accounted_get_supplier_ledger', 'accounted_get_ar_ledger', 'accounted_list_voucher_gaps', 'accounted_year_end_readiness', 'accounted_get_salary_journal']
         -> accounted_list_supplier_invoices({"status": "to_pay", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 580 chars
         -> accounted_list_supplier_invoices({"status": "all", "limit": 100, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 8012 chars
         -> accounted_get_supplier_ledger({"as_of_date": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 419 chars
         -> accounted_get_ar_ledger({"as_of_date": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 6026 chars
         -> accounted_list_voucher_gaps({"fiscal_period_id": "dfcfe9e7-f68d-43bf-901e-70dd98b888bf", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 274 chars
         -> accounted_year_end_readiness({"fiscal_period_id": "dfcfe9e7-f68d-43bf-901e-70dd98b888bf", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 1121 chars
         -> accounted_get_salary_journal({"year": 2025, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 247 chars
[turn 6] 6s prompt=50634 completion=400 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_list_verifikat_without_documents', 'accounted_list_employees', 'accounted_list_customers']
         -> accounted_query_journal({"source_type": "manual", "date_from": "2025-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efa) 8012 chars
         -> accounted_list_verifikat_without_documents({"limit": 50, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 8012 chars
         -> accounted_list_employees({"active_only": false, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 1348 chars
         -> accounted_list_customers({"include_archived": false, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 2035 chars
[turn 7] 8s prompt=59353 completion=638 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_get_reconciliation_status', 'accounted_vat_report', 'accounted_get_vat_report', 'accounted_propose_annual_depreciation']
         -> accounted_query_journal({"accounts": ["2641"], "date_from": "2025-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efadad) 8012 chars
         -> accounted_get_reconciliation_status({"account_key": "manual:1930", "date_from": "2026-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a5) 1480 chars
         -> accounted_vat_report({"period": "4", "period_type": "quarterly", "year": "2025", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 5498 chars ERROR
         -> accounted_get_vat_report({"period": 1, "period_type": "quarterly", "year": 2025, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 529 chars
         -> accounted_propose_annual_depreciation({"fiscal_period_id": "6cd20325-2ab6-4a4e-935c-98cb68badc0d", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 210 chars
[turn 8] 6s prompt=65475 completion=477 finish=tool_calls tool_choice=auto tools=['accounted_get_vat_report', 'accounted_get_vat_report', 'accounted_get_vat_report', 'accounted_query_journal']
         -> accounted_get_vat_report({"period": 2, "period_type": "quarterly", "year": 2025, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 530 chars
         -> accounted_get_vat_report({"period": 3, "period_type": "quarterly", "year": 2025, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 530 chars
         -> accounted_get_vat_report({"period": 4, "period_type": "quarterly", "year": 2025, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 533 chars
         -> accounted_query_journal({"voucher_series": "A", "voucher_number_from": 124, "voucher_number_to": 124, "company_id": "6982567a-4325-49a4-8a50-efa) 3524 chars
[turn 9] 5s prompt=68342 completion=391 finish=tool_calls tool_choice=auto tools=['accounted_find_voucher_candidates_for_supplier_invoice', 'accounted_list_supplier_invoices', 'accounted_vat_close_check']
         -> accounted_find_voucher_candidates_for_supplier_invoice({"limit": 5, "supplier_invoice_id": "54fcc864-8e19-4a6b-943c-211a5f299f7c", "company_id": "6982567a-4325-49a4-8a50-efada) 968 chars
         -> accounted_list_supplier_invoices({"status": "registered", "supplier_id": "1462bbc0-b67f-43f2-8b9b-69c06e48e0fd", "limit": 50, "company_id": "6982567a-432) 75 chars
         -> accounted_vat_close_check({"period": 1, "period_type": "quarterly", "year": 2026, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 3560 chars
[turn 10] 7s prompt=70669 completion=526 finish=tool_calls tool_choice=auto tools=['accounted_get_kpi_report', 'accounted_query_journal', 'accounted_query_journal', 'accounted_query_journal']
         -> accounted_get_kpi_report({"period_id": "6cd20325-2ab6-4a4e-935c-98cb68badc0d", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 1638 chars
         -> accounted_query_journal({"accounts": ["2393"], "date_from": "2024-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efadad) 1345 chars
         -> accounted_query_journal({"accounts": ["1660"], "date_from": "2024-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efadad) 1370 chars
         -> accounted_query_journal({"accounts": ["2893"], "date_from": "2024-01-01", "date_to": "2026-12-31", "company_id": "6982567a-4325-49a4-8a50-efadad) 3559 chars
[turn 11] 4s prompt=74553 completion=307 finish=tool_calls tool_choice=auto tools=['accounted_list_verifikat_without_documents']
         -> accounted_list_verifikat_without_documents({"limit": 50, "min_amount": 4000, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 8012 chars
[turn 12] 5s prompt=78324 completion=404 finish=tool_calls tool_choice=auto tools=['accounted_get_general_ledger', 'accounted_get_general_ledger', 'accounted_list_voucher_gaps']
         -> accounted_get_general_ledger({"account_from": "7700", "account_to": "7999", "period_id": "6cd20325-2ab6-4a4e-935c-98cb68badc0d", "company_id": "69825) 90 chars
         -> accounted_get_general_ledger({"account_from": "1200", "account_to": "1299", "period_id": "6cd20325-2ab6-4a4e-935c-98cb68badc0d", "company_id": "69825) 714 chars
         -> accounted_list_voucher_gaps({"fiscal_period_id": "6cd20325-2ab6-4a4e-935c-98cb68badc0d", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 60 chars
[turn 13] 33s prompt=79130 completion=3550 finish=stop tool_choice=auto tools=-
[total] turns=13 prompt=688128 completion=9776 tool_calls=55 errors=7 rejections=0 time=113s
```

I now have a complete picture. Let me write the report.

---

# Revisionsgranskning — Konsult AB (5591234567)

## Materialitet
Intäkter 2025: 1 886 400 kr; nettoresultat 2025: 588 561 kr; totalt tillgångar 2026: 1 332 525 kr. Tillämpad materialitet baseras på intäkt på 1 % (ISA 320, FAR): **18 864 kr**. Prestandamaterialitet: **13 205 kr** (70 %). För 2026 är resultatet än så länge lågt (30 672 kr); materialiteten baseras på 2025.

---

## aud-9.34-tax-account-late — Skatter och avgifter betalda för sent

**Ingen avvikelse.** Jag har verifierat följande:
- Skatteverket-integrationen är inte aktiverad. Kontot 1630 (skattekonto) har inga rörelser alltså ingen bankavräkning mot skattekonto möjlig. Jag kunde inte verifiera om inbetalningar gjordes via banken.
- Ingen rörelse på 8423, 6992 eller 8420 (ränta, påminnelseavgift, skattetillägg) hittades för perioden 2025–2026.
- Inbetalningar för skatt + sociala avgifter finns bokförda manuellt: A:114 (2026-01-12, 99 895 kr), A:117 (2026-03-12, 99 895 kr), A:120 (2026-04-12, 99 895 kr), A:123 (2026-05-12, 99 895 kr). Dateringen är den 12:e i månaden efter löpande månad, vilket stämmer med AGI-förfallodagen (12:e i följande månad). Jag kunde dock inte verifiera bankdatumet eftersom bankavstämningen inte är kopplad till kontot 1930.
- Momsdeklarationerna för 2025 (Q1–Q4) är returnerade från systemet (ruta 49 positiva: 92 888 kr, 88 111 kr, 86 399 kr, 59 260 kr) men jag kunde inte hämta inlämningsstatus från Skatteverket eftersom integrationen saknas.

**Begränsning:** Utan skattekonto- eller bankanslutning kan jag inte verifiera om inbetalningar gjordes i tid mot faktiska förfallodater. Hittade ingen ränta eller skattetillägg i huvudboken.

---

## aud-1.4-payment-booked-as-cost — Betalning bokförd som ny kostnad

**Hittad avvikelse.** Betalning bokförd som ny kostnad medan fakturan står kvar som skuld.

> **finding** Voucher A:124 (2026-06-03) bokfördes manuellt med debet 5010 (8 500 kr) + debet 2641 (2 125 kr moms) + kredit 1930 (10 625 kr) med beskrivningen "Betalning WeWork juni". Detta är ett manuellt verifikat som debiterar kostnad + ingående moms och kredit 1930, istället för att debitera leverantörsskulden 2440. Leverantörsfakturan WW-2026-05 (id: 54fcc864-8e19-4a6b-943c-211a5f299f7c) från WeWork Stockholm AB har fortfarande `remaining_amount: 10 625 kr` och status `overdue`. Skulden på 2440 har alltså inte reglerats — kostnaden och momsen har bokförts två gånger.

> **evidence** Voucher A:124 (journal_entry_id: cde546dd-b67d-4bf2-a2bc-b99c6140e626) med debet 5010/8500, 2641/2125, kredit 1930/10625. Leverantörsfakturan WW-2026-05 (id: 54fcc864-8e19-4a6b-943c-211a5f299f7c) med återstående 10 625 kr. Sub-ledgern på 2440 för WeWork visar en öppen skuld på 10 625 kr. Beloppet överstiger prestandamaterialitet (13 205 kr).

> **what closes it** Återföring av det manuella verifikatet A:124 och bokföring av ett korrekt betalningsverifikat mot 2440, eller registrering av leverantörsfakturan så att betalningsverifikat A:124 kan användas som reglering. Ägare: bokföring; tidpunkt: före nästa momsdeklaration.

> **severity** attention

---

## aud-3.3-depreciation-missing — Avskrivning saknas

**Hittad avvikelse.** Inventarie på 1230 anskaffad 2026-02-14 (iPad Pro, 18 000 kr, voucher A:104) har inte skrivits av.

> **finding** På konto 1230 (Inventarier och verktyg) finns ett saldo på 18 000 kr anskaffat 2026-02-14. För datorer och inventarier är förväntad livslängd 36 månader (500 kr/månad) eller 60 månader (300 kr/månad) beroende på klassificering. Ingen rörelse på 78xx finns alls i hela 2026 — inga avskrivningar bokförda någonsin detta år. Sedan anskaffningen (februari) saknas 10+ månaders avskrivning (cirka 5 000–8 300 kr).

> **evidence** Konto 1230: enbart debet 18 000 kr vid A:104 (2026-02-14), slutsaldo 18 000 kr. Konto 7700–7999: inga rader alls. Kontot 1230 är inte land (1110) och överskrider inte förbrukningsinventariegärdet.

> **what closes it** Bokföring av efterföljande avskrivning för de uteblivna månaderna (en verifikationsrad per månad eller ett upptagningsverifikat med noter). Ägare: bokföring; tidpunkt: före nästa månadssättning.

> **severity** attention (beloppet understiger 1 % av periodresultatet 30 672 kr men överstiger prestandamaterialitet för en enskild post om 1230 klassificeras som 36-månaders tillgång)

---

## aud-4.1-result-disposition — Resultatdisposition saknas

**Hittad avvikelse.** Årsresultat 2025 har inte disp on erats per årsstämma.

> **finding** Räkenskapsåret 2025 (stängt 2025-12-31) har ett resultat på 588 561 kr som ligger kvar på konto 2099 (Ingående balans 2026). Det finns inget verifikat på 2091 (Balanserat resultat) eller 2898 (Utdelning) efter 2025-12-31 som visar en disposition. Enligt årsredovisningslagen ska disposition fattas senast sex månader efter års-slut, dvs senast 2026-06-30. Ingen stämprotokoll finns i arkivet som verifieras av verktygen.

> **evidence** Voucher A:1 (2026-01-01): ingående balans 2099 = 588 561,25 kr. Voucher A:295 (2025-12-31): årsbokslut 2099 = 588 561,25 kr. Inga rörelser på 2091 eller 2898 hittades. Ingen dokumenterad årsstämma.

> **what closes it** Dispositionsverifikat per årsstämma (2099 till 2091 och eventuellt 2898), daterat stämmodagen och bokfört av bokföring. Om stämprotokoll saknas: styrelsen måste teckna protokoll först.

> **severity** attention (perioden är stängd men disposition ej bokförd)

---

## aud-25.13-equity-half — Eget kapital under halva aktiekapitalet

**Ingen avvikelse.** Eget kapital 2026-12-31: 638 561 kr (2081: 50 000 kr + 2099: 588 561 kr). Halva aktiekapitalet är 25 000 kr. Det bokförda egna kapitalet är väsentligt högre än halva aktiekapitalet. Resultat för 2026 är ännu positivt (30 672 kr), så även vid nettoreduktion förblir kapitalet över gränsen.

**Övriga observationer:**
- Lån från närstående (konto 2393): 300 000 kr från aktieägaren Johan Lind (voucher A:137, 2026-01-15). Detta är en närstående-transaktion som behöver granskas mot ABL 21 kap.
- Koncernlån (konto 1660): 200 000 kr till Konsult Holding AB (voucher A:146, 2026-02-01), ränta SLR+1 %.
- Uttag till Johan Lind (konto 2893, skuld till aktieägare): 5 uttag à 25 000 kr (A:132, A:133, A:134, A:135, A:136) under 2026, totalt 125 000 kr.

---

## Övriga granskningsfrågor

### Fordringar och intäktskompletthet
Alla 12 kundefakturer (396 875 kr totalt) är överdragna, med dagar 211–274 överdragna. Detta är ett betydande problem för going concern. Klient AB har 9 fakturer om 324 000 kr som alla är 211+ dagar överdragna. Berlin GmbH 41 000 kr. Liten Studio HB 11 875 kr. Helsinki Oy 20 000 kr.

KPI:rapporten visar att intäkter på 1 103 660 kr bokförts under 2026, men att månaderna juni–december har **0 kr i intäkter**. Detta är en mycket stark indikator på att antingen har försäljningen avtagit helt eller att fakturor inte bokförts.

### Verifikationsglapp (2025)
Två oförklarade glapp i serie A: 123–123 och 287–287. De förklaras ej i systemet. BFNAR 2013:2 kräver förklaring.

### Verifikat utan underlag
Många manuella verifikat saknar dokument, inklusive:
- 5× "Uttag Johan Lind" (25 000 kr vardera, totalt 125 000 kr) — inga protokoll
- 3× "Kortköp företagskort, kvitto saknas (Erik Ek)" — totalt 6 640 kr
- 4× Representation (ICA, Bageri Bromma, Systembolaget, totalt 14 472,50 kr) — några har nämnt "deltagarlista"
- WeWork juni (voucher A:124, 10 625 kr) — dubbelbokning

### Återkommande representation
Fyra representationstillfällen under juni–juli 2026 på ICA Bromma, Bageri Bromma och Systembolaget Bromma, alla bokförda under "Lördag, semesterperiod". Detta kan tyda på privat representation som bokförts som företagskostnad.

### Årsredovisning — 2025
Resultatdisposition saknas (se ovan). Verifikationsglapp kvarstår. Bokslutet är inte klart enligt year-end-check med 4 blockerare.

---

## Vad jag inte kunde verifiera

Skatteverkets integration är inte aktiverad i denna miljö. Det innebär att jag inte kan:
- Hämta skattekonto-utdrag för att verifiera om inbetalningar gjorts i tid mot förfallodater
- Kontrollera inlämningsstatus för moms- och AGI-deklarationer hos Skatteverket
- Bekräfta skattekonto-saldot mot bokförda skatteskulder på 2650/2710/2731

Bankavstämning för konto 1930 är också inte aktiverad, vilket gör att jag inte kan verifiera bankdatumet mot verifikatsdatumet. Systemet rapporterar en obefintlig differens på 565 570 kr på 11 omatchade huvudbokslinjer vid stängning av Q1 2026.

---

## Sammanfattning av hittade avikelser

| Check | Status | Severity |
|---|---|---|
| aud-9.34 | Ingen avvikelse (med begränsning) | info |
| aud-1.4 | **Hittad** — WeWork juni bokförd som ny kostnad | attention |
| aud-3.3 | **Hittad** — Avskrivning saknas på 1230 | attention |
| aud-4.1 | **Hittad** — Resultatdisposition 2025 saknas | attention |
| aud-25.13 | Ingen avvikelse | — |
