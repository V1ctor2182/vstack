# Architecture: vstack

> Last verified against code: 2026-11-18 (commit 5fbff69 plus the context-layer change)

## Purpose

Victor's agent skills for Claude Code, layered on top of pstack's poteto-mode. Each session loads vstack-mode after poteto-mode. vstack-mode adds Victor's principles and process sizing, and wins where the two conflict. The context-* skills are Victor's project context layer: decisions, constraints, and docs recorded as Git-tracked Rooms under each repo's `.vibehub/`.

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
  mode --> ctx[context-* skills]
  ctx --> vh[context-core/scripts/vh.mjs]
  vh --> rooms[(repo .vibehub/rooms)]
```

## Components

| Name | Path | Owns | Level | Why this level | Room |
|---|---|---|---|---|---|
| vstack-mode | skills/vstack-mode | ownership rule, process sizing, principle index | module | — | — |
| principles | skills/principle-* | one rule each, read on trigger | module | — | — |
| housekeep | skills/housekeep | `/housekeep` branch-health command | module | — | — |
| arch-map-check | hooks/arch-map-check.sh | blocking commits that reshape a repo without a map update | module | — | — |
| templates | templates/ | ARCHITECTURE.md skeleton | module | — | — |
| context layer | skills/context-* | recording and reading project context in `.vibehub/rooms/` | module | — | — |
| installer | install.sh | symlinks, PSTACK.md marker, hook registration | module | — | — |

## Key flows

- **Session start:** pstack's `hook.sh` injects PSTACK.md → agent reads poteto-mode → vstack marker → agent reads vstack-mode → principles read on trigger.
- **Merge:** merge cleanup → agent lists context candidates → Victor confirms → context-record → `vh context put` → `.vibehub/rooms/<room>/` committed.
- **Agent commit:** Claude Code PreToolUse → arch-map-check.sh → exit 2 with a message if the structure changed without ARCHITECTURE.md.

## Boundaries and invariants

- vstack never edits pstack's files. It only appends one marker block to the user-owned PSTACK.md.
- `install.sh` is idempotent. Rerunning it adds nothing twice.
- In repos Victor doesn't own, the hook does nothing and the project's own conventions win.
- The context layer never loads or writes VibeHub Tickets, Goals, Epics, Evidence, or Outcomes; their files in a repo stay untouched.
- arch-map-check ignores `.vibehub/`, so recording context never counts as a structural change.

## External dependencies

| Name | Used by | Adapter |
|---|---|---|
| pstack (poteto-mode) | vstack-mode | `~/.claude/skills/poteto-mode`, `~/.claude/pstack/PSTACK.md` |
| Claude Code hooks | arch-map-check | `~/.claude/settings.json` |
| GitHub via `gh` | housekeep, proposals-become-issues | `gh` CLI |
| Node.js | context layer | `node` runs `vh.mjs`, no packages |
