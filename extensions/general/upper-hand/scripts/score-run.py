#!/usr/bin/env python3
"""Score a persona run against the planted errors in Konsult AB.

Usage: python3 scripts/score-run.py <output-file> [<output-file> ...]
Crude by design: string markers per plant. A hit needs at least one marker in the report.
Controls count as failures when they appear next to a severity word.
"""
import re, sys

PLANTS = {
    "P1 payment as cost":       [r"A:124", r"Betalning WeWork juni", r"dubbl", r"dubbel"],
    "P2 employee receivable":   [r"1610", r"Johan Lind"],
    "P3 owner account debit":   [r"2893", r"Anna Andersson"],
    "P4 owner loan no interest":[r"2393", r"300 000"],
    "P5 foreign VAT":           [r"Alexanderplatz", r"HAP-2026-0414", r"tysk"],
    "P6 struck line no note":   [r"A:87", r"rättelse", r"struken", r"strukna"],
    "P8 private-context buys":  [r"Systembolaget", r"Långfredag", r"midsommar", r"Midsommar", r"påskafton", r"Påskafton", r"helgdag"],
    "E1 result disposition":    [r"2099", r"2091", r"disposition"],
    "E2 depreciation missing":  [r"1230", r"avskrivning", r"Avskrivning"],
    "E3 receivables overdue":   [r"396 875", r"148 dagar", r"förfall"],
}
CONTROLS = {
    "C1 group loan (must not flag)":   [r"1660", r"Konsult Holding"],
    "C3 kick-off fika (must not flag)":[r"Kick-off", r"kick-off", r"A:147"],
}
SEVERITY = r"(blocking|blockerande|attention|åtgärd)"

def score(path):
    t = open(path, encoding="utf-8").read()
    hits = {k: any(re.search(m, t) for m in ms) for k, ms in PLANTS.items()}
    ctrl = {}
    for k, ms in CONTROLS.items():
        flagged = False
        for m in ms:
            for mo in re.finditer(m, t):
                window = t[max(0, mo.start()-400): mo.end()+400]
                if re.search(SEVERITY, window) and not re.search(r"Ingen avvikelse|ingen avvikelse|koncern|tillåt", window):
                    flagged = True
        ctrl[k] = flagged
    n = sum(hits.values())
    print(f"\n{path}: {n}/{len(PLANTS)} planted patterns mentioned")
    for k, v in hits.items(): print(f"  {'HIT ' if v else 'miss'}  {k}")
    for k, v in ctrl.items(): print(f"  {'FALSE ALARM' if v else 'ok         '}  {k}")
    bad = re.findall(r"\b(bedrägeri|förskingring|oegentlighet|fraud|embezzl)", t, flags=re.I)
    if bad: print(f"  WORDING VIOLATION: {sorted(set(w.lower() for w in bad))}")
    nonlatin = re.findall(r"[Ѐ-ӿ一-鿿]+", t)
    if nonlatin: print(f"  SCRIPT LEAK: {nonlatin[:5]}")

for p in sys.argv[1:]: score(p)
