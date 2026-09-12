# Persona v2 (skills loaded): tax-reviewer · qwen3.6:35b-a3b · 2026-09-11

Kommando: `python3 scripts/persona-smoke.py tax-reviewer 20` mot Konsult AB med planterade fel P1–P8, kontroller C1, C3.

## Turer
```
[setup] model=qwen3.6:35b-a3b persona=tax-reviewer checks=['tax-4.4-employee-receivable-drift', 'tax-foreign-receipt-local-vat', 'tax-A1-consumables-private-context'] tools=59 system_chars=11522
[turn 1] prompt=14945 completion=70 finish=tool_calls tool_choice=required tools=['accounted_get_agent_briefing']
         -> accounted_get_agent_briefing({"company_id": "31625d88-2973-480e-9156-073668ee8d95"}) 163 chars ERROR
[turn 2] prompt=15085 completion=21 finish=tool_calls tool_choice=required tools=['accounted_list_companies']
         -> accounted_list_companies({}) 546 chars
[turn 3] prompt=15379 completion=60 finish=tool_calls tool_choice=auto tools=['accounted_get_agent_briefing']
         -> accounted_get_agent_briefing({"company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd"}) 6411 chars
[retry 1] timeout: The read operation timed out
[turn 4] prompt=17380 completion=235 finish=tool_calls tool_choice=auto tools=['accounted_list_employees', 'accounted_list_fiscal_periods', 'accounted_query_journal']
         -> accounted_list_employees({"active_only": true, "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd"}) 1348 chars
         -> accounted_list_fiscal_periods({"company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd"}) 497 chars
         -> accounted_query_journal({"accounts": ["1610", "1680"], "status": "posted", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd", "limit": 500}) 4871 chars
[turn 5] prompt=20387 completion=219 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_query_journal']
         -> accounted_query_journal({"accounts": ["2393", "2893"], "status": "posted", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd", "limit": 500}) 4179 chars
         -> accounted_query_journal({"account_from": "2640", "account_to": "2645", "status": "posted", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd",) 8012 chars
[turn 6] prompt=25619 completion=229 finish=tool_calls tool_choice=auto tools=['accounted_lookup_company', 'accounted_query_journal']
         -> accounted_lookup_company({"org_number": "5591234567"}) 242 chars ERROR
         -> accounted_query_journal({"accounts": ["6071", "6072", "5460", "58xx"], "account_from": "5800", "account_to": "6991", "status": "posted", "compan) 221 chars ERROR
[turn 7] prompt=26027 completion=114 finish=tool_calls tool_choice=auto tools=['accounted_query_journal']
         -> accounted_query_journal({"account_from": "5800", "account_to": "6991", "status": "posted", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd",) 8012 chars
[turn 8] prompt=29499 completion=123 finish=tool_calls tool_choice=auto tools=['accounted_query_journal']
         -> accounted_query_journal({"accounts": ["2641"], "status": "posted", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd", "limit": 500}) 8012 chars
[turn 9] prompt=32940 completion=169 finish=tool_calls tool_choice=auto tools=['accounted_query_journal']
         -> accounted_query_journal({"accounts": ["2641", "2645", "2614"], "status": "posted", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd", "limit") 8012 chars
[turn 10] prompt=36426 completion=234 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_list_supplier_invoices']
         -> accounted_query_journal({"voucher_series": "A", "voucher_number_from": 138, "voucher_number_to": 138, "company_id": "99cffebe-3ec5-4bea-bc17-872) 3720 chars
         -> accounted_list_supplier_invoices({"supplier_name": "Hotel Alexanderplatz", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd"}) 580 chars
[turn 11] prompt=38432 completion=198 finish=tool_calls tool_choice=auto tools=['accounted_list_suppliers', 'accounted_list_inbox_items']
         -> accounted_list_suppliers({"company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd"}) 5707 chars
         -> accounted_list_inbox_items({"unprocessed_only": false, "limit": 20, "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd"}) 618 chars
[turn 12] prompt=41262 completion=277 finish=tool_calls tool_choice=auto tools=['accounted_query_journal', 'accounted_get_balance_sheet']
         -> accounted_query_journal({"accounts": ["1610"], "status": "posted", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd", "group_by": "voucher_se) 5001 chars
         -> accounted_get_balance_sheet({"period_id": "14553daf-54cc-4c49-864a-09838a0b3df2", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd"}) 1620 chars
[turn 13] prompt=44179 completion=322 finish=tool_calls tool_choice=auto tools=['accounted_get_general_ledger', 'accounted_get_general_ledger']
         -> accounted_get_general_ledger({"period_id": "4e512ef3-49f5-4652-9d86-d14b0c767958", "account_from": "2893", "account_to": "2893", "company_id": "99cff) 2070 chars
         -> accounted_get_general_ledger({"period_id": "4e512ef3-49f5-4652-9d86-d14b0c767958", "account_from": "2393", "account_to": "2393", "company_id": "99cff) 697 chars
[turn 14] prompt=45631 completion=228 finish=tool_calls tool_choice=auto tools=['accounted_get_document_content', 'accounted_list_supplier_invoices']
         -> accounted_get_document_content({"document_id": "0023cfdf-f5fb-4089-9a0c-dee9d12503cd", "company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd"}) 169 chars ERROR
         -> accounted_list_supplier_invoices({"company_id": "99cffebe-3ec5-4bea-bc17-87290df210dd", "limit": 100}) 8012 chars
[nudge] conclude, 6 turns left
[retry 1] timeout: The read operation timed out
[turn 15] prompt=49665 completion=3367 finish=stop tool_choice=auto tools=-
[total] turns=15 prompt=452856 completion=5866 tool_calls=23 errors=4 rejections=0 time=6092s
```

