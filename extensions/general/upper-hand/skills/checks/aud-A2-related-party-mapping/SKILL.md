---
name: check-aud-A2-related-party-mapping
description: Related-party dealings. Monitors what the ledger shows (loans, rent, purchases and sales with owners, board, employees and their companies) and, when the company has no related-party register, offers to map it. Severity info unless a specific transaction fails another check. Source: owner interview 2026-09-11.
---

# Related-party mapping (A2)

**Looks for.** Counterparties in `suppliers`, `customers`, loan accounts (16xx, 23xx, 28xx) and rent (5010) that share an org number, address, name stem or bank account with an owner, board member, CEO, employee or their companies; persons appearing in more than one role (owner and landlord and supplier); loans to or from such parties without interest or agreement.

**Data from Accounted.** Company members and roles, employees, suppliers and customers with org numbers and addresses, ledger on 16xx/23xx/28xx/5010, documents (agreements), Konsult Holding style parent links.

**Rule.** Two modes. *Monitor*: hit when a transaction with a related party exists without an agreement document, or a loan without interest, or rent above market indication. Severity `attention`. *Map*: when no related-party register exists in the archive, open one `info` case per company: "Ingen närståendeförteckning finns. Panelen kan kartlägga: ägare, styrelse, anställda och deras bolag mot leverantörer, kunder och lån." The mapping runs only when the user accepts.

**False-alarm guard.** Read the voucher and line texts before judging a loan: a line that names a group loan, an interest basis (for example SLR + 1 %) and an agreement date is documented until the document itself proves otherwise. Group companies under ABL 21 kap 2 § are related parties but their loans are allowed; report them as disclosure items, not errors. Common surnames are not a match without a second signal (address, org number, bank account). Market rent needs an external indication before it is called high. Never infer intent; report the relationship, the transaction and the missing document.

**Cites.** swedish-financial-reporting (upplysning om närstående, K2/K3 notes), swedish-tax-planning (armlängdsprincip, förtäckt utdelning, ABL 21 kap).

**Evidence.** The matching fields (which identifiers matched), the transactions with voucher ids, the agreement document or its absence.

**What closes it.** Agreements on file with terms, interest booked, disclosure prepared for the annual report; for the map mode, an accepted or declined mapping recorded with date. Owner: CFO or board.

**Situation.** audit, sale, covenant. **Persona.** auditor, next-cfo, dd-analyst.

**Case title (sv).** "Närståendetransaktion utan avtal: {counterparty}, {amount}" · "Ingen närståendeförteckning: vill ni att panelen kartlägger?"
**Pattern deviated from (sv).** "Affärer med ägare, styrelse och deras bolag dokumenteras med avtal på marknadsmässiga villkor och redovisas i årsredovisningen. Här finns transaktionen men inte avtalet."
