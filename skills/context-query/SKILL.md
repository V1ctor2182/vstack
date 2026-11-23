---
name: context-query
description: "Read recorded project context from the repo's .vibehub/ Rooms: decisions, constraints, conventions, why-questions, golden truth for a path. Use before working in a repo that has .vibehub/, and whenever a why-question about the project comes up."
disable-model-invocation: true
---

# Context query

The Room tree under `.vibehub/rooms/` is the source of truth for recorded context. There's no database or cache to refresh. `vh` is the helper in **context-core**.

## When

- At the start of work in a repo with `.vibehub/`. Read `ARCHITECTURE.md` first for the map. Then query the Rooms the task touches.
- When a why-question comes up ("why X", "what did we decide about Y").

Use the smallest query that answers the question. When the answer is implementation fact rather than recorded context, read the code instead.

## Commands

```text
vh context query --repo <root> --input <query.json>
vh context get --repo <root> --input <id.json>
vh room tree --repo <root>
```

- `query.json` takes `query`, `context_ids`, and `include_inactive`.
- `id.json` is `{"context_id":"<id>"}`.

To find which golden truth governs some paths:

```text
vh context governing --repo <root> --input <governing.json>
```

`governing.json` is `{"paths":["src/api"]}`. The result lists each active `authority` Context that covers those paths, with its canonical artifacts, `update_rules`, `validation`, and `approval`. Follow its `update_rules` before changing a canonical artifact. An empty list means nothing governs those paths.

To give the human one page of everything recorded, run `vh context page --repo <root>` and hand over the `path` it prints. The page is a static HTML file written outside the repo.

## Reply

- Report the relevant Context ids, their claims, sources, and any conflict or gap.
- Say which trust layer each answer comes from, per `context-record/references/knowledge-governance.json`.
- An empty result after `ok:true` is an honest empty. A failed envelope means unavailable, not empty.
