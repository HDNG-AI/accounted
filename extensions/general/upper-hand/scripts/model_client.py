"""Model access for Upper Hand, by route class, never by provider.

Implements section 2 of hdng-sales-agent/docs/APP-ARCHITECTURE.md in shim mode: the app asks for a
route class ("analysis", "control", ...) and this module resolves it to a model behind one gateway URL.
Today the gateway is a provider URL (Staik by default); when the HDNG Core model gateway exists, only
the environment changes. This is the only file in the extension that may know a provider URL.

Environment (all optional, defaults keep the hackathon setup working):
  HDNG_MODEL_GATEWAY_URL   OpenAI-compatible base URL. Default https://api.staik.se/v1
  HDNG_APP_TOKEN           bearer token. Falls back to STAIK_API_KEY.
  HDNG_PROVIDER_LABEL      shown in the panel. Default "Staik · SE"
  HDNG_ROUTE_ANALYSIS      model for route "analysis". Falls back to MODEL, then qwen3.6:35b-a3b
  HDNG_ROUTE_CONTROL       model for route "control".  Falls back to CONTROL_MODEL, then gemma4:31b
  HDNG_ROUTE_<CLASS>       any other route class, upper-cased

Every call returns the raw response and appends one usage event (section 5 shape) to USAGE.
"""
import json, os, sys, time, urllib.request, urllib.error

DEFAULT_GATEWAY = "https://api.staik.se/v1"
DEFAULT_ROUTES = {"analysis": "qwen3.6:35b-a3b", "control": "gemma4:31b"}
LEGACY_ENV = {"analysis": "MODEL", "control": "CONTROL_MODEL"}

USAGE = []  # usage events collected during this process, in call order


def gateway_url(env=os.environ):
    return env.get("HDNG_MODEL_GATEWAY_URL", DEFAULT_GATEWAY).rstrip("/")


def token(env=os.environ):
    t = env.get("HDNG_APP_TOKEN") or env.get("STAIK_API_KEY")
    if not t:
        raise RuntimeError("no model token: set HDNG_APP_TOKEN (or STAIK_API_KEY in shim mode)")
    return t


def provider_label(env=os.environ):
    return env.get("HDNG_PROVIDER_LABEL", "Staik · SE")


def resolve(route, env=os.environ):
    """Route class -> model id. Explicit HDNG_ROUTE_* wins, then the legacy MODEL/CONTROL_MODEL, then defaults."""
    explicit = env.get("HDNG_ROUTE_" + route.upper())
    if explicit:
        return explicit
    legacy = LEGACY_ENV.get(route)
    if legacy and env.get(legacy):
        return env[legacy]
    if route in DEFAULT_ROUTES:
        return DEFAULT_ROUTES[route]
    raise KeyError(f"unknown route class {route!r}; set HDNG_ROUTE_{route.upper()}")


def describe(env=os.environ):
    """What the panel shows: provider label and the resolved model per known route."""
    return {"provider": provider_label(env), "routes": {r: resolve(r, env) for r in DEFAULT_ROUTES}}


def usage_event(route, model, resp, duration_ms, kind="model", env=os.environ):
    u = resp.get("usage") or {}
    return {
        "app_id": "hdng.upper-hand",
        "installation_id": env.get("HDNG_INSTALLATION_ID"),
        "run_id": env.get("UH_RUN_ID"),
        "trace_id": None,
        "kind": kind,
        "route_class": route,
        "provider": provider_label(env),
        "model": model,
        "prompt_tokens": u.get("prompt_tokens"),
        "completion_tokens": u.get("completion_tokens"),
        "duration_ms": int(duration_ms),
        "cost_estimate": None,
        "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def chat(route, messages, tools=None, tool_choice=None, max_tokens=4096, temperature=None, timeout=150, attempts=6, log=sys.stderr):
    """One chat completion on the given route class. Retries with hard backoff on 429, soft on other errors."""
    model = resolve(route)
    body = {"model": model, "messages": messages, "stream": False, "max_tokens": max_tokens}
    if tools is not None:
        body["tools"] = tools
    if tool_choice is not None:
        body["tool_choice"] = tool_choice
    if temperature is not None:
        body["temperature"] = temperature
    url = gateway_url() + "/chat/completions"
    headers = {"Authorization": f"Bearer {token()}", "Content-Type": "application/json"}
    last = None
    for attempt in range(1, attempts + 1):
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers)
        t0 = time.time()
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                resp = json.loads(r.read())
            ev = usage_event(route, model, resp, (time.time() - t0) * 1000)
            USAGE.append(ev)
            print("[usage] " + json.dumps(ev, ensure_ascii=False), file=log)
            return resp
        except urllib.error.HTTPError as e:
            last = e
            if e.code == 429:  # per-key rate limit: back off hard, do not hammer
                wait = min(60 * attempt, 300)
                print(f"[retry {attempt}] 429 rate limited, waiting {wait}s", file=log); time.sleep(wait); continue
            print(f"[retry {attempt}] HTTP {e.code}", file=log); time.sleep(5 * attempt)
        except Exception as e:  # 2026-09-11: Staik stalled 300 s on two parallel ~30k-token requests, then recovered
            last = e; print(f"[retry {attempt}] {type(e).__name__}: {e}", file=log); time.sleep(5 * attempt)
    raise last
