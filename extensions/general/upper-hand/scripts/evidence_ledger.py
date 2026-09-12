#!/usr/bin/env python3
"""Deterministic evidence ledger for the persona loop.

Every number, voucher id, document id and date the model writes in its report must
appear in a tool response from the same run. This module builds that ledger from the
tool results and checks a report against it, correcting an unambiguous digit
transposition (396 857 -> 396 875) and flagging anything it cannot source.

Pure stdlib, no model call. Imported by persona-smoke.py and control-pass.py, and
usable on its own:

    python3 scripts/evidence_ledger.py build --out /tmp/ledger.json events.json
    python3 scripts/evidence_ledger.py verify --ledger /tmp/ledger.json report.txt
    python3 scripts/evidence_ledger.py correct --ledger /tmp/ledger.json report.txt
"""
from __future__ import annotations

import json
import re
import sys
from collections import namedtuple

NBSP = "\u00a0"
THIN = "\u2009"

DATE_RE = re.compile(r"\b(?:19|20)\d{2}-\d{2}-\d{2}\b")
UUID_RE = re.compile(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b", re.I)
VOUCHER_ID_RE = re.compile(r"\b[A-ZÅÄÖ]{1,4}[.:\-]?\d{1,12}\b")
DOC_ID_RE = re.compile(r"\bdok\s+([0-9a-f]{6,})\b", re.I)
AMOUNT_RE = re.compile(
    r"(?<![\w.,\-])"
    r"(\d{1,3}(?:[ \u00a0\u2009]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?)"
    r"(?![\w.,\-])"
)

Amount = namedtuple("Amount", "text start end value digits decimals")


def _clean(text: str) -> str:
    return text.replace(NBSP, " ").replace(THIN, " ")


def parse_amount(token: str):
    """Return (value, integer_digits, decimals) or None. Swedish grouping: space thousands, comma decimal."""
    s = _clean(token).strip().replace(" ", "")
    if not s:
        return None
    decimals = 0
    if "," in s and "." in s:
        if s.rfind(",") > s.rfind("."):
            s = s.replace(".", "").replace(",", ".")
        else:
            s = s.replace(",", "")
    elif "," in s:
        whole, _, frac = s.partition(",")
        decimals = len(frac)
        s = f"{whole}.{frac}" if frac else whole
    elif "." in s:
        if s.count(".") >= 2:
            s = s.replace(".", "")
        else:
            whole, _, frac = s.partition(".")
            if len(frac) == 3 and 1 <= len(whole) <= 3:
                s = whole + frac
            else:
                decimals = len(frac)
    try:
        value = float(s)
    except ValueError:
        return None
    integer_digits = "".join(ch for ch in s.split(".")[0] if ch.isdigit())
    return value, integer_digits, decimals


def format_amount(value: float, decimals: int) -> str:
    grouped = f"{value:,.{decimals}f}" if decimals else f"{value:,.0f}"
    return grouped.replace(",", " ").replace(".", ",")


def _protected_spans(text: str):
    spans = []
    for pattern in (DATE_RE, UUID_RE, VOUCHER_ID_RE, DOC_ID_RE):
        for match in pattern.finditer(text):
            spans.append((match.start(), match.end()))
    return spans


def _inside(pos: int, spans) -> bool:
    return any(start <= pos < end for start, end in spans)


def extract_amounts(text: str):
    text = _clean(text)
    spans = _protected_spans(text)
    found = []
    for match in AMOUNT_RE.finditer(text):
        if _inside(match.start(), spans):
            continue
        parsed = parse_amount(match.group(1))
        if parsed is None:
            continue
        value, digits, decimals = parsed
        if len(digits) < 4 and " " not in match.group(1) and not any(c in match.group(1) for c in ",."):
            continue
        found.append(Amount(match.group(1), match.start(), match.end(), value, digits, decimals))
    return found


def extract_ids(text: str):
    text = _clean(text)
    ids = set()
    for pattern in (DATE_RE, UUID_RE, VOUCHER_ID_RE):
        for match in pattern.finditer(text):
            ids.add(match.group(0))
    for match in DOC_ID_RE.finditer(text):
        ids.add(f"dok {match.group(1)}")
    return ids


def osa_distance(a: str, b: str) -> int:
    """Optimal string alignment distance (adjacent transposition costs 1)."""
    if a == b:
        return 0
    if abs(len(a) - len(b)) > 1:
        return 99
    rows, cols = len(a) + 1, len(b) + 1
    d = [[0] * cols for _ in range(rows)]
    for i in range(rows):
        d[i][0] = i
    for j in range(cols):
        d[0][j] = j
    for i in range(1, rows):
        for j in range(1, cols):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
            if i > 1 and j > 1 and a[i - 1] == b[j - 2] and a[i - 2] == b[j - 1]:
                d[i][j] = min(d[i][j], d[i - 2][j - 2] + 1)
    return d[-1][-1]


class Ledger:
    def __init__(self):
        self.values = set()
        self.digits = {}
        self.ids = set()

    def add_text(self, text: str) -> None:
        for amount in extract_amounts(text):
            self.values.add(amount.value)
            self.digits.setdefault(amount.digits, format_amount(amount.value, amount.decimals))
        self.ids.update(extract_ids(text))

    def knows_value(self, amount: Amount) -> bool:
        return amount.value in self.values or amount.digits in self.digits

    def correction_for(self, amount: Amount):
        candidates = {
            self.digits[digits]
            for digits in self.digits
            if len(digits) == len(amount.digits) and osa_distance(digits, amount.digits) == 1
        }
        if len(candidates) == 1:
            return candidates.pop()
        return None

    def to_dict(self):
        return {"values": sorted(self.values), "digits": self.digits, "ids": sorted(self.ids)}

    @classmethod
    def from_dict(cls, data):
        ledger = cls()
        ledger.values = set(data.get("values", []))
        ledger.digits = dict(data.get("digits", {}))
        ledger.ids = set(data.get("ids", []))
        return ledger


def build_ledger(events) -> Ledger:
    ledger = Ledger()
    for event in events:
        if isinstance(event, str):
            ledger.add_text(event)
            continue
        ledger.add_text(str(event.get("content", "")))
        if event.get("args"):
            ledger.add_text(json.dumps(event["args"], ensure_ascii=False))
    return ledger


class Verdict:
    def __init__(self):
        self.unknown_amounts = []
        self.corrections = []
        self.unknown_ids = []
        self.ledger_size = 0

    @property
    def ok(self):
        return not self.unknown_amounts and not self.unknown_ids and not self.corrections


def verify_report(report: str, ledger: Ledger) -> Verdict:
    verdict = Verdict()
    verdict.ledger_size = len(ledger.values)
    for amount in extract_amounts(report):
        if ledger.knows_value(amount):
            continue
        correction = ledger.correction_for(amount)
        if correction:
            verdict.corrections.append((amount, correction))
        else:
            verdict.unknown_amounts.append(amount)
    for identifier in extract_ids(report):
        if identifier not in ledger.ids:
            verdict.unknown_ids.append(identifier)
    return verdict


def apply_corrections(report: str, verdict: Verdict) -> str:
    replacements = sorted(verdict.corrections, key=lambda item: item[0].start, reverse=True)
    for amount, corrected in replacements:
        report = report[: amount.start] + corrected + report[amount.end :]
    return report


def _load(path):
    with open(path, encoding="utf-8") as handle:
        return handle.read()


def main(argv):
    if not argv:
        print(__doc__)
        return 2
    command = argv[0]
    rest = argv[1:]
    ledger_path = None
    out_path = None
    files = []
    index = 0
    while index < len(rest):
        if rest[index] == "--ledger":
            ledger_path = rest[index + 1]
            index += 2
        elif rest[index] == "--out":
            out_path = rest[index + 1]
            index += 2
        else:
            files.append(rest[index])
            index += 1

    if command == "build":
        events = json.loads(_load(files[0])) if files else []
        ledger = build_ledger(events)
        payload = json.dumps(ledger.to_dict(), ensure_ascii=False, indent=2)
        if out_path:
            with open(out_path, "w", encoding="utf-8") as handle:
                handle.write(payload)
        else:
            print(payload)
        return 0

    if not ledger_path:
        print("--ledger is required", file=sys.stderr)
        return 2
    ledger = Ledger.from_dict(json.loads(_load(ledger_path)))
    report = _load(files[0]) if files else _load("/dev/stdin")
    verdict = verify_report(report, ledger)

    if command == "correct":
        corrected = apply_corrections(report, verdict)
        for amount, replacement in verdict.corrections:
            print(f"[evidence] rättat {amount.text} -> {replacement}", file=sys.stderr)
        for amount in verdict.unknown_amounts:
            print(f"[evidence] belopp saknar källa: {amount.text}", file=sys.stderr)
        for identifier in verdict.unknown_ids:
            print(f"[evidence] id saknar källa: {identifier}", file=sys.stderr)
        sys.stdout.write(corrected)
        return 0 if verdict.ok else 1

    for amount, replacement in verdict.corrections:
        print(f"[evidence] rättningsbart: {amount.text} -> {replacement}", file=sys.stderr)
    for amount in verdict.unknown_amounts:
        print(f"[evidence] belopp saknar källa: {amount.text}", file=sys.stderr)
    for identifier in verdict.unknown_ids:
        print(f"[evidence] id saknar källa: {identifier}", file=sys.stderr)
    return 1 if not verdict.ok else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
