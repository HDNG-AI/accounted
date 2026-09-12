# HANDOFF

Written only when a step is left half-done, on the owner's request. The owner strikes anything unverified before the next session.

## Task
DD analyst persona and three checks per `docs/BRIEF-DD-ANALYST.md`, branch `check/dd-analyst`. Files written and self-checked; persona run and scoring not done (no Staik key and no demo instance in the authoring environment).

## Done and verified
- `skills/personas/dd-analyst/SKILL.md`: 33 lines (`wc -l`), 5 093 chars without frontmatter.
- `skills/checks/dd-9.4-arr-backed/SKILL.md` and `skills/checks/dd-9.3-normalisations/SKILL.md` written with the `aud-1.4` headings. `skills/checks/dd-9.7-aging/SKILL.md` given tool names and four extra guard sentences (partial payments at remaining amount, register vs 1510, prior-year payment pattern, stale last invoice).
- System prompt for dd-analyst plus its three checks plus RULES, assembled the way `persona-smoke.py` builds it: `system_chars=20029` (auditor 10 719 and tax reviewer 12 061 for reference).
- `scripts/persona-smoke.py`: `dd-analyst` in DEFAULT_CHECKS. `scripts/score-run.py`: marker `P7 ARR without contract` and control `C4 Klient AB recurring` added. `python -m py_compile` on both: OK. `python scripts/score-run.py` on the two 2026-09-12 baseline run logs reproduces the recorded hits (auditor P1, P2, P6, E1, E2; tax reviewer P2, P3, P4, P5, P8) and C4 reads `ok` on both.
- `docs/agent-learning/specs/CHECKS-MAP.md`: rows 9.3, 9.4, 9.7 updated; DD analyst block and three DD controls added; proposed plants P9, P10 and control C4 added and marked "proposed, not planted".
- grep: no exclamation marks in the DD files, no intent vocabulary outside the standard "never uses" sentence.

## Not done
- No persona run, so no `docs/agent-learning/runs/YYYY-MM-DD-dd-analyst-<model>.md`. Nothing fabricated.
- P9, P10 and control C4 for dd-9.3 are proposals in CHECKS-MAP, not in `plant-errors.ts`.
- No PR: the authoring account has read access only to HDNG-AI/accounted.

## Next step (exactly one)
From `extensions/general/upper-hand` with `.env` filled, after `reset-demo.sh`:
`set -a && source .env && set +a && python3 scripts/persona-smoke.py dd-analyst 20 > /tmp/dd.out 2> /tmp/dd.err && python3 scripts/score-run.py /tmp/dd.out`
Expected: HIT on E3 and P7, `ok` on C1, C3 and C4, no wording violation. Paste scorer output, turn log and the unedited reply into `docs/agent-learning/runs/<date>-dd-analyst-qwen3.6.md`.

## Gotchas
- The seed's Nordic Tech AS item text is "Konsulttjänst export: månad N/2026", not "Månadsabonnemang" as the brief says. dd-9.4 catches the series by fixed amount and monthly cadence, so it works with either text; check the running demo before trusting either.
- The seed creates no recurring schedules, so Klient AB has none. The Klient AB guard in dd-9.4 rests on the hour-based invoice lines (24 h at 1 200 kr) and the 2025 payment history, not on a schedule.
- `accounted_list_recurring_schedules` has catalogVisibility 'search' and is absent from tools/list. The check tells the model to reach it via `accounted_search_tools` or `accounted_call_tool`; watch the first run for the model failing to find it.
- Customer invoicing in the seed ends 2026-05-04 for every customer. Both DD checks tell the model to state the last invoiced month rather than read the stop as churn; tighten that guard if the model still reports churn.
- `accounted_list_invoices` returns no items, paid amounts or remaining amounts; `accounted_get_invoice` does. The auditor baseline showed 1510 at 450 875 while the register's open total is 396 875; dd-9.7 now names the register as the ageing basis and hands the difference to aud-1.3.
- dd-9.3 on the current demo should end in "Ingen avvikelse" with the population checked. That is the intended control result, not a miss.
