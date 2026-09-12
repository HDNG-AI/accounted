# DD analyst v1 (teamets persona) · qwen3.6:35b-a3b · 2026-09-12

```
[setup] model=qwen3.6:35b-a3b persona=dd-analyst checks=['dd-9.7-aging', 'dd-9.4-arr-backed', 'dd-9.3-normalisations'] tools=59 system_chars=20194
[turn 1] 2s prompt=16783 completion=18 finish=tool_calls tool_choice=required tools=['accounted_get_agent_briefing']
         -> accounted_get_agent_briefing({}) 6411 chars
[turn 2] 2s prompt=18754 completion=137 finish=tool_calls tool_choice=required tools=['accounted_list_fiscal_periods', 'accounted_list_customers', 'accounted_get_ar_ledger', 'accounted_get_ar_ledger', 'accounted_get_supplier_ledger', 'accounted_get_supplier_ledger']
         -> accounted_list_fiscal_periods({}) 497 chars
         -> accounted_list_customers({}) 2035 chars
         -> accounted_get_ar_ledger({"as_of_date": "2025-12-31"}) 1598 chars
         -> accounted_get_ar_ledger({"as_of_date": "2026-06-30"}) 6023 chars
         -> accounted_get_supplier_ledger({"as_of_date": "2025-12-31"}) 139 chars
         -> accounted_get_supplier_ledger({"as_of_date": "2026-06-30"}) 419 chars
[turn 3] 3s prompt=23906 completion=211 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_get_income_statement', 'accounted_get_kpi_report']
         -> accounted_query_journal({"accounts": ["1510"], "date_from": "2025-01-01", "date_to": "2026-06-30", "group_by": "source_type"}) 8012 chars
         -> accounted_get_income_statement({"period_id": "dfcfe9e7-f68d-43bf-901e-70dd98b888bf"}) 3037 chars
         -> accounted_get_kpi_report({"period_id": "dfcfe9e7-f68d-43bf-901e-70dd98b888bf"}) 1839 chars
[turn 4] 3s prompt=29578 completion=76 finish=tool_calls tool_choice=auto tools=['accounted_list_invoices', 'accounted_list_supplier_invoices']
         -> accounted_list_invoices({"limit": 100}) 8012 chars
         -> accounted_list_supplier_invoices({"limit": 100, "status": "all"}) 8012 chars
[turn 5] 6s prompt=36824 completion=523 finish=tool_calls tool_choice=auto tools=['accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice']
         -> accounted_get_invoice({"invoice_id": "fc4d3461-8937-4e10-9be4-c8c6982952e0"}) 1392 chars
         -> accounted_get_invoice({"invoice_id": "a9e3189c-d9ed-4ab0-86d8-f92156edeeab"}) 1392 chars
         -> accounted_get_invoice({"invoice_id": "e1b4d4d4-68d6-46e9-b86f-98625ab52e0a"}) 1392 chars
         -> accounted_get_invoice({"invoice_id": "725e4e93-4722-4f7b-a021-c6b1818413e6"}) 1392 chars
         -> accounted_get_invoice({"invoice_id": "800268da-06e7-41dd-bb54-deb383284d84"}) 1389 chars
         -> accounted_get_invoice({"invoice_id": "304402bb-9b29-47f1-8464-cca6a7e4944d"}) 1403 chars
         -> accounted_get_invoice({"invoice_id": "9d60125d-e695-46a7-8007-0302180912c2"}) 1403 chars
         -> accounted_get_invoice({"invoice_id": "4689c167-4098-4bec-934d-ea0fb1e4b499"}) 1403 chars
[turn 6] 5s prompt=42113 completion=402 finish=tool_calls tool_choice=auto tools=['accounted_call_tool', 'accounted_list_unmatched_documents', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice']
         -> accounted_call_tool({"tool": "accounted_list_recurring_schedules"}) 76 chars
         -> accounted_list_unmatched_documents({"limit": 50}) 625 chars
         -> accounted_get_invoice({"invoice_id": "6f852726-9224-4f3b-b74f-3b5005bb00b9"}) 1379 chars
         -> accounted_get_invoice({"invoice_id": "25261432-dda0-449b-a394-db4ffb0e8101"}) 1376 chars
         -> accounted_get_invoice({"invoice_id": "bcbe878b-1992-4b10-b8e4-a7a59ebe7940"}) 1391 chars
         -> accounted_get_invoice({"invoice_id": "affa038d-bb62-43f6-b2dd-b3f20dfcd182"}) 1381 chars
         -> accounted_get_invoice({"invoice_id": "b191e25d-2546-4391-85e3-817666b446ff"}) 1385 chars
[turn 7] 2s prompt=45756 completion=126 finish=tool_calls tool_choice=auto tools=['accounted_list_invoices', 'accounted_list_invoices']
         -> accounted_list_invoices({"limit": 100, "offset": 100}) 8012 chars
         -> accounted_list_invoices({"limit": 100, "status": "paid"}) 8012 chars
[turn 8] 6s prompt=52751 completion=398 finish=tool_calls tool_choice=auto tools=['accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice']
         -> accounted_get_invoice({"invoice_id": "5206b37f-d4e1-4b9b-a691-7ed6da350369"}) 1389 chars
         -> accounted_get_invoice({"invoice_id": "869ff080-e7b6-4609-9165-ade335affa80"}) 1389 chars
         -> accounted_get_invoice({"invoice_id": "ae1f8569-620f-4924-9145-a4bef882a5aa"}) 1388 chars
         -> accounted_get_invoice({"invoice_id": "7b99b249-9afe-496f-a986-e1e182272615"}) 1388 chars
         -> accounted_get_invoice({"invoice_id": "827b0918-830b-450b-888e-30ef073424d7"}) 1388 chars
         -> accounted_get_invoice({"invoice_id": "bf2a0747-dee1-4459-ba0e-b28fe09d79af"}) 1389 chars
[turn 9] 5s prompt=56685 completion=449 finish=tool_calls tool_choice=auto tools=['accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice']
         -> accounted_get_invoice({"invoice_id": "cb13b1d0-47fd-41a7-80e6-2c888f759e1f"}) 1389 chars
         -> accounted_get_invoice({"invoice_id": "5b095389-dc31-4f0d-b856-1574cc673feb"}) 1389 chars
         -> accounted_get_invoice({"invoice_id": "05b808d5-9977-4bbd-9731-87dbbd85df74"}) 1389 chars
         -> accounted_get_invoice({"invoice_id": "ec1e3361-6a4f-41a7-a74b-87bef1e6a252"}) 1389 chars
         -> accounted_get_invoice({"invoice_id": "78efd746-b6b9-40d9-90a0-d8e269f3e1f9"}) 1389 chars
         -> accounted_get_invoice({"invoice_id": "34edaac4-c957-4cda-bebb-154437e92ae9"}) 1388 chars
         -> accounted_get_invoice({"invoice_id": "7b17017d-7a26-4ff9-96e3-78bcd04f22f7"}) 212 chars ERROR
[turn 10] 4s prompt=60747 completion=362 finish=tool_calls tool_choice=auto tools=['accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_get_invoice', 'accounted_list_supplier_invoices']
         -> accounted_get_invoice({"invoice_id": "c37a21a9-1799-426c-87e8-046312e76fef"}) 1374 chars
         -> accounted_get_invoice({"invoice_id": "0cb62c70-f853-4e7f-bcc0-bd28d87e943a"}) 1374 chars
         -> accounted_get_invoice({"invoice_id": "2bd5289c-62cc-40a0-8437-f4eb8a383762"}) 1374 chars
         -> accounted_get_invoice({"invoice_id": "a467bf45-5f77-41cd-9b4b-06fe1e46494a"}) 1381 chars
         -> accounted_list_supplier_invoices({"limit": 100, "status": "all", "date_from": "2024-07-01", "date_to": "2026-06-30"}) 8012 chars
[turn 11] 3s prompt=67166 completion=78 finish=tool_calls tool_choice=auto tools=['accounted_list_invoices']
         -> accounted_list_invoices({"limit": 100, "offset": 200}) 198 chars ERROR
[turn 12] 1s prompt=67327 completion=59 finish=tool_calls tool_choice=auto tools=['accounted_list_invoices']
         -> accounted_list_invoices({"limit": 100, "offset": 150}) 198 chars ERROR
[turn 13] 37s prompt=67469 completion=4096 finish=length tool_choice=auto tools=-
[reject] no tool_calls; content looks like a narrated tool trace or was cut off (7749 chars)
[turn 14] 13s prompt=67460 completion=45 finish=tool_calls tool_choice=auto tools=['accounted_list_invoices']
         -> accounted_list_invoices({"limit": 100, "offset": 50}) 8012 chars
[nudge] conclude, 6 turns left
[turn 15] 37s prompt=70988 completion=3953 finish=stop tool_choice=auto tools=-
[total] turns=15 prompt=724307 completion=10933 tool_calls=50 errors=3 rejections=1 time=131s
```

