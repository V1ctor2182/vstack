---
name: context-setup
description: "Initialize .vibehub/ in a repo so context can be recorded and committed. Use the first time context-record or context-query runs in a repo without .vibehub/, or when Victor asks to set up context."
disable-model-invocation: true
---

# Context setup

`vh` is the helper in **context-core**.

1. **Check ownership** (vstack-mode, "Whose project"). In someone else's repo, set up only if Victor asks.
2. **Check what's there.** Look for `.vibehub/`, `ARCHITECTURE.md`, `docs/`, and other memory or context folders.
   - If `.vibehub/` exists, run `vh project compatibility --repo <root>`. `MIGRATION_REQUIRED` hands off to **context-migrate**, but only if Victor wants writes. Reads through **context-query** work at any format.
   - If another context system overlaps (a `docs/decisions/` folder, a memory folder), show the paths and ask Victor: absorb it once through **context-record**'s bulk absorption, or leave it alone. Never duplicate silently.
3. **Initialize as shared**, so records are committed with the code:

   ```text
   vh project init --repo <root> --input <init.json>
   ```

   `init.json` is `{"sharing":"shared"}`. Without it, VibeHub writes a `.vibehub/.gitignore` that keeps records local, which isn't what vstack wants.
4. **Build the Room tree** with **context-rooms**. Start it from `ARCHITECTURE.md` Components, or create `ARCHITECTURE.md` first per **principle-keep-the-architecture-map**.
5. **Prove it.** Confirm `vh project compatibility` is `CURRENT`, then that `vh project validate --repo <root>` passes from a fresh process.
6. **Commit** `.vibehub/` as `chore(context): set up project context`.

Don't add VibeHub instruction blocks to `AGENTS.md` or `CLAUDE.md`. vstack-mode already tells agents when to read and record context.
