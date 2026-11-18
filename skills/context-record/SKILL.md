---
name: context-record
description: "Record durable project context (decisions, constraints, conventions, intent, docs) into the repo's .vibehub/ Rooms. Use when Victor says 记一下 / remember / record this, when he confirms merge-time candidates, or when he hands over documents to absorb."
disable-model-invocation: true
---

# Context record

Durable context is what the next session needs and can't read from the code: why a choice was made, a constraint, a convention, a product decision, the gist of a doc. Write it as small Git-tracked YAML in the Room that owns it. `vh` is the helper in **context-core**.

## When

- Victor asks: "记一下", "remember this", "record".
- **At merge time.** Per **principle-commit-and-merge-cadence**, list the candidate context from the merged change, at most five lines, each one claim. Victor confirms in one reply. Write only what he confirms.
- Victor hands over whole documents to absorb. Follow `references/bulk-absorption.md`.

Never record on your own initiative, and never record filler: acknowledgements, progress notes, or what the diff already shows.

## Context or work?

A decision, constraint, convention, intent, or explanation is Context. A deliverable to build is work. Work becomes a GitHub issue (**principle-proposals-become-issues**), never a Ticket.

## Write

1. If the repo has no `.vibehub/`, run **context-setup** first.
2. Query what exists, so you extend or relate to it instead of duplicating it:

   ```text
   vh context query --repo <root> --input <query.json>
   ```

3. Write one atomic document per claim, following `context-core/contracts/context.schema.json`. Keep the exact source ref (commit, PR, file, or "Victor in chat, <date>") and a short exact quote when useful. Every document needs readable evidence.
4. Pick the owning Room by the placement rule in `references/knowledge-governance.json`: the lowest Room that owns it, or the lowest common ancestor for a claim that spans Rooms. If no Room fits, run **context-rooms** first. Then write:

   ```text
   vh context put --repo <root> --room <room path> --input <context.json>
   ```

5. Report the Context id and path only after `ok:true`. Commit the `.vibehub/` change with the code change it describes, or in its own `docs(context):` commit at merge time.

## Authority Context

When Victor names golden truth that code must follow (a contract, a rule set, a schema), write `type: authority` with an `authority` object:

- `governs`: territory, in Room anchor syntax.
- `canonical`: the current repo paths of the artifacts, never under `.vibehub/`.
- `update_rules`: the steps to follow before a canonical artifact changes.
- `validation`: the checks that keep code and context consistent.
- `approval: human`, only when Victor reserves the change.

The system-wide map stays in `ARCHITECTURE.md` (**principle-keep-the-architecture-map**). Authority Context is for per-Room golden truth.

## Guardrails

- Never overwrite a disagreement as if it were agreement. Record the conflict, or ask Victor.
- Don't dual-write into another docs system.
- In someone else's repo, record only if the project already uses `.vibehub/` or Victor asks.
