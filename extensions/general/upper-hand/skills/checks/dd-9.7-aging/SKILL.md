---
name: check-dd-9.7-aging
description: Ageing of receivables and payables per date with a comment per large item and customer concentration. Catalogue 9.7. Buyer-side DD reads this before anything else about working capital.
---

# Receivables and payables ageing (9.7)

**Looks for.** Customer invoices unpaid past due date, bucketed 1–30, 31–60, 61–90, over 90 days; supplier invoices the same way; any single customer above 25 % of open receivables; supplier accounts with a debit balance (paid twice or credited without an invoice).

**Data from Accounted.** `invoices` (status, due_date, remaining_amount, customer), `supplier_invoices` (status, due_date, remaining_amount, supplier), the AR and AP ledgers (1510, 2440) per date, credit notes, payment records.

**Rule.** Hit when more than 50 % of open receivables are over 90 days, or when one customer holds more than 50 % of open receivables and any of it is past due, or when a supplier account shows a debit balance. Severity `attention`; `blocking` when over-90-day receivables exceed one month of revenue and no reservation for doubtful debts exists.

**False-alarm guard.** Check agreed payment terms first: a customer on 90-day terms is not late at day 60. Exclude invoices under a documented dispute and invoices with a credit note in progress. Invoices to group companies are ageing but not credit risk; report them separately. A supplier debit balance caused by a prepayment agreed in writing is fine. Name the customer's share of *revenue* as well as of receivables before calling it concentration; one large project can distort a single month.

**Cites.** swedish-year-end-closing (reservation for doubtful debts, kundförluster), swedish-financial-reporting (disclosure of concentration), swedish-invoice-compliance (credit notes).

**Evidence.** Per bucket: count and amount. Per large item: invoice number, customer, due date, days overdue, remaining amount, any credit note or dispute reference. Concentration: customer share of open receivables and of period revenue.

**What closes it.** Payment, credit note with reason, or a booked reservation for doubtful debts decided by the CFO with a date; a written explanation per item over 90 days addressed to the buyer's advisor. Owner: CFO. Date: before the next data-room delivery.

**Situation.** sale, covenant, audit. **Persona.** dd-analyst, credit-analyst, auditor.

**Case title (sv).** "Kundfordringar {amount} förfallna, äldsta {days} dagar, {share} % hos en kund"
**Pattern deviated from (sv).** "Kundfordringar betalas inom avtalade villkor och sprids över flera kunder. Här är samtliga öppna fordringar förfallna och en kund står för {share} %."
