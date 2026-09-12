#!/usr/bin/env bash
# Keep the panel live: run the given personas one at a time, forever, with a pause between rounds.
# Usage: bash extensions/general/upper-hand/scripts/live.sh [pause_seconds] [persona ...]
# Defaults: 120 s pause, personas "auditor dd-analyst". Logs to /tmp/upper-hand-live/<persona>-<timestamp>.{out,err}.
set -u
PAUSE="${1:-120}"; shift || true
PERSONAS=("$@"); [ ${#PERSONAS[@]} -eq 0 ] && PERSONAS=(auditor dd-analyst)
KIT="${UPPER_HAND_KIT:-$(cd "$(dirname "$0")/.." && pwd)}"
mkdir -p /tmp/upper-hand-live
echo "live loop: ${PERSONAS[*]} · pause ${PAUSE}s · kit $KIT" | tee -a /tmp/upper-hand-live/loop.log
while true; do
  for p in "${PERSONAS[@]}"; do
    ts=$(date +%Y%m%d-%H%M%S)
    echo "$(date '+%H:%M:%S') start $p" | tee -a /tmp/upper-hand-live/loop.log
    (cd "$KIT" && set -a && source .env && set +a && python3 scripts/persona-smoke.py "$p" 20 > "/tmp/upper-hand-live/$p-$ts.out" 2> "/tmp/upper-hand-live/$p-$ts.err")
    echo "$(date '+%H:%M:%S') done  $p: $(grep -E '^\[total\]' "/tmp/upper-hand-live/$p-$ts.err" | tail -1)" | tee -a /tmp/upper-hand-live/loop.log
    sleep "$PAUSE"
  done
done
