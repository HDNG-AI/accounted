#!/usr/bin/env python3
"""Unit tests for evidence_ledger.py. Run: python3 scripts/test_evidence_ledger.py"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from evidence_ledger import (  # noqa: E402
    Ledger,
    apply_corrections,
    build_ledger,
    extract_amounts,
    extract_ids,
    format_amount,
    parse_amount,
    verify_report,
)


class ParseAmountTest(unittest.TestCase):
    def test_space_thousands(self):
        value, digits, decimals = parse_amount("396 875")
        self.assertEqual(value, 396875.0)
        self.assertEqual(digits, "396875")
        self.assertEqual(decimals, 0)

    def test_comma_decimals(self):
        value, digits, decimals = parse_amount("341 170,00")
        self.assertEqual(value, 341170.0)
        self.assertEqual(digits, "341170")
        self.assertEqual(decimals, 2)

    def test_plain_integer(self):
        self.assertEqual(parse_amount("10625")[0], 10625.0)

    def test_invalid(self):
        self.assertIsNone(parse_amount("abc"))


class FormatAmountTest(unittest.TestCase):
    def test_grouping(self):
        self.assertEqual(format_amount(396875.0, 0), "396 875")

    def test_decimals(self):
        self.assertEqual(format_amount(341170.0, 2), "341 170,00")


class ExtractionTest(unittest.TestCase):
    def test_amounts_skip_ids_and_dates(self):
        text = "Verifikat A:124 den 2026-05-01 uppgår till 396 875 kr, dokument dok abc123def456."
        values = {a.text for a in extract_amounts(text)}
        self.assertIn("396 875", values)
        self.assertNotIn("124", values)
        self.assertNotIn("2026-05-01", values)

    def test_extract_ids(self):
        ids = extract_ids("A:124 2026-05-01 F-20260011 dok abc123def456")
        self.assertIn("A:124", ids)
        self.assertIn("2026-05-01", ids)
        self.assertIn("F-20260011", ids)
        self.assertIn("dok abc123def456", ids)


class LedgerTest(unittest.TestCase):
    def test_build_from_events(self):
        events = [
            {"tool": "query_journal", "content": "12 fakturor · 396 875 kr · A:294"},
            {"tool": "get_kpi_summary", "content": "341170.00 SEK"},
        ]
        ledger = build_ledger(events)
        self.assertIn(396875.0, ledger.values)
        self.assertIn(341170.0, ledger.values)
        self.assertIn("A:294", ledger.ids)

    def test_transposition_is_corrected(self):
        ledger = build_ledger([{"content": "reskontra 396 875 kr"}])
        verdict = verify_report("Summan är 396 857 kr.", ledger)
        self.assertEqual(verdict.unknown_amounts, [])
        self.assertEqual(len(verdict.corrections), 1)
        corrected = apply_corrections("Summan är 396 857 kr.", verdict)
        self.assertEqual(corrected, "Summan är 396 875 kr.")

    def test_uncorrectable_amount_is_unknown(self):
        ledger = build_ledger([{"content": "reskontra 396 875 kr"}])
        verdict = verify_report("Summan är 123 456 kr.", ledger)
        self.assertEqual([a.text for a in verdict.unknown_amounts], ["123 456"])
        self.assertFalse(verdict.ok)

    def test_ambiguous_correction_stays_unknown(self):
        ledger = build_ledger([{"content": "396 587 och 396 875"}])
        verdict = verify_report("Summan är 396 857 kr.", ledger)
        self.assertEqual([a.text for a in verdict.unknown_amounts], ["396 857"])

    def test_unknown_id_flagged(self):
        ledger = build_ledger([{"content": "verifikat A:1"}])
        verdict = verify_report("Se A:999.", ledger)
        self.assertIn("A:999", verdict.unknown_ids)
        self.assertFalse(verdict.ok)

    def test_ok_when_everything_sourced(self):
        ledger = build_ledger([{"content": "A:294 · 396 875 kr · 2026-05-01"}])
        report = "A:294 visar 396 875 kr per 2026-05-01."
        verdict = verify_report(report, ledger)
        self.assertTrue(verdict.ok)

    def test_roundtrip(self):
        ledger = build_ledger([{"content": "396 875 kr A:294"}])
        restored = Ledger.from_dict(ledger.to_dict())
        self.assertTrue(restored.knows_value(extract_amounts("396 875")[0]))
        self.assertIn("A:294", restored.ids)


if __name__ == "__main__":
    unittest.main(verbosity=2)
