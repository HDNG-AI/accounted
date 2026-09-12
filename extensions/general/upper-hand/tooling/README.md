# Tooling for working on Upper Hand

- `claude/`: permissions (`settings.json`), the read-only `reviewer` subagent, and the `/review`, `/retro`, `/handoff` commands. Copy `agents/` and `commands/` into the repo root `.claude/` (Accounted already has `.claude/skills` and `.claude/rules`); merge `settings.json` into `.claude/settings.local.json`.
- `opencode/`: `opencode.json` for Staik (`{env:STAIK_API_KEY}`), the `reviewer` agent and the same three commands. Copy to the repo root if you use OpenCode.

Secrets never go in the repo: `STAIK_API_KEY` and `ACCOUNTED_API_KEY` live in `extensions/general/upper-hand/.env` (gitignored).