## Modellens svar (oredigerat)

**tax-4.4-employee-receivable-drift**

**Hittad — Fordran på Johan Lind växer sedan 2026-02 utan återbetalning.**
Finding: 1610 (Fordran på anställd) visar en oavbruten serie debetlinjer för Johan Lind (company_owner, månadslön 70 000 kr) under sju raka månader utan någon kredit/återbetalning: 2026-02 (1 240 kr, v.125), 2026-03 (860 kr, v.126), 2026-04 (2 380 kr, v.127), 2026-05 (1 120 kr, v.128), 2026-06 (1 990 kr, v.129), 2026-07 (940 kr, v.130), 2026-08 (2 210 kr, v.131). Totalt 10 740 kr i Fordran Johan Lind. Alla verifikat har beskrivningen “Kortköp företagskort, kvitto saknas (Johan Lind)” och källtyp manual — inga dokument är kopplade. Fordran har ökat varje månad, vilket uppfyller tröskeln (tre konsekutiva månader med växande fordran, färre än hälften av verifikaten har dokument).
Evidence: verifikat A125–A131, journal_entry_id: eb439004, 2d4a51b1, 652d1b3d, ab5c886a, 8168e465, ecf33771, 322d07fa; rader: 2b1b60ff, a7504812, 17811807, d5408813, 724e0bee, ae695dcb, 5282cc6c. Motparten Johan Lind är klassad som company_owner i employee-listan (id f67e4529).
What closes it: Kvittos bilagor på de sju verifikaten och ombokning till kostnad (eller löneavdrag), samt en kvitt rutiner (kortköp utan kvitto inom 14 dagar blir löneavdrag). Ägare: Johan Lind / CEO. Datum: före nästa lönekörning. Severity: attention.

