# Baslinje på rent demobolag: tax-reviewer · qwen3.6:35b-a3b · natt 2026-09-12

Kommando: `python3 scripts/persona-smoke.py tax-reviewer 20` efter reset-demo.sh. Staik hängde periodvis: 2 timmar väggklocka per körning.

## Turer
```
[setup] model=qwen3.6:35b-a3b persona=tax-reviewer checks=['tax-4.4-employee-receivable-drift', 'tax-foreign-receipt-local-vat', 'tax-A1-consumables-private-context'] tools=59 system_chars=12061
[turn 1] 4s prompt=15073 completion=24 finish=tool_calls tool_choice=required tools=['accounted_get_agent_briefing']
         -> accounted_get_agent_briefing({}) 6411 chars
[turn 2] 4s prompt=17044 completion=198 finish=tool_calls tool_choice=required tools=['accounted_list_employees', 'accounted_list_fiscal_periods', 'accounted_query_journal']
         -> accounted_list_employees({"active_only": true, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 1348 chars
         -> accounted_list_fiscal_periods({"company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 497 chars
         -> accounted_query_journal({"accounts": ["1610", "1680", "2893", "2393"], "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 8012 chars
[turn 3] 7s prompt=21396 completion=436 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"accounts": ["1610"], "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "date_from": "2026-01-01", "include_dimensi) 4988 chars
         -> accounted_query_journal({"accounts": ["2893"], "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "date_from": "2026-01-01", "include_dimensi) 3671 chars
         -> accounted_query_journal({"accounts": ["2393"], "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "date_from": "2026-01-01", "include_dimensi) 1361 chars
[retry 1] timeout: The read operation timed out
[turn 4] 3979s prompt=25862 completion=131 finish=tool_calls tool_choice=auto tools=['accounted_list_verifikat_without_documents']
         -> accounted_list_verifikat_without_documents({"limit": 100, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 8012 chars
[turn 5] 7s prompt=29463 completion=467 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_get_balance_sheet', 'accounted_get_balance_sheet', 'accounted_get_balance_sheet']
         -> accounted_query_journal({"accounts": ["6071", "6072", "5460"], "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "date_from": "2026-01-01", ) 5052 chars
         -> accounted_get_balance_sheet({"as_of_date": "2026-03-31", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 3606 chars
         -> accounted_get_balance_sheet({"as_of_date": "2026-04-30", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 3606 chars
         -> accounted_get_balance_sheet({"as_of_date": "2026-05-31", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 3458 chars
[turn 6] 6s prompt=35856 completion=319 finish=tool_calls tool_choice=auto tools=['accounted_get_balance_sheet', 'accounted_get_balance_sheet', 'accounted_get_balance_sheet']
         -> accounted_get_balance_sheet({"as_of_date": "2026-06-30", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 3460 chars
         -> accounted_get_balance_sheet({"as_of_date": "2026-07-31", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 3460 chars
         -> accounted_get_balance_sheet({"as_of_date": "2026-08-31", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 3461 chars
[turn 7] 4s prompt=39992 completion=252 finish=tool_calls tool_choice=auto tools=['accounted_list_unmatched_documents', 'accounted_query_journal']
         -> accounted_list_unmatched_documents({"limit": 50, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 625 chars
         -> accounted_query_journal({"accounts": ["2641", "2645", "2614"], "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "date_from": "2026-01-01", ) 8012 chars
[retry 1] timeout: The read operation timed out
[turn 8] 1913s prompt=43827 completion=207 finish=tool_calls tool_choice=auto tools=['accounted_list_suppliers', 'accounted_list_supplier_invoices']
         -> accounted_list_suppliers({"company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 5707 chars
         -> accounted_list_supplier_invoices({"company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "limit": 50}) 8012 chars
[turn 9] 7s prompt=50144 completion=364 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"voucher_series": "A", "voucher_number_from": 138, "voucher_number_to": 138, "company_id": "6982567a-4325-49a4-8a50-efa) 3720 chars
         -> accounted_query_journal({"text": "OpenAI", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "include_dimensions": true}) 8012 chars
         -> accounted_query_journal({"text": "AWS", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "include_dimensions": true}) 736 chars
[turn 10] 7s prompt=55559 completion=457 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"text": "Vercel", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "include_dimensions": true}) 8012 chars
         -> accounted_query_journal({"text": "Notion", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "include_dimensions": true}) 2617 chars
         -> accounted_query_journal({"accounts": ["2641"], "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "date_from": "2026-01-01", "group_by": "vou) 8012 chars
[turn 11] 6s prompt=63629 completion=300 finish=tool_calls tool_choice=auto tools=['accounted_get_inbox_item', 'accounted_list_verifikat_without_documents']
         -> accounted_get_inbox_item({"inbox_item_id": "73bcf722-e8aa-4756-936b-e3989d8d8954", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 1624 chars
         -> accounted_list_verifikat_without_documents({"company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "limit": 100, "offset": 0}) 8012 chars
[retry 1] timeout: The read operation timed out
[turn 12] 1031s prompt=68177 completion=281 finish=tool_calls tool_choice=auto tools=['accounted_get_inbox_item', 'accounted_list_inbox_items']
         -> accounted_get_inbox_item({"inbox_item_id": "73bcf722-e8aa-4756-936b-e3989d8d8954", "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d"}) 1624 chars
         -> accounted_list_inbox_items({"limit": 20, "company_id": "6982567a-4325-49a4-8a50-efadad9e6f6d", "unprocessed_only": false}) 616 chars
[retry 1] timeout: The read operation timed out
[turn 13] 238s prompt=69486 completion=4028 finish=stop tool_choice=auto tools=-
[total] turns=13 prompt=535508 completion=7464 tool_calls=29 errors=0 rejections=0 time=7228s
```

