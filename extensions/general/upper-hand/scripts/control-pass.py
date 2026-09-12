#!/usr/bin/env python3
"""Control and language pass (gemma4 by default) over an analysis report from the persona loop.

Usage: python3 scripts/control-pass.py <report.txt> [--json]
Env: CONTROL_MODEL (default gemma4:31b), STAIK_API_KEY from .env.

One model call with a strict output contract:
1. Splits the analysis into findings and checks each for evidence ids (voucher numbers or ids, document ids),
   a severity, a closing action with owner and date, and forbidden intent vocabulary.
2. Marks each finding godkänt | nedgraderat | avvisat with a one-line reason. Never adds findings.
3. Rewrites approved and downgraded findings as clean Swedish for the end user.
Then a deterministic gate: only Latin script, no English filler, no intent words, no exclamation marks.
Exit code 2 if the gate fails, so a pipeline stops before anything reaches a user.
"""
import json, os, re, sys, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import evidence_ledger

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for line in open(os.path.join(ROOT, ".env")):
    if "=" in line and not line.startswith("#"):
        k, v = line.strip().split("=", 1); os.environ.setdefault(k, v)
STAIK = os.environ["STAIK_API_KEY"]
MODEL = os.environ.get("CONTROL_MODEL", "gemma4:31b")

SYSTEM = """You are the control and language step of a review panel for Swedish company ledgers. You receive an analysis written by another model. You never add findings and never soften evidence. Your job:

1. For every finding in the analysis, decide:
   - godkänt: it names concrete evidence (voucher numbers like A:124 or ids, document ids, amounts, dates), a severity (info | attention | blocking), and what closes it.
   - nedgraderat: evidence is present but the severity is not justified by the finding's own facts, or the closing action lacks owner or date. State the corrected severity.
   - avvisat: no concrete evidence, or the finding asserts intent (fraud, embezzlement, misconduct, bedrägeri, förskingring, oegentlighet, uppsåt), or it contradicts the evidence it cites.
2. Rewrite the approved and downgraded findings for the end user in Swedish: correct, plain business Swedish, no anglicisms, no exclamation marks, no superlatives, only Latin letters, thousands separated by space (25 000 kr), dates YYYY-MM-DD, percent with a space. Keep every id, amount and date exactly as in the analysis. Describe deviations and patterns, never intent.

Return ONLY this JSON, nothing else:
{"kontroll":[{"nr":1,"rubrik":"...","status":"godkänt|nedgraderat|avvisat","allvar":"info|attention|blocking","skal":"..."}],
 "rapport_sv":"...markdown in Swedish, one section per approved or downgraded finding, then a section Ej verifierat..."}"""

def chat(messages):
    body = {"model": MODEL, "messages": messages, "stream": False, "max_tokens": 6000, "temperature": 0.1}
    req = urllib.request.Request("https://api.staik.se/v1/chat/completions", data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {STAIK}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=240) as r: return json.loads(r.read())

ALLOWED = re.compile(r"[\x09\x0A\x0D\x20-\x7E -ɏ‐-‧‰-⁞€→≤≥×…]")
def gate(text):
    problems = []
    foreign = sorted(set(ch for ch in text if not ALLOWED.match(ch)))
    if foreign: problems.append(f"främmande tecken: {foreign[:8]}")
    if re.search(r"\b(the|and|with|because|however|finding|evidence)\b", text): problems.append("engelska ord i användartext")
    if re.search(r"\b(bedrägeri|förskingring|oegentlighet|uppsåt|fraud|embezzl)", text, re.I): problems.append("avsiktsvokabulär")
    if "!" in text: problems.append("utropstecken")
    return problems

