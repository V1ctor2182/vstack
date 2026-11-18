# Context layer boundary

vstack's context layer is skills plus Git-tracked YAML under `.vibehub/`, nothing else.

- **No outside state.** No database, cache, daemon, MCP server, dashboard, background capture, hook cadence, or hidden state.
- **One helper.** `context-core/scripts/vh.mjs` is dependency-free and does deterministic validation, writes, and migration. Judgment lives in the skills.
- **Git owns the rest.** History, review, concurrency, and rollback. Records are committed with the code they describe.
- **Writes are explicit.** Context is written only when Victor asks or confirms. Nothing converts, records, or syncs on its own.
- **No migration shims.** A format change restructures data in place on the same history. No compatibility layers, dual formats, or copies.

Anything beyond this boundary is a defect, not a feature.
