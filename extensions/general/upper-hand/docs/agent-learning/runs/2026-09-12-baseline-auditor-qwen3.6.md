# Baslinje på rent demobolag: auditor · qwen3.6:35b-a3b · natt 2026-09-12

Kommando: `python3 scripts/persona-smoke.py auditor 20` efter reset-demo.sh. Staik hängde periodvis: 2 timmar väggklocka per körning.

## Turer
```
[setup] model=qwen3.6:35b-a3b persona=auditor checks=['aud-1.4-payment-booked-as-cost', 'aud-3.3-depreciation-missing', 'aud-4.1-result-disposition'] tools=59 system_chars=10719
[turn 1] 5s prompt=14718 completion=78 finish=tool_calls tool_choice=required tools=['accounted_get_agent_briefing', 'accounted_list_fiscal_periods', 'accounted_list_uncategorized_transactions', 'accounted_query_journal']
         -> accounted_get_agent_briefing({}) 6411 chars
         -> accounted_list_fiscal_periods({}) 497 chars
         -> accounted_list_uncategorized_transactions({"limit": 50}) 3507 chars
         -> accounted_query_journal({"source_type": "manual", "limit": 500}) 8012 chars
[turn 2] 6s prompt=21949 completion=372 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_list_supplier_invoices', 'accounted_get_balance_sheet', 'accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"accounts": ["2641", "1930"], "source_type": "manual", "limit": 500}) 8012 chars
         -> accounted_list_supplier_invoices({"status": "all", "limit": 100}) 8012 chars
         -> accounted_get_balance_sheet({}) 3461 chars
         -> accounted_query_journal({"accounts": ["1200", "1210", "1240", "1250", "1260", "1270", "1280", "1290"], "limit": 500}) 849 chars
         -> accounted_query_journal({"accounts": ["2099"], "limit": 500}) 1895 chars
[retry 1] timeout: The read operation timed out
[turn 3] 3982s prompt=31780 completion=550 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"accounts": ["4000", "4100", "4200", "4300", "4400", "4500", "4600", "4700", "4800", "4900"], "source_type": "manual", ) 881 chars
         -> accounted_query_journal({"accounts": ["5000", "5100", "5200", "5300", "5400", "5420", "5430", "5440", "5450", "5460", "5470", "5480", "5490", "5) 8012 chars
[turn 4] 8s prompt=36034 completion=581 finish=tool_calls tool_choice=auto tools=['accounted_list_supplier_invoices', 'accounted_query_journal']
         -> accounted_list_supplier_invoices({"status": "all", "limit": 100}) 8012 chars
         -> accounted_query_journal({"source_type": "manual", "account_from": "4000", "account_to": "7999", "limit": 500}) 8012 chars
[turn 5] 6s prompt=43681 completion=283 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_get_supplier_ledger']
         -> accounted_query_journal({"source_type": "manual", "date_from": "2026-01-01", "limit": 500, "group_by": "voucher_series"}) 8012 chars
         -> accounted_get_supplier_ledger({}) 419 chars
[turn 6] 7s prompt=47565 completion=379 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_get_supplier_ledger']
         -> accounted_query_journal({"text": "WeWork", "limit": 200}) 8012 chars
         -> accounted_get_supplier_ledger({"as_of_date": "2026-08-15"}) 419 chars
[retry 1] timeout: The read operation timed out
[turn 7] 1915s prompt=51472 completion=271 finish=tool_calls tool_choice=auto tools=['accounted_list_supplier_invoices']
         -> accounted_list_supplier_invoices({"supplier_name": "WeWork", "status": "all", "limit": 50}) 7030 chars
[turn 8] 10s prompt=55014 completion=656 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"accounts": ["1230"], "limit": 100}) 1368 chars
         -> accounted_query_journal({"accounts": ["7800", "7810", "7820", "7830", "7840", "7850", "7860", "7870", "7880", "7890", "7700", "7710", "7720", "7) 1165 chars
[turn 9] 9s prompt=56721 completion=417 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_list_inbox_items']
         -> accounted_query_journal({"accounts": ["2091", "2098", "2099"], "limit": 50}) 1923 chars
         -> accounted_list_inbox_items({"unprocessed_only": true, "limit": 20}) 616 chars
[turn 10] 5s prompt=58168 completion=397 finish=tool_calls tool_choice=auto tools=['accounted_query_journal']
         -> accounted_query_journal({"accounts": ["2641"], "source_type": "manual", "date_from": "2025-01-01", "limit": 200}) 8012 chars
[retry 1] timeout: The read operation timed out
[turn 11] 1034s prompt=61957 completion=449 finish=tool_calls tool_choice=auto tools=['accounted_query_journal']
         -> accounted_query_journal({"text": "WeWork", "source_type": "manual", "limit": 100}) 2403 chars
[turn 12] 8s prompt=63367 completion=587 finish=tool_calls tool_choice=auto tools=['accounted_vat_declaration_status']
         -> accounted_vat_declaration_status({"period": 2, "period_type": "quarterly", "year": 2026}) 246 chars ERROR
[turn 13] 4s prompt=64050 completion=159 finish=tool_calls tool_choice=auto tools=['accounted_year_end_readiness']
         -> accounted_year_end_readiness({"fiscal_period_id": "dfcfe9e7-f68d-43bf-901e-70dd98b888bf"}) 1121 chars
[retry 1] timeout: The read operation timed out
[turn 14] 228s prompt=64653 completion=2856 finish=stop tool_choice=auto tools=-
[total] turns=14 prompt=671129 completion=8035 tool_calls=26 errors=1 rejections=0 time=7239s
```

