---
name: check-aud-9.34-tax-account-late
description: Taxes and employer charges not paid on time, visible as late payments, interest, reminder fees or skattetillägg on the tax account and as AGI or VAT declarations filed late. The most common remark in Swedish SME audit reports (ABL 9:34, RevR 209).
---

# Taxes and charges paid late (ABL 9:34)

**Looks for.** Payments to the tax account (1630 movements, "Inbetalning skatt", "Skattekonto") later than the due date for the period they cover; cost interest, reminder fees or skattetillägg booked on 8423, 6992 or 8420; AGI or VAT declarations whose period ended more than the statutory period before filing; a tax account balance that does not move against booked liabilities on 2650, 2710, 2731.

**Data from Accounted.** Ledger on 1630, 2650, 2710, 2731, 8423, 6992; payment vouchers with text; VAT and AGI declaration status if the Skatteverket integration is connected; skattekonto statement if imported; fiscal period dates.

**Rule.** Hit when a payment covering a period is dated after that period's due date (VAT: 12th of the second month after a monthly period, 26th for quarterly; AGI and preliminary tax: 12th of the following month, 17th in January and August), or when any interest, fee or skattetillägg is booked, or when a declaration is filed late. Severity `attention` for a single late payment under performance materiality; `blocking` for repeated late payments, any skattetillägg, or unpaid balances at period end. `auditor_duty`: `remark`.

**False-alarm guard.** Confirm the due date against the company's declaration period (monthly, quarterly or yearly VAT) before calling a payment late. A payment booked late but paid on time (bank date earlier than voucher date) is a bookkeeping timing issue, not a late payment: check the bank date. Interest income on the tax account is not a penalty. If the Skatteverket integration is not connected, say so: the finding is then "cannot be verified against the tax account", severity `info`, owner the bookkeeper, action: connect or upload the statement.

**Cites.** swedish-vat (declaration periods and due dates), swedish-payroll (AGI due dates), swedish-financial-reporting (auditor's remark on taxes and charges).

**Evidence.** Each late payment with voucher id, period covered, due date, payment date, days late; each interest or fee line with voucher id and amount; declaration status per period where available.

**What closes it.** Payments on time for three consecutive periods and any penalties settled; a routine with a named owner (bookkeeper) that pays by the 10th; the skattekonto statement uploaded so the panel can verify. Date: next due date.

**Situation.** audit, daily. **Persona.** auditor, tax-reviewer.

**Case title (sv).** "Skatter och avgifter betalda för sent: {n} tillfällen, {amount} i ränta och avgifter"
**Pattern deviated from (sv).** "Moms, arbetsgivaravgifter och preliminärskatt betalas senast på förfallodagen och skattekontot står utan ränta och avgifter. Här har betalningar gjorts efter förfallodagen, vilket en revisor ska anmärka på i revisionsberättelsen."