## Modellens svar (oredigerat)



# Skattegranskning — Konsult AB (5591234567)

---

## tax-4.4-employee-receivable-drift

### (a) Fordran på Erik Ek (1610) — växer sedan mars

**Finding:** Fordran på den anställde Erik Ek på konto 1610 har ökat sju månader i följd (februari → augusti 2026) utan någon återbetalning. Totalt 10 740 kr. Samtliga sju verifikat saknar underlag (kvitto).

**Evidence:**

| Månad | Månadssaldo 1610 | Ny verifikation | Belopp | Dokument |
|---|---|---|---|---|
| 2026-02-28 | 1 240 kr | A:125 | 1 240 | Nej |
| 2026-03-31 | 2 100 kr | A:126 | 860 | Nej |
| 2026-04-30 | 4 480 kr | A:127 | 2 380 | Nej |
| 2026-05-31 | 5 600 kr | A:128 | 1 120 | Nej |
| 2026-06-30 | 7 590 kr | A:129 | 1 990 | Nej |
| 2026-07-31 | 8 530 kr | A:130 | 940 | Nej |
| 2026-08-31 | 10 740 kr | A:131 | 2 210 | Nej |

Månadssalden är hämtade från balansräkningar per månadsslut. Ingen verifikation har reverserats (storno) eller innehåller texten "Storno". Alla 7 verifikat listas i `accounted_list_verifikat_without_documents`.

**Severity:** `attention` — root cause "receipt routine".

**What closes it:** Bilagor (kvitto) fästs och verifikaten re-bokförs som kostnad, eller en löneavdrag bokförs. En rutinel med att inkomna företagskortsköp dokumenteras inom 14 dagar bör upprättas.

---

### (b) Avräkningskonto Johan Lind (2893) — i debet sedan mars 2026

**Finding:** Kontot 2893 (Lån från närstående personer / Skuld till aktieägare) har månadssaldo i debet varje månad från och med mars 2026. Det innebär att bolaget har en fordran på ägaren — ett förbjudet lån enligt ABL 21 kap. 1 §. Johan Lind är registrerad som `company_owner` och `employee` med löneuttag 70 000 kr/månad.

**Evidence:**

| Månadsslut | 2893-saldo | Ny avtagning | Datering |
|---|---|---|---|
| 2026-02-28 | 0 kr | — | — |
| 2026-03-31 | -25 000 kr | A:132 | 2026-03-25 |
| 2026-04-30 | -50 000 kr | A:133 | 2026-04-25 |
| 2026-05-31 | -75 000 kr | A:134 | 2026-05-25 |
| 2026-06-30 | -100 000 kr | A:135 | 2026-06-25 |
| 2026-07-31 | -125 000 kr | A:136 | 2026-07-25 |

De flesta verifikat (132–136) saknar dokument enligt `accounted_list_verifikat_without_documents`. Kontot 2393 (Lån från närstående) visar en kredit på 300 000 kr (A:137, 2026-01-15) — ett lån *till* bolaget — men detta kompressorar inte 2893-debeten.

**Severity:** `blocking` — förbjudet lån enligt ABL 21 kap. 1 §. Beloppet beskattas som förmån/inkomst för låntagaren (Johan Lind) enligt IL 11 kap. 45 §. Skatteverket kan återberäkna skatt på hela det uttagna beloppet som personlig inkomst och utdöma tillskottsbeskattning +ränta.

**What closes it:** Avräkningen måste återbetalas till bolaget eller omklassificeras (t.ex. som utdelning eller löneavdrag) med korrigering av skattekonsekvenser. Styrelsen beslutar; bokförs om. Fallet stannar öppet tills 2893 är credit.

---

## tax-foreign-receipt-local-vat

### Utländsk moms (Tyskland) avdragen som svensk ingående moms

**Finding:** Verifikat A:138 (Hotel Alexanderplatz GmbH, Tyskland, SE-VAT-nummer DE811223344) har en debetrad på 2641 på 1 045 kr som motsvarar 19 % tysk moms på 5 500 kr hotellkostnad. Verifikatet har **ingen** motsvarande 2645/2614-reverse-charge-rad. Tysk moms kan inte dras av i den svenska momsdeklarationen.

