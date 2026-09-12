# Upper Hand: förberedelsekit inför hackathonet

Det här är kitet jag tar med. Det är inte projektet, det är startpaketet gruppen kopierar in i Accounted på lördag morgon.

## Vad som finns här

| Fil | Vad | Vem läser |
|---|---|---|
| `CLAUDE.md` | Produkt, arkitektur, regler, dagsscope, arbetssätt | Agenten och gruppen |
| `opencode.json` | Jens config mot api.staik.se (qwen3.6 default, gemma4 alternativ, permissions) | OpenCode |
| `.claude/settings.json` | Samma permissions översatta till Claude Code, plus deny på Accounteds approve-verktyg | Claude Code |
| `.claude/agents/reviewer.md`, `.opencode/agents/reviewer.md` | Read-only reviewer, samma prompt i båda | Båda |
| `.claude/commands/`, `.opencode/command/` | `/review`, `/retro`, `/handoff` | Båda |
| `HANDOFF.md` | Mall, skrivs bara på begäran | Agenten |
| `DESIGN.md` | Upper Hands designtokens: palett, typografi, tabellregler, Tailwind-tema. Används för all UI. | Agenten och gruppen |
| `docs/agent-learning/` | `sessioner.md`, `dogfooding.md`, `beslut.md`, `retros/`, `specs/SPEC-template.md`, arbetsboken | Bara jag (svenska) |

## Var det hamnar på lördag

Upper Hand är en Accounted-extension, inte ett eget repo. I Accounted-klonen:

```bash
cd ~/dev/accounted
git checkout -b upper-hand
npx tsx scripts/create-extension.ts --name upper-hand --sector general --category reports --description "Reviewer panel: auditor, tax, DD, credit"
# lägg till "upper-hand" i extensions.config.json
cp -r ~/dev/upperhand-prep/CLAUDE.md ~/dev/upperhand-prep/DESIGN.md ~/dev/upperhand-prep/docs extensions/general/upper-hand/
cp -r ~/dev/upperhand-prep/.claude/agents ~/dev/upperhand-prep/.claude/commands .claude/   # Accounted har redan .claude/skills och .claude/rules
```

Accounteds egen `CLAUDE.md` i roten gäller alltid (hard rules om journal-skrivningar, migrationer, `npm test`, inga em/en-dashes i kod och docs). Vår `CLAUDE.md` läggs som nested fil i extension-katalogen och läses när man jobbar där. Permissions: slå ihop `.claude/settings.json` härifrån med det Accounted eventuellt har, eller lägg vår som `.claude/settings.local.json`.

## Sådant jag lärde mig av Accounted-repot som påverkar CLAUDE.md

1. **npm, inte pnpm.** `npm test`, `npm run lint`, `npx vitest run <dir>`, `npm run check:guards`. Sektion 6 i CLAUDE.md säger pnpm; permissions här är redan rättade.
2. **Extensions lagrar data i `extension_data`** (JSONB per `extension_id` + `key`), inte i egna tabeller. CLAUDE.md sektion 3 säger `uh_cases`, `uh_metric_definitions`, `uh_readiness_snapshots`. För en dag: kör `extension_data` med `key: 'cases'` osv. och slipp migration. Eget beslut för gruppen; står i `beslut.md` som öppen fråga.
3. **Behandlingshistorik heter `processing_history`**: append-only, `aggregate_type` (Document, BankTransaction, MatchProposal, Verifikation, CounterpartyTemplate, Period, Migration, System), `event_type`, `actor` JSONB, `occurred_at` vs `appended_at`. Skillnaden mellan de två tidsstämplarna är checken `registered-long-after-booking-date`.
4. **Struken rad** finns som `journal_entry_rattelse_log` (inline rättelse, founder-approved 2026-07-23). Checken `struck-row-no-explanation` läser den.
5. **MCP: 176 verktyg**, scopes i `lib/auth/scope-catalog.ts`. Read-only-scopes: `transactions, customers, articles, invoices, suppliers, reports, payroll, companies, compliance, pending_operations, reconciliation, operations, events, documents, agent` med suffix `:read`. Alla skrivningar stagas och kräver `gnubok_approve_pending_operation` med scope `pending_operations:approve`. **En API-nyckel utan approve- och write-scopes är den riktiga spärren.** Permissions här nekar approve-verktygen som andra lager.
6. **Events extensions kan lyssna på** (`lib/events/types.ts`): `journal_entry.committed`, `document.uploaded`, `invoice.created`, `invoice.paid`, m.fl. Panelen kan köras event-drivet i stället för på schema.
7. **Accounted har redan** alla `swedish-*`-skills under `.claude/skills/`, plus `/create-extension`, `/supabase-migration`, `/erp-api-route`. Återanvänd, bygg inte om.

