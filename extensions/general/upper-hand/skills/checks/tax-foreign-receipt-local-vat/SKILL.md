---
name: check-tax-foreign-receipt-local-vat
description: Input VAT deducted on a receipt or invoice from a supplier outside Sweden where the VAT is foreign (hotel, restaurant, transport abroad) or where reverse charge should have been applied. Not deductible in the Swedish return. Original Upper Hand spec check.
---

# Foreign receipt with local VAT deducted

**Looks for.** Debit lines on 2641 (or 2640) whose voucher belongs to a supplier with country outside SE, without a matching 2614/2645 reverse-charge pair, typically 58xx travel, 5831 hotel abroad, 6071 entertainment abroad.

**Data from Accounted.** `supplier_invoices` with supplier country and VAT treatment; journal lines on 2641/2645/2614; documents (extracted text: VAT rate, currency, country); supplier register.

**Rule.** Hit when a 2641 debit exists for a supplier with country ≠ SE and the voucher has no 2614/2645 pair, or when the extracted VAT rate on the document is not a Swedish rate (25, 12, 6). Severity `attention`; `blocking` if the VAT period is declared and the amount exceeds 5 000 kr.

**False-alarm guard.** A foreign supplier registered for Swedish VAT (SE VAT number on the document) charges Swedish VAT legitimately. Goods imported with import VAT via Skatteverket are booked differently (2615/2645); do not flag them here. Reverse charge on services from EU/US booked as 2645 against 2614 is correct. Check the document before the supplier register: the register country may be wrong.

**Cites.** swedish-vat (foreign VAT not deductible, reverse charge on services, VAT refund via other member state).

**Evidence.** Voucher id, supplier id and country, the 2641 line, document id and extracted VAT rate.

**What closes it.** Re-booking of the foreign VAT to the cost account (and a VAT refund application in the other country if worthwhile), by the bookkeeper before the next VAT filing.

**Situation.** tax_review, audit. **Persona.** tax-reviewer.

**Case title (sv).** "Utländsk moms avdragen som ingående moms: {supplier}, {amount}"
**Pattern deviated from (sv).** "Moms från ett annat land dras inte av i den svenska momsdeklarationen. Här har {rate} % utländsk moms bokförts på 2641."