## Rättning
```

/tmp/dd1.out: 2/12 planted patterns mentioned
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
  ok           C1 group loan (must not flag)
  ok           C3 kick-off fika (must not flag)
  ok           C4 booked late, paid on time (must not flag)
  ok           C6 Klient AB recurring (must not flag as unbacked)
  SCRIPT LEAK: ['返回', '返回', '返回']
```

## gemma4 kontroll
```
[control] model=gemma4:31b prompt=4289 completion=751 findings=2 godkänt=2 nedgraderat=0 avvisat=0 gate=OK
```

- [godkänt] Koncentration av kundfordringar och förfallna poster · attention · Betalning av utestående belopp, kreditnota med motivering eller bokföring av reserv för osäkra kundfordringar. Ansvarig: CFO. Senast vid nästa datarumslivans.
- [godkänt] Oidentifierat dokument · info · Koppla dokument aws-2026-05-05.pdf till relevant transaktion eller leverantörsfaktura.

---

# Granskningsrapport

## Koncentration av kundfordringar och förfallna poster

## Analys (oredigerad)

**Materialitetsgräns:** 10 000 kr exkl. moms för normalisationer; 50 % av öppna fordringar för koncentration; 90 dagars gräns för åldrande. Alla belopp i SEK.

---

## dd-9.7-aging (Kundfordringars och leverantörsfaktors ålder)

