---
name: principle-keep-the-architecture-map
description: "Apply at the start of any task in a project, and before finishing any change that adds, removes, moves, or rewires a component. Every project keeps an ARCHITECTURE.md at its root that matches the code, updated in the same change."
disable-model-invocation: true
---

# Keep the Architecture Map

Many small changes drift a system into a shape nobody chose. One short map at the repo root keeps the whole system visible to Victor and to the next agent.

- **Read it first.** At the start of a task, read `ARCHITECTURE.md` at the project root before reading code. If it's missing, write it as the first step, from the code as it is now, starting from `~/.claude/vstack/templates/ARCHITECTURE.md`.
- **Keep it a map, not a manual.** English, under about 150 lines, with these sections:
  - **Last verified.** The date and commit the map was last checked against the code.
  - **Purpose.** What the system does and for whom, in two or three sentences.
  - **Diagram.** One Mermaid diagram of the components and how data flows between them.
  - **Components.** A table: name, path, what it owns, level (module, package, or service), why it is at that level, and its Room.
  - **Key flows.** The two or three most important request or data paths, one line each.
  - **Boundaries and invariants.** What may call what, where external data enters, which rules must hold.
  - **External dependencies.** Databases, services, APIs, queues, and the adapter for each.
- **Current shape only.** No changelog. History lives in commits and PRs.
- **Map here, detail in Rooms.** The map stays one page. Each component's decisions, constraints, conventions, and docs live in its Room under `.vibehub/rooms/` (**context-record**, **context-query**). Link the Room in the Components table instead of copying detail into the map.
- **Update it in the same change.** Adding, removing, moving, splitting, or merging a component, or changing a boundary, a key flow, or an external dependency, updates the map in that commit and refreshes Last verified. A change that leaves the shape alone doesn't touch it.
- **A hook enforces it.** In Victor's repos, vstack's `arch-map-check` hook blocks an agent's `git commit` that changes structure without touching `ARCHITECTURE.md`. If the shape truly didn't change, add the trailer `Arch-Map: unchanged — <reason>` to the commit message.
- **Code wins, then fix the map.** When the map and the code disagree, the code is the truth. Fix the map in the current change.
- **Say what moved.** When a change updates the map, the reply says in one or two lines how the system's shape changed.