## Köra Accounted lokalt

Kräver Docker Desktop igång. Supabase CLI via `npx supabase` (brew-varianten kräver nya Xcode Command Line Tools).

```bash
cd ~/dev/accounted
npm install
npx supabase start          # första gången: laddar images, kör 834 migrationer
npx supabase status         # ger API URL, anon key, service_role key
cp .env.example .env        # fyll i de tre Supabase-värdena från status + CRON_SECRET
npm run dev                 # http://localhost:3000
```

Status för detta står längst ned.

## Köra OpenCode mot Staik

Nyckeln ligger i `.env` (gitignorad). OpenCode läser den via `{env:STAIK_API_KEY}` i `opencode.json`, så exportera den innan start:

```bash
cd ~/dev/upperhand-prep && set -a && source .env && set +a && opencode
```

Headless: `opencode run -m staik/qwen3.6:35b-a3b "..."`. Modeller: `staik/qwen3.6:35b-a3b` (default), `staik/gemma4:31b`, `staik/hdng-auto`.

## Persona-loopen (kärnan i miniatyr)

`scripts/persona-smoke.py [tax|auditor] [max_turns]`: hämtar Accounteds verktygslista från den lokala MCP-servern med read-only-nyckeln, ger en Staik-modell personans systemprompt och verktygen, exekverar tool-calls, loggar en rad per tur till stderr och skriver fynden till stdout. `MODEL=gemma4:31b` byter modell. Resultat 2026-09-10 med qwen3.6: 13–15 turer, 27–35 tool-calls, 70–90 s, fem fynd med id/belopp/datum. Svag punkt: svenskan i slutrapporten.

| Persona · modell | Turer | Tool-calls | Fel | Prompt-tokens (kum.) | Tid | Fynd | Svenska |
|---|---|---|---|---|---|---|---|
| tax · qwen3.6 | 15 (nudge) | 27 | 1 | 560 933 | 88 s | 5, grundliga | stavfel, ett kyrilliskt ord |
| auditor · qwen3.6 | 13 | 35 | 3 | 481 488 | 71 s | 5, grundliga | stavfel |
| tax · gemma4 | 6 | 5 | 0 | 98 842 | 27 s | 3, tunnare | felfri |

Beslut: qwen3.6 gör analysen, gemma4 gör kontroll (prövar fynden mot bevisen) och språkrättning. Se `beslut.md`.

### Resultat mot planterade fel (2026-09-11, persona v2 med checks laddade)

| Mönster | Revisor (1.4, 3.3, 4.1) | Skatt (4.4, utländsk moms, A1) |
|---|---|---|
| P1 betalning som ny kostnad | träff, med rätt resonemang | (ej dess check) |
| P2 fordran anställd växer | | träff, alla sju verifikat |
| P3 avräkning ägare i debet | nämnd | träff, ABL-eskalering villkorad på roll (korrekt) |
| P4 ägarlån utan ränta | nämnd som ej verifierad | |
| P5 tysk moms på 2641 | | träff |
| P6 struken rad utan not | (ingen check byggd än) | |
| P8 helgköp utan deltagare | | träff, alla sex, C3 godkänd |
| E1 disposition saknas | "ingen avvikelse": FY2025 var inte stängt i datan (nu rättat) | |
| E2 avskrivning saknas | träff, korrekt delårsberäkning | |
| E3 kundfordringar förfallna | nämnd som ej verifierad | |
| C1 koncernlån | inget larm | inget larm |
| C3 kick-off med deltagarlista | inget larm | uttryckligen godkänd |

Rättning: `python3 scripts/score-run.py <rapport>`. Kvarstående: språkläckage (gemma4-steg), P6 kräver `compl-5.5`, P4 kräver `aud-4.3`.

## Lördag morgon: starta allt

```bash
cd ~/dev/accounted && npx supabase start && (npm run dev > /tmp/accounted-dev.log 2>&1 &)   # http://localhost:3001
bash extensions/general/upper-hand/scripts/reset-demo.sh                                      # rent demobolag med planterade fel
cd ~/dev/upperhand-prep && set -a && source .env && set +a
python3 scripts/persona-smoke.py auditor 20 > /tmp/a.out 2> /tmp/a.err &
python3 scripts/persona-smoke.py tax-reviewer 20 > /tmp/t.out 2> /tmp/t.err & wait
python3 scripts/score-run.py /tmp/a.out /tmp/t.out                                            # träffar per planterat fel, falska larm, språkläckage
python3 scripts/control-pass.py /tmp/a.out                                                   # gemma4: kontroll + svensk text, exit 2 om språkgaten faller
```

Om Staik hänger (natten 11–12/9 tog enskilda turer upp till 67 minuter): loopen har 150 s timeout och tre omförsök per anrop; kör personas sekventiellt i stället för parallellt om det fortsätter.