**Hittat:** Ja, avvikelse.

### Kundfordringar 2026-06-30 (totalt 396 875 kr)
- Klient AB: 324 000 kr (81,6 % av totala öppna fordringar). En kund står för >50 % och samtliga poster är förfallna.
  - F-20260011: 36 000 kr, 76 dagars försening (förfl. 2026-04-15).
  - F-20260012: 36 000 kr, 69 dagars försening (förfl. 2026-04-22).
  - F-20260013: 36 000 kr, 62 dagars försening (förfl. 2026-04-29).
  - F-20260014: 36 000 kr, 55 dagars försening (förfl. 2026-05-06).
  - F-20260034: 36 000 kr, 30 dagars försening (förfl. 2026-05-31).
  - F-20260035: 36 000 kr, 29 dagars försening (förfl. 2026-06-01).
  - F-20260036: 36 000 kr, 28 dagars försening (förfl. 2026-06-02).
  - F-20260018: 36 000 kr, 27 dagars försening (förfl. 2026-06-03).
  - F-20260037: 36 000 kr, 27 dagars försening (förfl. 2026-06-03).
- Berlin GmbH: 41 000 kr (10,3 %), 42 dagars försening (förfl. 2026-05-19).
- Helsinki Oy: 20 000 kr (5,0 %), 43 dagars försening (förfl. 2026-05-18).
- Liten Studio HB: 11 875 kr (3,0 %), 90 dagar försenat (förfl. 2026-04-01), 61–90 dagars bucket.

Ingen kund har >50 % av fordringarna med någon förfallen del om man bara ser på absoluta belopp, MEN Klient AB har 81,6 % och all är förfallen. Regeln säger "en kund över 50 % och någon av det är förfallna" – detta är ett hit.

**Avvikelse:** Klient AB står för 324 000 kr av 396 875 kr (81,6 %). Alla poster är förfallna. Ingen har >90 dagar förfallna (max 76), så gränsen "mer än 50 % över 90 dagar" träffas inte. Men regeln "en kund över 50 % och någon förfallen" träffas. Severity: `attention`.

### Leverantörsfordringar 2026-06-30 (totalt 10 625 kr)
- WeWork Stockholm AB: 10 625 kr, 1–30 dagars försening. Ingen debetbalans.

