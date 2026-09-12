---
name: check-aud-3.3-depreciation-missing
description: Fixed assets without monthly depreciation, empty or future-dated depreciation vouchers. Result overstated. Includes the partial-year guard from catalogue 3.2. Source pattern 3.3.
---

# Depreciation missing (3.3)

**Looks for.** Balances on 12xx (and 10xx, 11xx) with no matching movement on 78xx (or 77xx, 79xx) for the months since acquisition; depreciation vouchers with zero amounts; depreciation vouchers dated after today.

**Data from Accounted.** Ledger lines on 10xx to 12xx and 77xx to 79xx per month; asset records if the assets module is used (acquisition date, method, useful life); fiscal period status.

**Rule.** For each asset account with a debit balance: expected monthly depreciation = balance / useful life in months (default 60 for 12xx, 36 for computers on 1250, 240 for buildings), starting the month after acquisition. Hit when two or more consecutive months lack a 78xx movement for that account, or when a depreciation voucher has no lines or a future date. Severity `attention`; `blocking` when the missing amount exceeds 1 % of the period's result or the period is being closed.

**False-alarm guard.** Compute partial-year depreciation before flagging an amount difference: an asset acquired mid-year is correctly depreciated for fewer months. Assets under the half-price-base-amount threshold may be expensed directly; check 54xx before flagging a small 12xx balance. Land (1110) is not depreciated. A company that books depreciation quarterly is not missing it; look at the pattern of prior years before calling monthly the norm.

**Cites.** swedish-asset-accounting (planenlig avskrivning, useful lives, förbrukningsinventarier threshold).

**Evidence.** The 12xx voucher and amount, the months without 78xx movement, the expected amount per month and in total, prior-year pattern.

**What closes it.** Depreciation booked for the missing months (one voucher per month or one catch-up voucher with a note), and a monthly routine; owner: the bookkeeper; date: before the next month-end close.

**Situation.** audit, daily. **Persona.** auditor.

**Case title (sv).** "Avskrivning saknas på {account} sedan {month}: resultatet överskattat med cirka {amount}"
**Pattern deviated from (sv).** "Inventarier skrivs av planenligt varje månad från månaden efter anskaffning. Här finns anskaffningen men ingen avskrivning."
