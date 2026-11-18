# vstack

Victor's agent skills for Claude Code, layered on [pstack](https://github.com/cursor/plugins/tree/main/pstack). pstack's `poteto-mode` sets the base workflow. `vstack-mode` adds Victor's principles and wins where they conflict.

## Install

Install pstack first, then:

```bash
./install.sh
```

The script symlinks each skill into `~/.claude/skills/` and adds one line to `~/.claude/pstack/PSTACK.md` so every session reads `vstack-mode` after `poteto-mode`. pstack updates don't touch vstack skills.

## Skills

| Skill | Applies when |
|---|---|
| `vstack-mode` | Every session. Sizes the process to the task, makes multi-agent fan-out opt-in, and indexes vstack principles. |
| `principle-earn-every-test` | Adding, expanding, or editing a test. Write the fewest tests that catch real bugs. |
| `principle-proposals-become-issues` | Proposing work outside the current change. File a `proposed` issue. Only `approved` issues are real work. |
| `principle-keep-the-architecture-map` | Every task in a project. Keep a root `ARCHITECTURE.md` that matches the code, updated in the same change. |
| `principle-commit-and-merge-cadence` | Starting a task, committing, pushing, branching, stacking, merging. Where to work, when each step happens, and what must hold before a merge. |
| `principle-grow-boundaries-on-demand` | Adding an abstraction, layer, module, or service. Modules first, abstract on the second use, split services only for a named reason. |
| `principle-ui-from-victor-ui` | Writing a new UI component. Start from Victor's gallery through the victor-ui MCP, adapt, verify the render. |
| `context-query` | Before working in a repo with `.vibehub/`, and for why-questions. Reads recorded context from its Rooms. |
| `context-record` | Victor says 记一下, or confirms merge-time candidates. Writes one claim per document into the owning Room. |
| `context-setup`, `context-rooms`, `context-migrate` | Setting up `.vibehub/` (shared, committed), building the Room tree, upgrading an old format. |
| `context-core` | Not invoked. The `vh.mjs` helper and schemas, copied from [VibeHub](https://github.com/VW-ai/vibehub-plugin) `fe01e819` (Apache-2.0), context layer only. |
| `housekeep` | Only when you type `/housekeep`. Audits branches, worktrees, and PRs in the current repo, sorts uncommitted work into pushed branches once you confirm, fixes what is safe, reports the rest. |

## Hooks and templates

- `hooks/arch-map-check.sh`. Claude Code `PreToolUse` hook that `install.sh` registers. In Victor's repos, it blocks an agent's `git commit` that changes the project's structure without touching `ARCHITECTURE.md`. A commit can pass with the trailer `Arch-Map: unchanged — <reason>`.
- `templates/ARCHITECTURE.md`. The starting point for every project's architecture map.

`install.sh` also links this repo to `~/.claude/vstack` so both have a stable path.

## Issues

Agents file proposals here with the `proposed` label. Add `approved` to green-light one.
