---
name: context-migrate
description: "Upgrade a repo's .vibehub/ data from an older VibeHub format to the current one. Use only when Victor asks to write context in a repo whose compatibility check says MIGRATION_REQUIRED."
disable-model-invocation: true
---

# Context migrate

Upgrading restructures the data in place. It isn't a compatibility layer. Current versions are in `context-core/contracts/versions.json`, and the steps for each version are in `references/migrations.json`. `vh` is the helper in **context-core**.

Reads never need this: **context-query** works at any format. Migrate only when Victor wants to write context in an old-format repo. Migration rewrites checked-in files, so first tell Victor what it will touch and get his OK.

1. Run `vh project compatibility --repo <root>`.
   - `MIGRATION_REQUIRED`: find the path in `references/migrations.json`.
   - `UNSUPPORTED_NEWER`: stop. Never guess a downgrade.
2. Read each applicable entry's `mechanical.declared_paths` and `semantic.steps`. Show Victor the scope and get his OK.
3. Run the mechanical half, for this exact worktree only:

   ```text
   vh project migrate-mechanical --repo <root>
   ```

   Review `changed_paths`, `applied_migrations`, and `pending_semantic_steps`. It never commits, pushes, or touches other worktrees.
4. Do each returned semantic step, following its `purpose`, `good_value`, `forbidden_shortcuts`, and `instructions`.
   - Placement follows `context-record/references/knowledge-governance.json`.
   - Use **context-rooms** when a step calls for a Room tree.
   - Skip steps that only concern Tickets, Goals, Epics, Evidence, or Outcomes. vstack doesn't use them, and their files stay as they are.
5. Prove the result: `vh project compatibility` is `CURRENT`, `vh project validate` passes, and `vh room drift` is honest about what's left.
6. Leave the diff to normal Git review. Commit it as `chore(context): migrate .vibehub to format N`.

Never convert in the background. Never scan sibling worktrees. Never stash, reset, or push.
