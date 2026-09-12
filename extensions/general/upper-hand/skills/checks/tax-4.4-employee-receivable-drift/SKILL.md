---
name: check-tax-4.4-employee-receivable-drift
description: Receivable on an employee growing from card purchases without receipts, and owner settlement accounts drifting to debit. Root cause is the receipt routine; escalates to a prohibited loan under ABL 21 kap when the counterparty is in the restricted circle. Source pattern 4.4 plus owner interview.
---

# Employee receivable drift and owner account to debit (4.4)

**Looks for.** (a) 1610/1680 receivables on employees that increase in three or more consecutive months without repayments, built from small card purchases lacking documents. (b) 2893 or 2393 (owner settlement or owner loan) whose month-end balance turns debit, meaning the company has a claim on the owner.

**Data from Accounted.** Ledger on 16xx, 2393, 2893 by month with voucher texts and counterparties; documents linked to those vouchers; employees and owners (company members, board) to classify the counterparty; payroll to see whether a salary deduction or benefit was booked.

**Rule.** (a) Hit when the 16xx balance for one person rises three consecutive months and fewer than half the vouchers have documents. Severity `attention`; root cause "receipt routine". (b) Hit when a 2893/2393 month-end balance is debit and the counterparty is an owner, board member, CEO or their related party. Severity `blocking`: prohibited loan under ABL 21 kap 1 §, taxable in full as income for the borrower under IL 11 kap 45 §.

**False-alarm guard.** Work on net balances per counterparty and per month: a voucher that has been reversed (storno pair, `reverses_id`/`reversed_by_id`, or a matching entry with the opposite sign and "Storno" in the text) is not a movement; never count both halves. Exclude the group exemption: a debit on 1660 or a receivable on a parent, subsidiary or sister company is allowed (ABL 21 kap 2 §). A travel advance repaid within the next expense report is not drift. A shareholder with under 1 % who is not board or CEO is outside the circle. Confirm who the counterparty is from the voucher text and the owner register before naming the ABL consequence; if the counterparty is unknown, report "counterparty not identifiable from the ledger" and ask.

**Cites.** swedish-tax-planning (förbjudna lån, ABL 21 kap, IL 11 kap 45 §), swedish-payroll (ränteförmån, förmånsbeskattning), swedish-accounting-compliance (underlag per verifikation).

**Evidence.** Every voucher in the series with date, amount and document status; the month-end balance curve; the counterparty classification and its source.

**What closes it.** (a) Receipts attached and re-booked as costs, or a salary deduction, and a receipt routine (card purchases without receipt within 14 days become salary deduction); owner: CEO; date: next payroll run. (b) Repayment or re-booking as salary or dividend with the tax consequence, decided by the board, dated; the case stays open until the account is credit.

**Situation.** tax_review, audit, sale, daily. **Persona.** tax-reviewer, auditor.

**Case title (sv).** "Fordran på {person} växer sedan {month}: {amount}, {n} kortköp utan kvitto" · "Avräkningskonto {owner} i debet {amount}: fordran på ägare"
**Pattern deviated from (sv).** "Kortköp redovisas med kvitto och kostnadsförs. Här har köp utan kvitto lagts som fordran på den anställde månad efter månad." · "Ett avräkningskonto med ägaren ska vara noll eller en skuld till ägaren. Här har bolaget en fordran på ägaren, vilket är ett lån som aktiebolagslagen inte tillåter."
