---
name: check-tax-A1-consumables-private-context
description: Food, alcohol, pastries and similar consumables bought in private-context timing (weekends, public holidays, vacation weeks) and booked as entertainment or supplies with full VAT and no participant list. Describes the deviation, never intent. Source: owner interview 2026-09-11.
---

# Consumables in private-context timing (A1)

**Looks for.** Purchases on 6071, 6072, 5460, 6991 from grocery, alcohol, bakery, restaurant merchants (merchant text, supplier category) dated on Saturdays, Sundays, Swedish public holidays and their eves, or during weeks 27 to 32 and 51 to 1, without a participant list or purpose in the document, often with full VAT deducted.

**Data from Accounted.** Ledger lines on the accounts above with dates and voucher texts; documents and their extracted text (participants, purpose); a Swedish holiday calendar; the company's usual weekday pattern for the same accounts; payroll calendar (vacation).

**Rule.** Hit when three or more such purchases in a rolling six months fall on private-context dates without participants, or when any single purchase exceeds 3 000 kr on such a date. Severity `attention`; `blocking` if the VAT deducted on entertainment exceeds the allowance (VAT on max 300 kr per person) and the period is declared.

**False-alarm guard.** Compare with the company's own pattern: a business that works weekends (events, hospitality) buys on weekends legitimately. A documented kick-off, customer event or staff party with participants and purpose is fine on any date. One purchase is not a pattern. Never name a person's intent; report frequency, timing, amounts and missing documentation. If a participant list exists but is not attached, the finding is "documentation missing", severity `info`.

**Cites.** swedish-vat (representation VAT allowance 300 kr per person), swedish-tax-planning (förmån, förtäckt lön/utdelning), swedish-accounting-compliance (underlag och deltagarförteckning).

**Evidence.** Each voucher with date, weekday or holiday name, merchant, amount, VAT deducted, document status; the six-month count; the company's weekday baseline.

**What closes it.** Participant lists and purpose attached per purchase, or re-booking as non-deductible or as benefit or salary with the tax consequence; owner: CEO; date: before the next VAT filing.

**Situation.** tax_review, audit, daily. **Persona.** tax-reviewer, forensic.

**Case title (sv).** "{n} inköp av livsmedel och dryck på helger och helgdagar utan deltagarlista, {amount} med full moms"
**Pattern deviated from (sv).** "Representation bokförs med deltagare och syfte, på dagar då verksamheten pågår, och momsen begränsas till 300 kr per person. Här saknas deltagarlistor och köpen ligger på {examples}."