## Modellens svar (oredigerat)



# revisionsgranskning — Konsult AB (org.nr 5591234567)

Grunad: 2026-09-12. Kontroller utförda i ordning enligt check-listan.

---

## aud-1.4-payment-booked-as-cost

**Hittad avvikelse:** En manuellt bokförd betalning till WeWork har debiterats som ny kostnad + moms istället för att regleras mot leverantörsskuld (2440).

**Finding:**  
Voucher A:124 (2026-06-03, beskrivning "Betalning WeWork juni", journal_entry_id cde546dd-b67d-4bf2-a2bc-b99c6140e626) bokfördes med:
- debet 5010 "Hyra coworking" 8 500 kr
- debet 2641 "Ingående moms" 2 125 kr
- kredit 1930 "Företagskonto" 10 625 kr

Leverantörsfakturan WW-2026-05 (id 54fcc864-8e19-4a6b-943c-211a5f299f7c) från WeWork Stockholm AB, utfärdad 2026-05-01, med samma belopp 10 625 kr, är fortfarande öppen (status "overdue", remaining_amount 10 625 kr, leverantörsskulder-åldrande visar 10 625 kr i bucket 61–90 dagar vid 2026-08-15).

Kostnaden på 5010 och momsen på 2641 är därmed dubblerade: kostnaden bokfördes två gånger (en gång via korrekt leverantörsfakturabokföring i A:87, en gång manuellt i A:124), momsen avdrogs två gånger, och skulden på 2440 står kvar opåverkad.

**Evidence:**  
- Voucher A:124 (3 rader): debit 5010=8500, debit 2641=2125, credit 1930=10625
- Leverantörsfaktura WW-2026-05 (id 54fcc864-8e19-4a6b-943c-211a5f299f7c): total 10625, status overdue, remaining 10625
- Voucher A:87 (2026-05-01): korrekt fakturabokföring med 5010 debet 8500, 2641 debet 2725, 2440 kredit 11225
- Leverantörsreskontra WeWork: 10 625 kr öppen vid 2026-08-15 (31–60 dagar fördröjd)

**What closes it:** Återföring av voucher A:124 och korrekt betalningsbokföring (debit 2440, credit 1930) för fakturan WW-2026-05. Bokens ägare: redovisningsansvarig. Deadline: före nästa momsdeklaration för att undvika blockerande moms.

**Severity:** attention (blockerande om momsperioden Q2 2026 redan är deklarerad; Skatteverket-integrationen är inte aktiverad så deklarationsstatus kan inte verifieras remote.)

---

## aud-3.3-depreciation-missing

**Hittad avvikelse:** Inventarium på 1230 med balans 18 000 kr har inte skrivits av alls sedan anskaffningen 2026-02-14.