def main():
    argv = sys.argv[1:]
    ledger = None
    if "--ledger" in argv:
        i = argv.index("--ledger")
        with open(argv[i + 1], encoding="utf-8") as fh:
            ledger = evidence_ledger.Ledger.from_dict(json.load(fh))
        del argv[i:i + 2]
    path = argv[0]; want_json = "--json" in argv
    analysis = open(path, encoding="utf-8").read()

    ledger_note = ""
    if ledger is not None:
        pre = evidence_ledger.verify_report(analysis, ledger)
        for amount, replacement in pre.corrections:
            print(f"[evidence] rättat {amount.text} -> {replacement}", file=sys.stderr)
        if pre.corrections:
            analysis = evidence_ledger.apply_corrections(analysis, pre)
        if pre.unknown_amounts or pre.unknown_ids:
            for amount in pre.unknown_amounts:
                print(f"[evidence] belopp saknar källa: {amount.text}", file=sys.stderr)
            for identifier in pre.unknown_ids:
                print(f"[evidence] id saknar källa: {identifier}", file=sys.stderr)
            print("[control] evidence gate failed before the model call", file=sys.stderr)
            sys.exit(2)
        ledger_note = (
            "\n\nLiggare, hämtad ur verktygssvaren. Varje belopp, datum och id i rapporten "
            "måste finnas här. En siffra som inte finns i liggaren får inte stå kvar: markera "
            "fyndet nedgraderat med skalet \"belopp saknar källa\" och rätta siffran bara om "
            "liggaren är entydig.\nid: "
            + " ".join(sorted(ledger.ids))
            + "\nbelopp: "
            + ", ".join(sorted(set(ledger.digits.values())))
        )

    resp = chat([{"role": "system", "content": SYSTEM}, {"role": "user", "content": "Analys att kontrollera:\n\n" + analysis + ledger_note}])
    content = resp["choices"][0]["message"]["content"] or ""
    u = resp.get("usage", {})
    content = re.sub(r"^\s*```(?:json)?\s*|\s*```\s*$", "", content.strip())
    m = re.search(r"\{.*\}", content, re.S)
    if not m: print("[control] no JSON in reply", file=sys.stderr); print(content[:2000]); sys.exit(3)
    raw = m.group(0)
    try: data = json.loads(raw, strict=False)   # gemma4 puts raw newlines inside the markdown string
    except json.JSONDecodeError:
        # gemma4 sometimes emits `],"\n "rapport_sv"` (a stray quote after the array). Repair, then fall back to field extraction.
        fixed = re.sub(r'\],\s*"\s*\n\s*"rapport_sv"', '],"rapport_sv"', raw)
        try: data = json.loads(fixed, strict=False)
        except json.JSONDecodeError as e:
            km = re.search(r'"kontroll"\s*:\s*(\[.*?\])\s*,', raw, re.S); rm = re.search(r'"rapport_sv"\s*:\s*"(.*)"\s*\}\s*$', raw, re.S)
            if not (km and rm): print(f"[control] bad JSON: {e}", file=sys.stderr); print(content[:2000]); sys.exit(3)
            try: kontroll = json.loads(km.group(1), strict=False)
            except json.JSONDecodeError: kontroll = []
            data = {"kontroll": kontroll, "rapport_sv": rm.group(1).replace('\\n', '\n').replace('\\"', '"')}
            print("[control] JSON repaired by field extraction", file=sys.stderr)
    k = data.get("kontroll", [])
    # gemma4 occasionally swaps digits to Arabic-Indic or Persian numerals; that is a deterministic fix, not a language failure
    digits = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹", "01234567890123456789")
    rep = data.get("rapport_sv", "")
    if rep != rep.translate(digits): print("[control] normalised non-ASCII digits in the report", file=sys.stderr); rep = rep.translate(digits); data["rapport_sv"] = rep
    problems = gate(rep)
    if ledger is not None:
        post = evidence_ledger.verify_report(rep, ledger)
        for amount, replacement in post.corrections:
            print(f"[evidence] rättat {amount.text} -> {replacement}", file=sys.stderr)
        if post.corrections:
            rep = evidence_ledger.apply_corrections(rep, post)
            data["rapport_sv"] = rep
        for amount in post.unknown_amounts:
            problems.append(f"belopp saknar källa: {amount.text}")
        for identifier in post.unknown_ids:
            problems.append(f"id saknar källa: {identifier}")
    print(f"[control] model={MODEL} prompt={u.get('prompt_tokens')} completion={u.get('completion_tokens')} findings={len(k)} "
          f"godkänt={sum(1 for x in k if x.get('status')=='godkänt')} nedgraderat={sum(1 for x in k if x.get('status')=='nedgraderat')} "
          f"avvisat={sum(1 for x in k if x.get('status')=='avvisat')} gate={'OK' if not problems else 'FAIL ' + '; '.join(problems)}", file=sys.stderr)
    if want_json: print(json.dumps(data, ensure_ascii=False, indent=2))
    else:
        for x in k: print(f"- [{x.get('status')}] {x.get('rubrik')} · {x.get('allvar')} · {x.get('skal')}")
        print("\n---\n"); print(data.get("rapport_sv", ""))
    sys.exit(2 if problems else 0)

if __name__ == "__main__": main()
