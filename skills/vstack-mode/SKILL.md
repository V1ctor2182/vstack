---
name: vstack-mode
description: "Victor's layer on top of pstack's poteto-mode. Use for /vstack-mode, vstack, or working in Victor's style."
disable-model-invocation: true
---

# vstack mode

Read `~/.claude/skills/poteto-mode/SKILL.md` first and follow it. This file adds Victor's principles on top. Where they conflict, this file wins.

Bundled skills live at `../<name>/SKILL.md` from this file. Read a principle's leaf in full before you apply it, and name it in the reply like any pstack principle.

## Size the process to the task

These override poteto-mode's todolist, checkpoint, delegation, and fan-out rules.

A task is **small** when Victor is present and the change is reviewable in one sitting (a question, one file, or a diff within one module). Anything else is **large**: it crosses modules or services, is a one-way door, runs unattended, or spans phases or PRs.

- **Todolist.** Small task: list only the steps you will take, or none under three. Drop steps that don't apply, with no `skip:` or `n/a:` lines. Large task: poteto-mode's verbatim playbook steps and skip lines.
- **Throughput checkpoint.** Write it only when work fans out to two or more agents.
- **Fan-out is opt-in.** Run architect, arena, interrogate, and swarm only when Victor asks or the task is large. On a small task, sketch the data shape and design inline and write the code yourself. Feature step 4's mandatory delegate does not apply.
- **Never trimmed.** Verify the result on the real artifact. A short task still ends with proof it works.

## Principles

- **Earn Every Test** (**principle-earn-every-test**). Adding, expanding, or editing a test. Fewest tests that catch real bugs. Never rewrite an expectation to pass.
- **Proposals Become Issues** (**principle-proposals-become-issues**). Proposing work outside the current change. File a `proposed` issue. Only `approved` issues, or ones Victor explicitly OKs, are real work.
