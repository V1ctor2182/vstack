---
name: vstack-mode
description: "Victor's layer on top of pstack's poteto-mode. Use for /vstack-mode, vstack, or working in Victor's style."
disable-model-invocation: true
---

# vstack mode

Read `~/.claude/skills/poteto-mode/SKILL.md` first and follow it. This file adds Victor's principles on top. Where they conflict, this file wins.

Bundled skills live at `../<name>/SKILL.md` from this file. Read a principle's leaf in full before you apply it, and name it in the reply like any pstack principle.

## Whose project

Check ownership at the start of work in a repo: `gh repo view --json owner -q .owner.login`. A repo with no remote counts as Victor's.

- **Victor's repo** (owner `V1ctor2182`). vstack's rules govern, including git workflow, repo settings, and files like `ARCHITECTURE.md`.
- **Someone else's repo.** The project's conventions govern. Read its `CONTRIBUTING.md`, `CLAUDE.md` or `AGENTS.md`, PR template, and recent `git log`, and match its branch names, commit style, PR size, and merge method. Where they conflict with vstack, the project wins. Never change its repo settings, merge, delete branches other than Victor's own, or add files like `ARCHITECTURE.md` unasked. File proposals for Victor in `V1ctor2182/vstack`, not in the project's tracker. vstack's rules still apply to how you work: sizing, tests you write, and verification.

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
- **Keep the Architecture Map** (**principle-keep-the-architecture-map**). Every task in a project, and every change that reshapes it. Read `ARCHITECTURE.md` first. Update it in the same change when components, boundaries, data flow, or dependencies change.
- **Commit and Merge Cadence** (**principle-commit-and-merge-cadence**). Starting a task, committing, pushing, branching, opening or stacking a PR, or merging. Pick and name where to work (same branch, new branch, or a worktree at `~/victor/<repo>-<topic>`), commit each verified unit, push before stopping, stack only on real dependencies, merge only when verified and rebased.
- **Grow Boundaries on Demand** (**principle-grow-boundaries-on-demand**). Adding an abstraction, layer, module, package, or service. Modules first, abstract on the second use, split a service only for a named reason.
- **UI from victor-ui** (**principle-ui-from-victor-ui**). About to write a new UI component. Search Victor's gallery through the victor-ui MCP, inspect, adapt, verify the render, and name what you used.
- **Design Floor** (**principle-design-floor**). Building or restyling any UI, before showing Victor a UI, and when he calls one ugly, cheap, or AI-ish. Keep the nine floor lines, screenshot-check before showing, and log his complaints so the floor grows.

## Project context

Recorded context (decisions, constraints, conventions, docs) lives in Git-tracked Rooms under `.vibehub/rooms/`. `ARCHITECTURE.md` is the one-page map that links to them.

- **context-query.** Before working in a repo with `.vibehub/`, query the Rooms the task touches. Also use it for any why-question.
- **context-record.** Write context when Victor says 记一下 or remember, or when he confirms merge-time candidates. Never record on your own.
- **context-setup**, **context-rooms**, **context-migrate.** Use these to set up a repo, build its Room tree, or upgrade an old format. Migrate only with Victor's OK.
- **Never create VibeHub Tickets, Goals, or Epics.** Work goes in GitHub issues (Proposals Become Issues).

## Commands

- `/housekeep`. Victor runs it to check and restore branch health in the current repo, including sorting uncommitted work into pushed branches after he confirms. Never run it unasked.