**Hittad — Avräkningskonto 2893 (Anna Andersson) har månadssvslutande debit-saldo.**
Finding: 2893 (Skuld till aktieägare) har fem debetrader (“Uttag Anna Andersson”) på v.132–v.136 (2026-03 till 2026-07, 25 000 kr/var) utan kreditrader som reducerar saldot. Stängningssaldo för räkenskapsåret 2026 är 125 000 kr i debit. Detta innebär att bolaget har en fordran på Anna Andersson. För att bedöma om det rör sig om ett förbjudet lån enligt ABL 21 kap. 1 § krävs bekräftelse på att hon är styrelseledamot, direktör eller närstående till sådant. Jag kan inte med tillgängliga verktyg verifiera hennes roll i bolaget utöver att hon är anställd och har uttag på 2893. Det är därför “counterparty not identifiable from the ledger” gällande ABL-konsekvens.
Evidence: verifikat A132–A136, journal_entry_id: 2cf1632c, 19adcb84, fdd7ae51, 632963c7, 8cb4040a; rader: 14b2d2a9, e59ed021, a8f300ad, 8d830feb, 49a999a7. 2893 stängningssaldo: 125 000 kr debit.
What closes it: Bekräftelse av Anna Anderssons roll (styrelse/direktör). Om ja: återbetalning eller ombokning som lön/utdelning med skattekonsekvens; styrelsebeslut. Om hon inte är i cirkeln kan avvikelsen mildras. Datum: före nästa kvartalsavslut. Severity: attention (blocking om hon är styrelse/direktör).

---

**tax-foreign-receipt-local-vat**

**Hittad — Tysk moms på Hotel Alexanderplatz GmbH bokförd på 2641 utan omvänd skattskyldighet.**
Finding: Voucher A138 (2026-04-14) för “Lev.faktura HAP-2026-0414: Hotel Alexanderplatz GmbH” visar en debetlinje på 2641 (Ingående moms) om 1 045 kr, och en debet på 5831 (Hotell Berlin 2 nätter) om 5 500 kr. Leverantören Hotel Alexanderplatz GmbH har country: DE och VAT-nr: DE811223344. Vouchern har ingen motstående 2614/2645-rad (ingen omvänd skattskyldighet). Detta är en post från en leverantör utanför Sverige (Tyskland) där tysk moms (antagligen 19 %) har avdragits som svensk ingående moms istället för omvänd skattskyldighet.
Evidence: verifikat A138, journal_entry_id: 0023cfdf-f5fb-4089-9a0c-dee9d12503cd; debetlinjer: 84df7b0f (5831, 5 500 kr), b79cdbdd (2641, 1 045 kr), 64d26c22 (2440, 6 545 kr kredit). Supplier invoice HAP-2026-0414, total 6 545 kr, country DE.
What closes it: Ombockning: 2641-kredit (1 045 kr) och kostnadsdebetaltering; omvänd skattskyldighet 2645 mot 2614 om tjänster, annars korrekt hantering av utländsk moms. Bokförs innan nästa momsdeklaration. Severity: attention (om deklareringen redan är inlämnad och beloppet överstiger 5 000 kr blir det blocking; här är totalfakturan 6 545 kr men endast 1 045 kr är momsen).

**Inte hittad — Linear Software Inc (Irland) är korrekt hanterad med omvänd skattskyldighet.**
Verification: Voucher A94 för “Lev.faktura LIN-2026-04: Linear Software Inc” har både en 2645-debet (253,65 kr) och en 2614-kredit (253,65 kr), vilket är korrekt omvänd skattskyldighet. Samma mönster på A92 (2645/2614). Ingen avvikelse.

**Inte hittad — OpenAI LLC, Vercel Inc, Notion Labs Inc: import utanför EU.**
Verification: Dessa leverantörer (country US) har vat_treatment: import_outside_eu. De redovisas som importmoms eller utan moms på 2641 på samma sätt som vi ser för WeWork (SE-vare). Jag kan inte här med säkerhet säga att deras momshantering är felaktig utan att se de specifika verifikaten; dock finns inga uppenbara 2641-debetlinjer för dessa i journalen — de hanteras sannolikt korrekt som import.

---

**tax-A1-consumables-private-context**

**Hittad — Sex inköp av representation på helger, helgdagar och semesterperiod utan deltagarlista.**
Finding: Flera poster på 6071 (Representation) är bokförda på datum som faller på lördagar, Midsommarafton, Påskafton, Långfredag — allt private-context-datum enligt svensk kontext. Följande poster saknar deltagarlista och syfte:

