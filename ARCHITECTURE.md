# Architecture: vstack

> Last verified against code: 2026-11-17 (commit before "feat: ARCHITECTURE.md template and arch-map-check hook")

## Purpose

Victor's agent skills for Claude Code, layered on top of pstack's poteto-mode. Each session loads vstack-mode after poteto-mode. vstack-mode adds Victor's principles and process sizing, and wins where the two conflict.

## Diagram

```mermaid
flowchart LR
  install[install.sh] -->|symlinks| skills[skills/]
  install -->|links repo| home[~/.claude/vstack]
  install -->|appends marker| pstackmd[(~/.claude/pstack/PSTACK.md)]
  install -->|registers PreToolUse| settings[(~/.claude/settings.json)]
  pstackmd -->|session start| mode[vstack-mode]
  mode --> principles[principle-* leaves]
  settings --> hook[hooks/arch-map-check.sh]
  hook -.->|points to| template[templates/ARCHITECTURE.md]
  principles -.-> template
```

## Components

| Name | Path | Owns | Level | Why this level |
|---|---|---|---|---|
| vstack-mode | skills/vstack-mode | ownership rule, process sizing, principle index | module | — |
| principles | skills/principle-* | one rule each, read on trigger | module | — |
| housekeep | skills/housekeep | `/housekeep` branch-health command | module | — |
| arch-map-check | hooks/arch-map-check.sh | blocking commits that reshape a repo without a map update | module | — |
| templates | templates/ | ARCHITECTURE.md skeleton | module | — |
| installer | install.sh | symlinks, PSTACK.md marker, hook registration | module | — |

## Key flows

- **Session start:** pstack's `hook.sh` injects PSTACK.md → agent reads poteto-mode → vstack marker → agent reads vstack-mode → principles read on trigger.
- **Agent commit:** Claude Code PreToolUse → arch-map-check.sh → exit 2 with a message if the structure changed without ARCHITECTURE.md.

## Boundaries and invariants

- vstack never edits pstack's files. It only appends one marker block to the user-owned PSTACK.md.
- `install.sh` is idempotent. Rerunning it adds nothing twice.
- In repos Victor doesn't own, the hook does nothing and the project's own conventions win.

## External dependencies

| Name | Used by | Adapter |
|---|---|---|
| pstack (poteto-mode) | vstack-mode | `~/.claude/skills/poteto-mode`, `~/.claude/pstack/PSTACK.md` |
| Claude Code hooks | arch-map-check | `~/.claude/settings.json` |
| GitHub via `gh` | housekeep, proposals-become-issues | `gh` CLI |