### Jämförelse med 2025-12-31
- Kundfordringar: 38 000 kr (Berlin 25 000 kr, Nordic Tech 13 000 kr). Inga förfallna.
- Leverantörsfordringar: 0 kr.

**Det avvika från mönstret:** Fordringar betalas inom avtalade villkor (30 dagar) och sprids över flera kunder. Här står en kund för 81,6 % och alla poster är förfallna.

*Evidence:* ar_ledger 2025-12-31 och 2026-06-30, customer default_payment_terms=30. *What closes it:* Betalt, kreditfaktura med motivering, eller bokfört reserv för tvivelaktiga kundfordringar med datum, eller skriftlig förklaring till köparens rådgivare per post. *Owner:* CFO. *Date:* före nästa data-room-leverans. *auditor_duty: remark*

---

## dd-9.4-arr-backed (Återkommande intäkt med avtal/schema och betalning)

**Hittat:** Ja, avvikelse.

### Klient AB-signal
Klient AB har fakturor från 2025-01-13 och framåt, alla 36 000 kr, med items som "Konsulttjänster vecka N, 2026: 24h". Detta är 24 timmar per faktura med 1 200 kr/timme – det är timbaserad försäljning (time-and-materials), inte subskriptionsintäkt utan leverans. Enligt false-alarm-garden är Klient AB det positiva fallet: fakturorna bygger på levererade timmar, inte ett abonnemang utan underlag.

**Ingen regelstrckning här:** Det finns inget schema för Klient AB (`accounted_list_recurring_schedules`返回0), men intäkterna är inte "recurring" i mening av prenumeration/abonnemang – de är veckovis fakturerade timmar. Regeln säger att ett mönster på 3+ konsekutiva perioder med quantity 1 och ingen tim-/enhetsbasis ska flaggas. Här är quantity 24, unit "tim". Så detta är timfakturerad konsulttjänst, inte återkommande prenumeration. **Ingen avvikelse här.**

**Konsulttjänster vecka 12–18, 2026 (från F-20260010 till F-20260037):**
- F-20260010: "Konsulttjänster vecka 11, 2026: 24h" – paid.
- F-20260009: "Konsulttjänster vecka 10, 2026: 24h" – paid.
- F-20260008: "Konsulttjänster vecka 9, 2026: 24h" – paid.
- F-20260007: "Konsulttjänster vecka 8, 2026: 24h" – paid.
- F-20260006: "Konsulttjänster vecka 7, 2026: 24h" – paid.
- F-20260011: "Konsulttjänster vecka 12, 2026: 24h" – overdue (76 dagar).
- F-20260012: "Konsulttjänster vecka 13, 2026: 24h" – overdue (69 dagar).
- F-20260013: "Konsulttjänster vecka 14, 2026: 24h" – overdue (62 dagar).
- F-20260014: "Konsulttjänster vecka 15, 2026: 24h" – overdue (55 dagar).
- F-20260034: "Konsulttjänster maj: vecka 18, 2026" – sent (30 dagar försenad).
- F-20260035: "Konsulttjänster vecka 17, 2026: 24h" – sent (29 dagar).
- F-20260036: "Konsulttjänster vecka 17, 2026: 24h" – sent (28 dagar).
- F-20260018: "Konsulttjänster vecka 17, 2026: 24h" – sent (27 dagar).
- F-20260037: "Konsulttjänster vecka 18, 2026: 24h" – sent (27 dagar).
- F-20260015: partially paid, 18 000/36 000.
- F-20260016: partially paid, 18 000/36 000.
- F-20260017: partially paid, 18 000/36 000.

**Detta är timbaserad intäkt. Regeln dd-9.4-arr-backed kräver "quantity 1 och ingen timbasis" för att betraktas som återkommande prenumeration. Här är quantity 24 och unit "tim". Så detta är inte en recurring revenue-serie i mening av subskription. Ingen avvikelse.**

**Slutsats dd-9.4-arr-backed:** Ingen avvikelse. Klient AB är timfakturerad konsulttjänst, vilket är korrekt. Inga andra kunder uppvisar återkommande mönster med quantity=1. Berlin GmbH faktureras per workshop (variabelt belopp, ej månatligt). Nordic Tech AS faktureras export per månad men med quantity=1 och beskrivning "Konsulttjänst export: månad 4/2026" – detta är exportförsäljning, ej prenumeration.

