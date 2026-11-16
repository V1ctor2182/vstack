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

## Issues

Agents file proposals here with the `proposed` label. Add `approved` to green-light one.
