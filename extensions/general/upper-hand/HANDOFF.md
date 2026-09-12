# HANDOFF

Written only when a step is left half-done, on the owner's request. The owner strikes anything unverified before the next session.

## Task
DD analyst: persona and three checks written by the DD author (branch `check/dd-analyst`, merged). Runs and scoring done by Erik/Claude on 2026-09-12 against the reset demo company with P7 (Nordic Tech subscription), P10 (moving cost), P11 (legal fee), C5 (recurring recruitment fee) planted.

## Done and verified
- Two runs: `docs/agent-learning/runs/2026-09-12-dd-analyst-v1-qwen3.6.md` and `...-v2-...`. Run 2: 20 turns, 44 tool calls, 168 s, one narrated-tool rejection recovered.
- `dd-9.7-aging`: hit both runs. Concentration 81.6 % on Klient AB, all overdue, severity blocking, closing action with owner and date. gemma4 control: godkänt, language gate OK.
- Controls silent both runs: C1, C3, C4, C5 (recruitment fee correctly read as run-rate), C6 (Klient AB correctly read as hourly billing, not unbacked ARR).
- `dd-9.4-arr-backed`: miss. The model found Nordic Tech's "Månadsabonnemang analysplattform" but rejected it because it fetched only one 2026 invoice plus two 2025 ones and concluded "amounts vary, not 3+ consecutive". Four consecutive 2026 invoices at 14 000 kr exist (F-20260027 to F-20260030).
- `dd-9.3-normalisations`: miss. `accounted_list_supplier_invoices` with `date_from 2024-01-01` returned 17 rows, all 2025 (tool page limit); the 2026 invoices from Flyttfirma Stockholm AB and Advokatfirman Nord AB were never seen.
- Model wrote "396 857 kr" for 396 875 kr once; the control pass cannot catch digit swaps without the source figures.

## Not done
- Guards that would have turned the two misses into hits (see next step).

## Next step (exactly one)
Add two data-completeness guards and rerun: in `dd-9.4-arr-backed`, "list every invoice for the customer for the last 12 months before judging cadence; a price change between years does not break recurrence"; in `dd-9.3-normalisations`, "query supplier invoices per year, newest year first, and paginate until the returned count is below the page size; state the population checked". Verify with `python3 scripts/persona-smoke.py dd-analyst 20` and `python3 scripts/score-run.py`: P7, P10, P11 hit, C5 and C6 still silent.

## Gotchas
- Tool results are capped (page limits, 8 000 chars); a check that depends on a full population must say how to fetch it.
- The scorer's C-controls only fire when a control name appears near a severity word; read the report when in doubt.
