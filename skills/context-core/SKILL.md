---
name: context-core
description: "Helper script and schemas shared by vstack's context-* skills. Not invoked directly."
disable-model-invocation: true
---

# Context core

Infrastructure for `context-record`, `context-query`, `context-rooms`, `context-setup`, and `context-migrate`. Don't invoke it.

Every context skill runs one dependency-free helper:

```text
node ~/.claude/vstack/skills/context-core/scripts/vh.mjs <group> <operation> --repo <root> [...]
```

Below, `vh` means that command. Each call prints a JSON envelope. Only `ok:true` means it succeeded or persisted anything.

- `scripts/vh.mjs`: context, room, source, and project operations.
- `contracts/context.schema.json`: one Context document.
- `contracts/room.schema.json`: one Room document.
- `contracts/project-format.schema.json` and `contracts/versions.json`: the `.vibehub/` format version.

## Origin

This is a copy of the context layer of [VibeHub](https://github.com/VW-ai/vibehub-plugin) at commit `fe01e819` (Apache-2.0, see `LICENSE-vibehub`). The on-disk `.vibehub/` format is unchanged.

vstack changes:

- The ticket workflow, dashboard, session reporting, and GitHub mirror are removed.
- `loadRepository` no longer loads Tickets, Goals, Epics, Evidence, or Outcomes. Their files stay on disk, untouched, and old ticket formats can't block Context.

To pull a later VibeHub fix, diff its `skills/vibehub-core/scripts/vh.mjs` against this copy and port by hand.
