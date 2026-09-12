---
name: check-aud-1.4-payment-booked-as-cost
description: A bank payment of an already registered supplier invoice was booked as a new cost with input VAT instead of settling 2440. Cost and VAT are doubled. Shared by auditor (cost side) and tax reviewer (VAT side). Source pattern 1.4 in the function catalogue.
---

# Payment booked as new cost (1.4)

**Looks for.** A manual voucher that debits an expense account and 2641 and credits 1930, where an open or recently paid supplier invoice from the same supplier exists with the same total, and the invoice's own payment voucher is missing or the liability on 2440 stays open.

**Data from Accounted.** `supplier_invoices` (supplier, number, total, status, remaining_amount, registration and payment voucher ids); journal entries with `source_type = manual` that hit 1930 credit and 2641 debit; supplier names in voucher text.

**Rule.** Hit when: manual voucher total equals an invoice total for the same supplier within ±0 kr, dated after the invoice date, and either `remaining_amount > 0` on that invoice or the invoice already has a payment voucher (then the payment is doubled, not the cost). Severity `attention`; `blocking` if the VAT period is already declared.

**False-alarm guard.** Match on supplier and amount is not enough: two invoices can share an amount. Confirm by invoice number in the voucher text, by date proximity, and by the 2440 balance for that supplier. If the manual voucher references a different invoice number that is not registered, it is a missing registration, not a double booking. Check the invoice was not credited.

**Cites.** swedish-vat (input VAT is deducted once, on the invoice, not on the payment), swedish-accounting-compliance (payment settles the liability).

**Evidence.** Both voucher ids, the supplier invoice id and number, the 2440 sub-ledger for the supplier, the 2641 lines.

**What closes it.** Reversal of the manual voucher and a proper payment voucher against 2440, booked by the bookkeeper before the next VAT filing date. Or, if the manual voucher is the only correct one, registration of the invoice so the liability matches.

**Situation.** audit, tax_review, daily. **Persona.** auditor, tax-reviewer.

**Case title (sv).** "Betalning bokförd som ny kostnad, {supplier} {invoice_number}: kostnad och moms dubblerade"
**Pattern deviated from (sv).** "En registrerad leverantörsfaktura betalas mot 2440. Här bokfördes betalningen som ny kostnad med avdragen moms medan fakturan står kvar som skuld."
