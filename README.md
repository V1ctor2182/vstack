# vstack

Victor's agent skills for Claude Code. vstack began as a layer on [pstack](https://github.com/cursor/plugins/tree/main/pstack) and is now its own rulebook (see `NOTICE.md`, MIT). Every session reads one file, `vstack-mode`. It sizes the process to the task, says when to ask, and indexes the principles, playbooks, and skills.

## Install

```bash
./install.sh
```

The script symlinks every skill into `~/.claude/skills/` and every agent into `~/.claude/agents/`, removes its own links to skills it no longer has, and registers `hooks/session.sh` so every session starts in `vstack-mode`. `vstack-mode` also points to Victor's own tools: the tool factory (`factory`, `writing-style`), victor-ui, and artifact-index. The script does not install those. It ends by checking them and printing the fix for each one that is missing. `./install.sh --check` runs only the check.

## Skills

The skills that came from pstack are listed in `NOTICE.md`. vstack's own:

| Skill | Applies when |
|---|---|
| `vstack-mode` | Every session. The one rulebook: process sizing, when to ask, Victor's tools, and the index of principles, playbooks, and skills. |
| `principle-earn-every-test` | Adding, expanding, or editing a test. Write the fewest tests that catch real bugs. |
| `principle-proposals-become-issues` | Proposing work outside the current change. File a `proposed` issue. Only `approved` issues are real work. |
| `principle-keep-the-architecture-map` | A repo that has an `ARCHITECTURE.md`. Keep it matching the code, updated in the same change. |
| `principle-commit-and-merge-cadence` | Starting a task, committing, pushing, branching, stacking, merging. Where to work, when each step happens, and what must hold before a merge. |
| `principle-grow-boundaries-on-demand` | Adding an abstraction, layer, module, or service. Modules first, abstract on the second use, split services only for a named reason. |
| `principle-ui-from-victor-ui` | Writing a new UI component. Start from Victor's gallery through the victor-ui MCP, adapt, verify the render. |
| `principle-design-floor` | Building or showing any UI. Nine things Victor never wants to see, a screenshot check before showing, and a complaint log that grows the floor. |
| `context-query` | Before working in a repo with `.vibehub/`, and for why-questions. Reads recorded context from its Rooms. |
| `context-record` | Victor says 记一下, or confirms merge-time candidates. Writes one claim per document into the owning Room. |
| `context-setup`, `context-rooms`, `context-migrate` | Setting up `.vibehub/` (shared, committed), building the Room tree, upgrading an old format. |
| `context-core` | Not invoked. The `vh.mjs` helper and schemas, copied from [VibeHub](https://github.com/VW-ai/vibehub-plugin) `fe01e819` (Apache-2.0), context layer only. |
| `housekeep` | Only when you type `/housekeep`. Audits branches, worktrees, and PRs in the current repo, sorts uncommitted work into pushed branches once you confirm, fixes what is safe, reports the rest. |

## Checks

`node scripts/lint.mjs` fails when a skill or playbook names a skill, section, or file that does not exist, when frontmatter `name` differs from the folder, when `vstack-mode` passes 150 lines, when a skill is in no index, and when the session hook prints nothing. CI runs it with the script tests on every pull request.

Each rule a check enforces. A rule not in this table is prose only, so nothing fails when an agent skips it. When an agent repeats a prose-only mistake, add a row here rather than more words (**correct**).

| Rule | Enforced by |
|---|---|
| Every skill, playbook, section, and link a file names exists | `scripts/lint.mjs` |
| Frontmatter `name` matches the folder | `scripts/lint.mjs` |
| `vstack-mode` stays within 150 lines | `scripts/lint.mjs` |
| Every skill is in an index | `scripts/lint.mjs` |
| The session hook turns vstack-mode on | `scripts/lint.mjs` |
| A commit that reshapes a repo with an `ARCHITECTURE.md` updates it | `hooks/arch-map-check.sh` |
| Playbook helper scripts behave as tested | CI |

## Hooks and templates

- `hooks/session.sh` with `hooks/session.md`. Claude Code `SessionStart` and `UserPromptSubmit` hook. It turns on vstack-mode.
- `hooks/arch-map-check.sh`. Claude Code `PreToolUse` hook that `install.sh` registers. In Victor's repos that have an `ARCHITECTURE.md`, it blocks an agent's `git commit` that changes the project's structure without touching it. A commit can pass with the trailer `Arch-Map: unchanged — <reason>`.
- `templates/ARCHITECTURE.md`. The starting point for every project's architecture map.
- `templates/issues/`. The `type:feature` and `type:bug` issue bodies, and the plan comment posted before code.

`install.sh` also links this repo to `~/.claude/vstack` so both have a stable path.

## Issues

Agents file proposals here with the `proposed` label. Add `approved` to green-light one.
