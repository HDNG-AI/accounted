---
name: check-aud-25.13-equity-half
description: Equity below half the registered share capital at any point, which obliges the board to draw up a kontrollbalansräkning (ABL 25:13) and bears on going concern (ISA 570). A missing kontrollbalansräkning is a remark and can create personal liability for the board.
---

# Equity against half the share capital (ABL 25:13)

**Looks for.** Booked equity (20xx, result to date included) below 50 % of registered share capital (2081) at any month-end; a loss trend that will cross the line within twelve months at the current burn; absence of a kontrollbalansräkning document or board minutes when the line was crossed.

**Data from Accounted.** Balance sheet per month, 2081, 2091, 2098, 2099, result to date, documents (kontrollbalansräkning, styrelseprotokoll), cash balance and monthly burn for the runway view.

**Rule.** Hit when equity at any month-end is below half the share capital. Severity `blocking`; `auditor_duty`: `remark` if no kontrollbalansräkning within the required time, `notify_board` if the company continued trading past the second control balance date without restoring equity. Early warning (severity `attention`, duty `none`) when the projected crossing is within twelve months.

**False-alarm guard.** Compute equity including the current year's result, not only booked opening equity. Unbooked but decided shareholder contributions (aktieägartillskott) and revaluations allowed under ABL 25:14 change the answer: look for the documents before concluding. A company whose equity was restored before year-end still had a duty at the time; report it as historical with the dates. Do not extrapolate a one-month loss into a trend: use at least three months.

**Cites.** swedish-year-end-closing (equity, result appropriation), swedish-financial-reporting (going concern, kontrollbalansräkning disclosure).

**Evidence.** Month-end equity series with amounts, share capital, the first month below the line, documents found or missing, burn and runway.

**What closes it.** A kontrollbalansräkning drawn up and reviewed, board minutes, and either restored equity (contribution, profit) or a decision on liquidation; owner: the board; date: within the statutory eight months from the first control balance meeting.

**Situation.** audit, covenant, sale. **Persona.** auditor, credit-analyst.

**Case title (sv).** "Eget kapital under halva aktiekapitalet sedan {month}: {equity} mot {half}"
**Pattern deviated from (sv).** "Eget kapital ska överstiga halva det registrerade aktiekapitalet, annars måste styrelsen genast upprätta kontrollbalansräkning. Här underskreds gränsen {month} och ingen kontrollbalansräkning finns i arkivet."