**Evidence:**

- Voucher A:138, journal_entry_id `720f18dd-75e1-481d-9364-a834dc6c70a1`:
  - 5831 debet 5 500 kr (Hotell Berlin 2 nätter)
  - **2641 debet 1 045 kr** (Ingående moms)
  - 2440 kredit 6 545 kr
  - Ingen 2645- eller 2614-rad i samma verifikat.

- Leverantör: Hotel Alexanderplatz GmbH, country "DE", supplier_type "swedish_business", VAT "DE811223344".

- Tysk moms 19 % av 5 500 = 1 045 kr — stämmer.

**Severity:** `attention` (beloppet understiger 5 000 kr-gränsen för blocking).

**What closes it:** Momsen på 1 045 kr ska flyttas från 2641 till kostnadskontot (5831) och deklarationen korrigeras vid nästa momsingivning. Om momsen är betydande kan ansökan om momsrefund i Tyskland vara värd att överväga.

---

## tax-A1-consumables-private-context

### Inköp av livsmedel och dryck på helger/helgdagar utan deltagarlista

**Finding:** Sex inköp på konto 6071 (representation/fika) är daterade på lördagar, söndagar, eller svenska helgdagar (Långfredag, Påskafton, Midsommarafton) och saknar deltagarlista eller syfte i verifikattexten eller dokument. Tre av dessa överstiger 2 000 kr (full moms 25 % = 500 kr per 2 000 kr som inte är avdragsgillt).

**Evidence:**

| Voucher | Datering | Dag/helg | Leverantör | Belopp (excl. moms) | Moms 25 % | Deltagare |
|---|---|---|---|---|---|---|
| A:140 | 2026-04-03 | Långfredag | ICA Bromma | 2 870 kr | 720 kr | Nej |
| A:141 | 2026-04-04 | Påskafton | Systembolaget Bromma | 2 368 kr | 592 kr | Nej |
| A:142 | 2026-06-19 | Midsommarafton | ICA Bromma | 3 679 kr | 920 kr | Nej |
| A:143 | 2026-06-19 | Midsommarafton | Systembolaget Bromma | 2 672 kr | 668 kr | Nej |
| A:144 | 2026-07-11 | Lördag | ICA Bromma | 2 296 kr | 574 kr | Nej |
| A:145 | 2026-07-18 | Lördag | Bageri Bromma | 1 125 kr | 281 kr | Nej |
| A:147 | 2026-03-11 | Torsdag (vardag) | Kick-off fika 12 deltagare | 1 071 kr | 269 kr | Ja (bifogad) |

Totalt 6 inköp på privata datum (helgdagar/helger), alla utan deltagarlista. 1 inköp (A:147) har deltagarlista och är bokfört på en torsdag — godkänd.

Momsen som dragits av på de 6 omstridda köpen: 720 + 592 + 920 + 668 + 574 + 281 = **3 755 kr**.

Vid Skatteverket-återbeskattning är representationens avdragsrätt begränsad till 300 kr per person (momsen på max 1 200 kr exkl. moms per person). Utan deltagarlista kan hela momsen nekas.

**Severity:** `attention` (6 köp på privata datum under rullande sex månader, ingen deltagarlista). Blocking kan uppstå om momsen på representation överstiger tillåtet belopp och perioden redan är deklarerad.

**What closes it:** Deltagarlister och syfte bifogas per purchase, eller bokningen omklassificeras som ickedragbar representation (moms på 6071/6072 flyttas till kostnadskontot utan momsavdrag). Om köpen inte har företagsbakgrund kan de omklassificeras som förmån.

---

## Övrigt att titta på

- **AWS-faktura i inbox:** En obearbetad AWS-faktura för maj 2026 (USD 247, ingen moms) väntar i inbox. Den bör matchas mot en leverantörsfaktura och bokföras.
- **Linear Software Inc (Irland):** Reverse-charge bokförs korrekt på 2645/2614 (voucher A:94) — ingen avvikelse.
- **OpenAI, Vercel, Notion (US):** Bokförs utan moms (import outside EU) — korrekt.
- **2893-mönster:** Uttag på exakt 25 000 kr/månad sedan mars. Mönstret är regelbundet och kan tyda på att det faktiskt är ett löneuttag som inte är lönebokfört, snarare än ett "fritt" uttag. Detta bör utredas med styrelsen.
- **WeWork-moms:** WeWork Stockholm AB bokförs korrekt med svensk moms 25 % på 2641.
- **6071-kontots helg-mönster:** Utöver helgdagsköpen är företaget en konsultbyrå. Konsultbolag brukar ha låg aktivitet på helger; ett inköp på Systembolaget eller ICA på midsommarafton pekar mot privat konsumtion snarare än kundrepresentation.
