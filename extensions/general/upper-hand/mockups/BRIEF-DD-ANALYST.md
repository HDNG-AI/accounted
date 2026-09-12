# Brief: building the DD analyst

For whoever takes the due-diligence persona. The deliverable is markdown: a persona file and three check files. You can write them without running anything (section 0); running and scoring can be done by someone else.

## 0. The short path: no environment, just the material

You do not need keys, the demo instance or Python. The deliverable is text. Do this:

1. Read the four files in section 1 (GitHub in a browser is enough: `github.com/HDNG-AI/accounted/tree/upper-hand/extensions/general/upper-hand`).
2. Write the persona and the three checks as markdown, copying the headings from the auditor persona and the `aud-1.4` check exactly. Use the demo-company facts in section 1 as your "planted evidence" so each check names what it should hit and what it must stay silent on.
3. Hand the files to Erik: a PR if you are comfortable with git, otherwise the files in a message. Erik or Claude runs the persona loop and the scorer against the demo company and sends you the output. You adjust, we run again. Two or three rounds is normal.

Sections 3 and 4 below describe the full path for whoever runs it; you can skip them.

## 1. What already exists (read in this order, 20 minutes)

| File | Why |
|---|---|
| `CLAUDE.md` | The product and the rules. §1 lists the DD analyst's remit, §2 the non-negotiables, §3 the skill formats and the case object. |
| `skills/personas/auditor/SKILL.md` | The persona format, filled in. Copy its headings exactly. |
| `skills/checks/aud-1.4-payment-booked-as-cost/SKILL.md` | The check format, filled in, including the false-alarm guard and the Swedish case title. |
| `docs/agent-learning/specs/CHECKS-MAP.md` | Every catalogue function mapped to persona, check id, data and priority. The DD rows are 2.x, 7.1, 9.x. |
| `docs/agent-learning/specs/funktionskatalog-v1.md` | The source: real, anonymised patterns from bokslut, revision and DD work. Sections 2 (project and revenue), 7 (reporting) and 9 (financial DD from the target's side) are yours. Swedish. |

Also worth ten minutes: `docs/agent-learning/runs/2026-09-12-baseline-tax-reviewer-qwen3.6.md` shows what a good persona run looks like, turn by turn, and how findings are formatted.

**Built and working:** two personas (auditor, tax reviewer), seven checks, the persona loop (`scripts/persona-smoke.py`), the scorer (`scripts/score-run.py`), the gemma4 control-and-language pass (`scripts/control-pass.py`), and a demo company with planted errors that resets with one command. Last night: 9 of 10 planted patterns found, zero false alarms.

**What is in the demo company for you** (Konsult AB, 2026): 12 unpaid customer invoices totalling 396 875 kr, all past due, oldest 148 days, 82 % on one customer (Klient AB, invoiced 36 000 kr weekly); Nordic Tech AS invoiced "Månadsabonnemang" four times with no recurring schedule and no contract document; two EUR customers (Berlin GmbH, Helsinki Oy); a full booked FY2025 and an open FY2026; supplier invoices from US SaaS vendors; one owner loan in (2393, 300 000 kr) and one group loan out (1660, 200 000 kr, allowed). No project dimensions: it is a consulting company, so catalogue 2.1 and 2.2 do not apply here.

## 2. What to deliver

1. `skills/personas/dd-analyst/SKILL.md`, under 60 lines, same headings as the auditor: answers to, materiality, where they start, first five questions, what makes them dig, what makes them let go, checks in order with thresholds, what closes a case, tone, hard rules. Written from how a DD analyst on the buyer's side actually starts (catalogue 9.1, 9.2, 9.12 and section 10), not from a job description.
2. Three checks, each its own folder under `skills/checks/`, same headings as `aud-1.4`:
   - `dd-9.7-aging`: receivables and payables aged per date, comment per large item, concentration. Planted evidence exists (E3). Guard: agreed extended terms, invoices under dispute, credit notes in flight.
   - `dd-9.4-arr-backed`: recurring revenue counts only when backed by a schedule or contract document and by payment. Planted evidence exists (P7, Nordic Tech AS; Klient AB is the positive case). Guard: one-off projects invoiced monthly are not ARR and not an error either.
   - `dd-9.3-normalisations`: one-off items that do not reflect underlying performance, one invoice per line, inclusive and exclusive of VAT, classed one-off / DD-specific / recoverable. Guard: recurring "one-offs" are not one-offs; every line needs an invoice behind it.
   If time allows: `dd-2.6-invoice-credit-cluster` as a control (issued and credited within days is a documentation task, not an error), and `dd-2.7-fx-residual` for the EUR customers.
3. One run log per persona version in `docs/agent-learning/runs/`, filename `YYYY-MM-DD-dd-analyst-<model>.md`, containing the turn log and the unedited model reply. The scorer output goes at the top.
4. New rows in `CHECKS-MAP.md` for anything you add, and the scorer extended with markers for your planted patterns (`scripts/score-run.py`, the `PLANTS` dict).

## 3. How to work

- **One change, one run, one score.** Edit a file, run the persona, read the scorer, then the next change. Never two changes between runs; you will not know which one mattered.
- **Run it:** from this folder, with `.env` filled in,
  `set -a && source .env && set +a`
  `CHECKS=dd-9.7-aging,dd-9.4-arr-backed python3 scripts/persona-smoke.py dd-analyst 20 > /tmp/dd.out 2> /tmp/dd.err`
  `python3 scripts/score-run.py /tmp/dd.out`
  Until `dd-analyst` is in `DEFAULT_CHECKS` in the script, pass `CHECKS=` explicitly. Add it when your checks exist.
- **Watch two numbers in `/tmp/dd.err`:** `system_chars` at setup (keep the persona plus three checks under about 30 000 characters, roughly 8 000 tokens) and `prompt=` per turn. Everything in the persona is paid for on every turn; put detail in the checks, which can grow.
- **Guards first.** The most valuable line in any check is the one that stops a false alarm. Last night's false alarms came from ignoring a line description (a group loan flagged as related-party), from reading storno pairs as live movements, and from reporting outside the assigned checks. Write the guard before the rule.
- **Test the controls, not only the hits.** A check that finds Nordic Tech AS but also flags Klient AB has failed. Put the positive case in the check under "false-alarm guard" by name.
- **Swedish case titles and patterns.** Every check ends with `Case title (sv)` and `Pattern deviated from (sv)`. That text is what the user reads; write it like a CFO, not a system. No intent words, no exclamation marks, amounts with a space as thousands separator, dates YYYY-MM-DD.
- **Anonymised, always.** Patterns from real engagements, never company names, people or identifying figures. The catalogue is already scrubbed; keep it that way.
- **Useful MCP tools for DD** (the model picks them, but you should know they exist): `accounted_list_customer_invoices`, `accounted_get_ar_ledger` / aging, `accounted_get_kpi_summary`, `accounted_get_income_statement`, `accounted_get_balance_sheet`, `accounted_list_supplier_invoices`, `accounted_query_journal`, `accounted_list_unmatched_documents`, `accounted_list_recurring_invoice_schedules` if exposed. Ask the tool list: `accounted_search_tools` with a keyword.
- **If Staik is slow:** run one persona at a time, 20 turns, and log the wall time in the run file. Timeouts and retries are handled by the script.

## 4. How to deliver back

1. Branch off `upper-hand`: `git checkout -b check/dd-analyst`.
2. Commit skill files, the run logs, the scorer markers and the CHECKS-MAP rows. Conventional commit messages (`feat(upper-hand): dd analyst persona and three checks`). Never commit `.env`, never paste keys anywhere.
3. Open a PR against `upper-hand` on `HDNG-AI/accounted`. In the description: which planted patterns your checks hit, the scorer output pasted verbatim, the two controls confirmed silent, `system_chars` and turns of the best run, and what you could not make work. Tests are run, never claimed.
4. Do not edit the Swedish owner notes (`docs/agent-learning/retros`, `dogfooding.md`, `sessioner.md`, `beslut.md`). Put observations about Staik or Accounted in the PR description; the owner moves them.
5. If a step is left half-done, fill in `HANDOFF.md` following its template, exactly one next step.

## 5. Definition of done

- Persona under 60 lines, three checks with guards, Swedish titles.
- A run where the scorer shows hits on E3 and P7, silence on C1 and C3, no wording violation, no script leak.
- Run log committed, CHECKS-MAP updated, PR open with the numbers in the description.
