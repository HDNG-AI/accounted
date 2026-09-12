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
    path = sys.argv[1]; want_json = "--json" in sys.argv
    analysis = open(path, encoding="utf-8").read()
    resp = chat([{"role": "system", "content": SYSTEM}, {"role": "user", "content": "Analys att kontrollera:\n\n" + analysis}])
    content = resp["choices"][0]["message"]["content"] or ""
    u = resp.get("usage", {})
    content = re.sub(r"^\s*```(?:json)?\s*|\s*```\s*$", "", content.strip())
    m = re.search(r"\{.*\}", content, re.S)
    if not m: print("[control] no JSON in reply", file=sys.stderr); print(content[:2000]); sys.exit(3)
    try: data = json.loads(m.group(0), strict=False)   # gemma4 puts raw newlines inside the markdown string
    except json.JSONDecodeError as e: print(f"[control] bad JSON: {e}", file=sys.stderr); print(content[:2000]); sys.exit(3)
    k = data.get("kontroll", [])
    problems = gate(data.get("rapport_sv", ""))
    print(f"[control] model={MODEL} prompt={u.get('prompt_tokens')} completion={u.get('completion_tokens')} findings={len(k)} "
          f"godkänt={sum(1 for x in k if x.get('status')=='godkänt')} nedgraderat={sum(1 for x in k if x.get('status')=='nedgraderat')} "
          f"avvisat={sum(1 for x in k if x.get('status')=='avvisat')} gate={'OK' if not problems else 'FAIL ' + '; '.join(problems)}", file=sys.stderr)
    if want_json: print(json.dumps(data, ensure_ascii=False, indent=2))
    else:
        for x in k: print(f"- [{x.get('status')}] {x.get('rubrik')} · {x.get('allvar')} · {x.get('skal')}")
        print("\n---\n"); print(data.get("rapport_sv", ""))
    sys.exit(2 if problems else 0)

if __name__ == "__main__": main()