## Innan lördag: kvar att göra

- [x] Staik-nyckel: Eriks egen (`coder_pro`), ligger i `.env` som `STAIK_API_KEY`. `opencode auth login` vägrade nyckeln, så `opencode.json` läser `{env:STAIK_API_KEY}` i stället
- [x] Rökprov 2026-09-10: `OK` på 0,1–0,5 s, tool-call i korrekt format, `opencode run` grönt. `hdng-auto` = router till qwen3.6
- [x] Accounted API-nyckel "Upper Hand reviewer (read-only)", 15 av 30 scopes (alla Läs), i `.env`. MCP-servern visar 59 verktyg för den
- [x] Första persona-körningarna 2026-09-10: `scripts/persona-smoke.py tax|auditor` mot Konsult AB. Båda levererade fem fynd med bevis. Loggar i `docs/agent-learning/runs/`
- [x] Demobolaget planterat 2026-09-11: P1–P8 + kontroller C1, C3 (A:124–A:147, rättelse på A:87), se `docs/agent-learning/specs/CHECKS-MAP.md`. Skript: `scripts/plant-errors.ts`, körs från Accounted-roten: `npx tsx extensions/general/upper-hand/scripts/plant-errors.ts [--undo] [--only P1,P3]`. **Ren omstart av hela demobolaget:** `bash extensions/general/upper-hand/scripts/reset-demo.sh` (seedar om Konsult AB, behåller API-nyckeln, stänger 2025, planterar). Använd den i stället för `--undo` när namn eller belopp ska ändras: storno-par förvirrar granskarna
- [ ] Sex checks som `SKILL.md` enligt CHECKS-MAP (Erik granskar domänen)
- [ ] Halvsidas pitch på svenska för gruppen
- [ ] Demo-spår B: en riktig eller anonymiserad SIE4-fil (Fortnox/Visma-export) att importera i ett nytt bolag och köra panelen på, med provenance `numbers_only`. Se `beslut.md`

## Status lokal miljö (2026-09-10 kväll)

| | Status |
|---|---|
| OpenCode 1.18.30, pnpm 12.3.4 | installerat via brew |
| Supabase CLI | via `npx supabase@latest` (brew kräver nya Xcode CLT: `sudo xcode-select --install`) |
| `~/dev/accounted` | klonad (`--depth 1`, main @ c5437eb), `npm install` klart |
| Lokal Supabase | `npx supabase start` i accounted: 12 containrar uppe, **833/833 migrationer applicerade utan fel** |
| `.env` | skriven mot lokal Supabase (standard-demonycklar, inga hemligheter) |
| `npm run dev` | startar; **port 3000 är upptagen av en annan Docker-app, Next tar 3001** |
| `GET /api/health` | `{"status":"healthy"}` på http://localhost:3001 |
| MCP-server lokalt | `tools/list` utan token svarar med 135 `accounted_*`-verktyg (lazy auth) |
| Inloggningssida | renderar |

Starta om allt på lördag morgon:

```bash
cd ~/dev/accounted && npx supabase start && npm run dev   # sedan http://localhost:3001
```

Första kontot skapas i appen (lokal auth, mail landar i Mailpit på http://127.0.0.1:54324). Supabase Studio: http://127.0.0.1:54323.

### Testbolag (klart 2026-09-10)

Onboardingens företagssökning kräver Accounteds externa bolagstjänst (TIC) som inte finns lokalt: skriv ett **organisationsnummer**, inte ett namn, om du någon gång måste gå igenom den. Enklare: hoppa över den helt med repots seed-skript.

```bash
cd ~/dev/accounted
npx tsx scripts/seed-demo-account.ts <e-post för kontot> --force
```

Ger **Konsult AB** (FY2025 helt bokfört, FY2026 aktivt: 416 verifikationer, 121 kundfakturor, 34 leverantörsfakturor, 150 banktransaktioner varav 5 okategoriserade, 3 anställda med lönekörningar, en AWS-PDF i inkorgen) och **Konsult Holding AB**. Seedat för `erik@hdng.ai` lokalt. Verifikationsluckorna A123/A287 kräver `scripts/seed-demo-voucher-gaps.sql` separat.

**Det är vårt demobolag för lördag.** De fem planterade felen (CLAUDE.md §5) läggs ovanpå Konsult AB, inte i ett tomt bolag.

Känd fallgrop i skriptet, lokalt lagad, värd en PR till erp-mafia: `seedCustomers` skickar rader med olika nyckeluppsättningar i en bulk-insert, och PostgREST fyller saknade nycklar med `null` i stället för kolumnens default, så `customers.vat_number_validated NOT NULL` faller. Fix: `vat_number_validated: false` i basraden (en rad i `scripts/seed-demo-account.ts`).
