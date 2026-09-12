---
name: check-aud-4.1-result-disposition
description: Prior-year result not transferred from 2099 to 2091 (or 2098 dividend) after the AGM. 2099 carries more than one year. Includes the guard that the AGM minutes were actually delivered. Source pattern 4.1.
---

# Result disposition missing (4.1)

**Looks for.** A closed fiscal year whose result still sits on 2099 in the following year after the AGM date (at the latest six months after year-end), with no transfer to 2091 balanced result and, when applicable, 2898 dividend.

**Data from Accounted.** Fiscal periods (closed, closed_at), ledger on 2091, 2098, 2099 by voucher and date, documents of type AGM minutes (årsstämmoprotokoll) if uploaded.

**Rule.** Hit when today is more than six months after the closed year-end and the 2099 balance still includes that year's result, or when 2099 holds two or more years' results. Severity `attention`; `blocking` when the next year-end is within three months or a dividend was paid without the disposition being booked.

**False-alarm guard.** Confirm the AGM minutes exist and were delivered to whoever books: if no minutes are in the archive, the finding is "minutes missing, disposition cannot be booked", owner the board, not the bookkeeper. Net equity may be right while gross is wrong; report it as a presentation and audit issue, not as a missing amount. A company whose AGM is legitimately scheduled later in the six-month window is not yet late.

**Cites.** swedish-year-end-closing (resultatdisposition, 2091/2098/2099), swedish-financial-reporting (förvaltningsberättelse, fastställd årsredovisning).

**Evidence.** The year-end voucher on 2099, the opening balance voucher, the absence of a 2091 voucher after the AGM date, the minutes document id or its absence.

**What closes it.** The disposition voucher per the AGM (2099 to 2091 and 2898), dated the AGM date, booked by the bookkeeper; if minutes are missing, signed minutes delivered by the board first. Owner and date on both.

**Situation.** audit, sale. **Persona.** auditor.

**Case title (sv).** "Resultatdisposition för {year} saknas: {amount} ligger kvar på 2099"
**Pattern deviated from (sv).** "Efter årsstämman förs årets resultat till balanserat resultat och eventuell utdelning. Här bär 2099 fortfarande föregående års resultat."