**Finding:**  
- Kontot 1230 "Inventarier och verktyg" har en debetbalans på 18 000 kr, bokförd via faktura APP-2026-001 från Apple Sweden AB 2026-02-14 (iPad Pro 13").
- Inga poster på något avskrivningskonto (77xx–79xx) hittas i journalen sedan 2025-01-01.
- Enligt swedish-asset-accounting är normal användningstid för förbrukningsinventarier (12xx) 36 månader, med avskrivning från månaden efter anskaffning. Detta ger 500 kr/månad (18 000 / 36).
- Från mars 2026 till och med juli 2026 (5 månader) saknas avskrivning för totalt 2 500 kr.
- 2 500 kr utgör ca 8,1 % av det bokförda resultatet för perioden 2026 (30 671,96 kr), vilket överskrider tröskeln för blockerande (>1 % av periodresultatet eller period som stängs).

**Evidence:**  
- Voucher A:104 (2026-02-14): debit 1230 18 000 (iPad Pro 13", Apple Sweden AB)
- Inga journalrader på kontona 7700–7990 för perioden 2025-01-01–2026-09-12
- Balansräkning 2026: 1230 = 18 000
- Beräknad avskrivning: 500 kr/mån × 5 mån = 2 500 kr underavskrivet

**What closes it:** Bokförings av avskrivning för mars–juli 2026 (5 × 500 = 2 500 kr), preferably som en återkommande månadsroutine. Ägare: redovisningsansvarig. Datum: innan nästa månadsavslut.

**Severity:** blockerande (>1 % av periodresultat och tillgångsbalans oförändrad sedan anskaffning).

---

## aud-4.1-result-disposition

**Hittad avvikelse:** Resultatet för räkenskapsåret 2025 har inte dispositionerats.

**Finding:**  
- Räkenskapsåret 2025 stängdes 2025-12-31 (period status "closed").
- Voucher A:295 (2025-12-31, årsbokslut) försde 2025 års resultat på 588 561,25 kr till konto 2099 "Årets resultat".
- Ingen verifikat finns som flyttar beloppet från 2099 till 2091 "Balanserat resultat" eller till 2898 "Utdelning".
- Mer än 6 månader har passerat efter årsskiftet (nu september 2026).
- Kontot 2091 har noll poster alls i hela journalen. Kontot 2098 har noll poster.
- 588 561,25 kr ligger kvar på 2099, vilket innebär att årsredovisningen för 2025 inte är fastställd med disposition och det är oklart om styrelsen har hållit årsstämma och fattat beslut om resultatdisposition.

**Evidence:**  
- Fiskal period 2025 (id dfcfe9e7-f68d-43bf-901e-70dd98b888bf): period_end 2025-12-31, status "closed"
- Voucher A:295 (2025-12-31): credit 2099 588 561,25 (resultat 2025)
- Voucher A:1 (2026-01-01): credit 2099 588 561,25 (ingående balans)
- Inga rader på 2091 eller 2898 i hela journalen
- Återstående balans 2099 vid 2026-08-15: 588 561,25 kr (hela 2025-resultatet)

**What closes it:** Bokför dispositionverifikat enligt årsstämmobeslut (2099 → 2091 och 2898 om utdelning), daterat årsstämmodagen. Om inga protokoll finns i arkivet: styrelsen ska signera och leverera årsstämmoprotokoll först. Ägare: styrelsen (protokoll), redovisningsansvarig (bokföring). Datum: så snart som möjligt.

**Severity:** attention (blockerande om utdelning har betalats utan disposition, eller om nästa årsbokslut närmar sig inom tre månader — 2026 avslutas inom ca 3,5 månader, så detta närmar sig blockerande tröskel).

---

## Övrigt att titta på

- **WeWork-skuld:** Leverantörsreskontra visar WeWork Stockholm AB med 10 625 kr fördröjd (61–90 dagar vid 2026-08-15). Faktura WW-2026-05 är overdue. Det kan vara värt att följa upp betalningen.
- **Öppna poster på 2650 (momsredovisningskonto):** Balansen 341 170 kr är betydande och bör granskas mot deklarerade momsperioder.
- **Kundfordringar:** 450 875 kr på 1510; värt att kontrollera mot kundreskontra och åldersindelning.
- **Fordran Erik Ek:** 10 740 kr på 1610, bestående av minst två företagskopsbokföringar (A:130, A:131) med kvitto saknas.
- **Inkommande inbox:** Ett oförbehandlat dokument från AWS (May 2026) finns i inbox.
- **Verifikationsglapp:** Year-end readiness för 2025 rapporterar oförklarat glapp A:123 och A:287. Dessa bör förklaras innan nästa revision.
- **Rektationsekostnader:** Manuala vouchers för resekostnader (5800) med moms 6 % är bokförda; det kan vara värt att verifiera att dessa är korrekta och att bilagor finns.
- **Representation:** Manuala representationvoucher (6071) utan motsvarande leverantörsfakturor är normal praxis för småköp, men säkerställ att beloppen är korrekta och att momsen är rätt.

---

**Sammanfattning:** Tre avtre checks gav avvikelse. aud-1.4 visade en betalning till WeWork bokförd som ny kostnad (kostnad och moms dubblerade, skuld kvar). aud-3.3 visade avskrivning saknas på 1230 sedan anskaffningen i februari (underavskrivet 2 500 kr, blockerande). aud-4.1 visade att 2025 års resultat (588 561,25 kr) inte har dispositionerats på 2091/2898. Samtliga fynd har dokumenterade verifikat och belopp.
