# vstack

Victor's agent skills for Claude Code. vstack began as a layer on [pstack](https://github.com/cursor/plugins/tree/main/pstack) and now carries its own fork of it (see `NOTICE.md`, MIT). `poteto-mode` sets the base workflow. `vstack-mode` adds Victor's principles and wins where they conflict. Issue #21 tracks turning the two into one.

## Install

```bash
./install.sh
```

The script symlinks every skill into `~/.claude/skills/` and every agent into `~/.claude/agents/`, and registers `hooks/session.sh` so every session starts in poteto-mode and then reads `vstack-mode`. If an old pstack install is present, it moves `~/.claude/pstack` and the copied skills into `~/.claude/vstack-backup/<time>/` and removes pstack's hook. Nothing syncs from upstream anymore.

## Skills

The forked pstack skills (`poteto-mode`, its playbooks, `principle-*` leaves, `architect`, `unslop`, and the rest) are listed in `NOTICE.md`. vstack's own:

| Skill | Applies when |
|---|---|
| `vstack-mode` | Every session. Sizes the process to the task, makes multi-agent fan-out opt-in, and indexes vstack principles. |
| `principle-earn-every-test` | Adding, expanding, or editing a test. Write the fewest tests that catch real bugs. |
| `principle-proposals-become-issues` | Proposing work outside the current change. File a `proposed` issue. Only `approved` issues are real work. |
| `principle-keep-the-architecture-map` | Every task in a project. Keep a root `ARCHITECTURE.md` that matches the code, updated in the same change. |
| `principle-commit-and-merge-cadence` | Starting a task, committing, pushing, branching, stacking, merging. Where to work, when each step happens, and what must hold before a merge. |
| `principle-grow-boundaries-on-demand` | Adding an abstraction, layer, module, or service. Modules first, abstract on the second use, split services only for a named reason. |
| `principle-ui-from-victor-ui` | Writing a new UI component. Start from Victor's gallery through the victor-ui MCP, adapt, verify the render. |
| `principle-design-floor` | Building or showing any UI. Nine things Victor never wants to see, a screenshot check before showing, and a complaint log that grows the floor. |
| `context-query` | Before working in a repo with `.vibehub/`, and for why-questions. Reads recorded context from its Rooms. |
| `context-record` | Victor says 记一下, or confirms merge-time candidates. Writes one claim per document into the owning Room. |
| `context-setup`, `context-rooms`, `context-migrate` | Setting up `.vibehub/` (shared, committed), building the Room tree, upgrading an old format. |
| `context-core` | Not invoked. The `vh.mjs` helper and schemas, copied from [VibeHub](https://github.com/VW-ai/vibehub-plugin) `fe01e819` (Apache-2.0), context layer only. |
| `housekeep` | Only when you type `/housekeep`. Audits branches, worktrees, and PRs in the current repo, sorts uncommitted work into pushed branches once you confirm, fixes what is safe, reports the rest. |

## Hooks and templates

- `hooks/session.sh` with `hooks/session.md`. Claude Code `SessionStart` and `UserPromptSubmit` hook. It injects the Claude Code host mappings and turns on poteto-mode and vstack-mode.
- `hooks/arch-map-check.sh`. Claude Code `PreToolUse` hook that `install.sh` registers. In Victor's repos, it blocks an agent's `git commit` that changes the project's structure without touching `ARCHITECTURE.md`. A commit can pass with the trailer `Arch-Map: unchanged — <reason>`.
- `templates/ARCHITECTURE.md`. The starting point for every project's architecture map.

`install.sh` also links this repo to `~/.claude/vstack` so both have a stable path.

## Issues

Agents file proposals here with the `proposed` label. Add `approved` to green-light one.