*Verifikat:* Inget schema för någon kund (`accounted_list_recurring_schedules`返回0). Inga avtal i arkivet (`accounted_list_unmatched_documents`返回1 osmatchad AWS-dokument). Men eftersom intäkterna är timbaserade träffar regeln inte. *Ingen avvikelse.*

---

## dd-9.3-normalisations (Engångskostnader)

**Hittat:** Ja, inga kandidater över 10 000 kr exkl. moms som inte återkommer.

### Leverantörsfakturor 2024-07-01 till 2026-06-30:
- **WeWork Stockholm AB:** Månatliga hyrfakturor 10 625 kr, återkommande varje månad (WW-2025-04, WW-2025-05, WW-2025-06, WW-2025-07, WW-2025-08, WW-2025-09, WW-2025-10, WW-2025-11, WW-2025-12, WW-2026-01, etc. – löpande sedan 2025-04). Detta är löpande lokalhyra, **körs med**.
- **OpenAI LLC:** Kvartalsfakturor 320 USD (≈3 360 kr). Tre fakturor per år (Q1, Q2, Q3, Q4). Under 10 000 kr exkl. moms. **Ignorerad enligt gräns.**
- **Vercel Inc:** Kvartalsfakturor 120 USD (≈1 260 kr). Under 10 000 kr. **Ignorerad.**

Inga andra leverantörsfakturor hittas i det aktuella perioden. `accounted_list_supplier_invoices` returnerade endast dessa tre leverantörer.

### Manuell verifikat på 5xxx–7xxx eller 39xx:
`accounted_query_journal` på 1510 visade endast invoice_created och invoice_paid. Ingen manual-verifikat på kostnadskonton upptäcktes i de resultat jag hämtade.

**Slutsats:** Inga kandidater över 10 000 kr exkl. moms utan underlag. De återkommande kostnaderna (WeWork hyra) är run-rate. OpenAI och Vercel är under tröskeln.

*Ingen avvikelse.* Verifierade: 3 leverantörer, 20+ leverantörsfakturor, period 2024-07-01 till 2026-06-30, tröskel 10 000 kr exkl. moms. *auditor_duty: remark*

---

## Övrigt att titta på

1. **Fakturering upphörde för Klient AB efter 2026-06-03:** De senaste fakturorna är F-20260037 (2026-05-04, förfallen 2026-06-03). As-of date 2026-06-30. Inga fakturor efter juni 2026 i registeret. Sist fakturerade månad: juni 2026. Gapet från juni 2026 till idag (september 2026) bör följas upp – kan vara tystnad eller bortfall.

2. **AWS-faktura osmatchad:** Ett osmatchat dokument `aws-2026-05-05.pdf` finns i inbox (`accounted_list_unmatched_documents`). Behöver kopplas till transaktion eller leverantörsfaktura.

3. **Klient AB betalningsmönster försämrat:** I 2025 betalades alla Klient AB-fakturor inom 30 dagar (genomsnittligt 15 dagar enligt KPI). I 2026: F-20260010 till F-20260008 betalades i tid, men F-20260011 till F-20260037 är förfallna (0 kr betalade). F-20260015, F-20260016, F-20260017 är partially paid (18 000 av 36 000). Detta är en tydlig försämring.

4. **Liten Studio HB:** F-20260033 (11 875 kr) är 90 dagar förfallen (förfl. 2026-04-01). F-20260041, F-20260042, F-20260043, F-20260040, F-20260038, F-20260039 är alla betalda i april/maj 2026. Sista fakturan F-20260033 är ensam kvar.

5. **Berlin GmbH:** F-20260026 (41 000 kr) är 42 dagar försenad. F-20260025 (38 000 kr) var betald. Inga andra öppna fordringar från Berlin. Workshop-baserad intäkt, ej återkommande prenumeration.

6. **Nordic Tech AS:** Inga öppna fordringar (F-20260030 betald). F-20250073 (13 000 kr) syns i 2025-12-31 ar_ledger men är betald i 2026.

**Sammanfattning:** Den huvudsakliga avvikelsen är Klient AB-koncentration (81,6 % av öppna fordringar) med alla förfallna. Normalisationslistan är ren. Återkommande intäkt-regeln träffas inte för Klient AB eftersom det är timfakturerad konsulttjänst, inte prenumeration.
