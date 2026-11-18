---
name: context-rooms
description: "Build or realign a repo's Room tree under .vibehub/rooms/: boundaries, nesting, anchors, alignment stamps. Used by context-record, context-setup, and context-migrate when a repo has no Rooms yet or a Room drifted. Doesn't write Context."
disable-model-invocation: true
---

# Context rooms

A Room is a bounded workspace someone does coherent work in, such as a module, a product area, or a design system. It is described by `room.yaml` under `.vibehub/rooms/`. This skill owns Room shape and alignment stamps. It never writes Context; **context-record** does. `vh` is the helper in **context-core**.

## Workflow

1. Run `vh project compatibility --repo <root>`. Proceed only on `CURRENT`, unless **context-migrate** called you for a declared migration step.
2. Run `vh room drift --repo <root>`.
   - `cold_start:true`: propose a tree.
   - Otherwise: work only on Rooms that report `UNKNOWN`. A missing stamp marks where an interrupted run stopped, so there is no separate progress state.
3. **Propose the tree by judgment, not by listing directories.** Start from the Components in `ARCHITECTURE.md` when it exists: one Room per component is the usual first cut.
   - Nest a sub-Room only when the parent truly composes it.
   - Split a Room whose boundary needs "and" to join unrelated concerns, or whose topics serve different readers (product, engineering, design).
   - Show Victor the tree, one line per Room, and wait for his OK before writing. The shape is the expensive decision.
4. Read enough of each Room's territory to describe it truthfully. Write its document per `context-core/contracts/room.schema.json`: a description, a boundary that also says what the Room is not, and anchors that are path prefixes or segment ids. Use the operation, never a hand edit:

   ```text
   vh room put --repo <root> --room <path> --input <room.json>
   vh room align --repo <root> --room <path>
   ```

   - `room_id` equals the last path segment, and a nested Room's parent must already exist.
   - `room put` rejects anchors that overlap another Room.
   - `room put` replaces the whole document and never stamps. Run `room align` right after.
5. If `ARCHITECTURE.md` exists, fill its Components "Room" column with each Room path.
6. Report one line per Room, then totals (Rooms, anchored files).

## Guardrails

- Never write a Room for territory you haven't read.
- There is no Room delete. Remove or move a Room with `git rm` or `git mv` plus a boundary edit.
- No progress files, manifests, or second store. The tree and its stamps are the whole state.