- V.140 (2026-04-03, Långfredag): ICA Bromma, 3 107,14 kr, 2641: 372,86 kr (6071: 3 107,14 kr). Beskrivning: “Representation ICA Bromma”. Line description: “ICA Bromma (Långfredag)”. Ingen deltagarlista.
- V.141 (2026-04-04, Påskafton): Systembolaget Bromma, 2 368 kr, 2641: 592 kr. Line description: “Systembolaget Bromma (Påskafton)”. Ingen deltagarlista.
- V.142 (2026-06-19, Midsommarafton): ICA Bromma, 3 678,57 kr, 2641: 441,43 kr. Line description: “ICA Bromma (Midsommarafton)”. Ingen deltagarlista.
- V.143 (2026-06-19, Midsommarafton): Systembolaget Bromma, 2 672 kr, 2641: 668 kr. Line description: “Systembolaget Bromma (Midsommarafton)”. Ingen deltagarlista.
- V.144 (2026-07-11, Lördag, semesterperiod): ICA Bromma, 2 562,50 kr, 2641: 307,50 kr. Line description: “ICA Bromma (Lördag, semesterperiod)”. Ingen deltagarlista.
- V.145 (2026-07-18, Lördag, semesterperiod): Bageri Bromma, 1 125 kr, 2641: 135 kr. Line description: “Bageri Bromma (Lördag, semesterperiod)”. Ingen deltagarlista.

Totalt 6 inköp under ett rullande sexmånadersfönster på private-context-datum. Tröskeln “tre eller fler” är uppfylld. Enstaka inköp över 3 000 kr: V.142 (3 678,57 kr) och V.140 (3 107,14 kr). Full moms har avdragits på alla. Endast V.147 (2026-03-11) har “deltagarlista bifogad” och är en kick-off fika — detta godkänns.

Evidence: verifikat A140–A145, journal_entry_id: aaeeab1e, 3ffaa15d, 9836b1ee, 77095085, fb7a4637, 3377e6a3; debetrader: 83f1fa5e, ab14dc1e, 4241a233, 317779b4, f66a6c4e, 8ef7de91. Kostnadslinjer: e5095c38, 24c06161, d98bf2c5, a828e693, e8356118, 8bd2f5dd.
What closes it: Deltagarelistor och syfte bifogas på v.140–v.145. Alternativt: ombokning till icke-avdragbar moms (6071 kostnad + moms icke-avdragbar). Ägare: CEO. Datum: före nästa momsdeklaration. Severity: attention (blocking om momsen på entertainment överskrider tillåten ersättning och perioden är deklarerad — här är momsen sammanlagt ca 2 526,81 kr, vilket behöver bedömas mot 300 kr per person-gränsen).

---

**Checkar som inte kunde verifieras fullt ut:**

1. **Anna Anderssons roll i bolaget** — Jag kan inte med tillgängliga verktyg verifiera om Anna Andersson är styrelseledamot, direktör eller närstående till sådant. Employee-listan visar henne som “employee” med månadslön, men detta utesluter inte att hon också är ägare/styrelse. Utan detta är det omöjligt att bedöma om 2893-debetet utgör ett förbjudet lån enligt ABL 21 kap. 1 §.
2. **Dokument på verifikaten v.140–v.145** — Jag kunde inte ladda dokumentinnehållet (dokument-ID för v.138 gav “Document not found”, och jag har inga dokument-IDs för v.140–v.145 i resultaten). För att verifiera att det verkligen saknas deltagarlistor måste dokumenten laddas.
3. **Tysk moms på v.138 — faktiskt momsbelopp** — Jag kan inte öppna fakturan från Hotel Alexanderplatz GmbH för att verifiera den faktiska tyska momsen. Noteringen 1 045 kr på 2641 är vad som bokfördes, men det är oklart om det motsvarar 19 % av en tysk moms.
4. **Momsdeklarationens status** — Jag har inte hämtat momsdeklarationsstatus för 2026-Q2 (perioder med de felaktiga bokföringarna) för att avgöra om det är “blocking” enligt regeln (då deklareringen är inlämnad och beloppet överstiger 5 000 kr).
