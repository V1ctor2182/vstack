---
name: principle-keep-the-architecture-map
description: "Apply at the start of any task in a project, and before finishing any change that adds, removes, moves, or rewires a component. Every project keeps an ARCHITECTURE.md at its root that matches the code, updated in the same change."
disable-model-invocation: true
---

# Keep the Architecture Map

Many small changes drift a system into a shape nobody chose. One short map at the repo root keeps the whole system visible to Victor and to the next agent.

- **Read it first.** At the start of a task, read `ARCHITECTURE.md` at the project root before reading code. If it's missing, write it as the first step, from the code as it is now.
- **Keep it a map, not a manual.** Under about 150 lines:
  - **Purpose.** What the system does and for whom, in two or three sentences.
  - **Diagram.** One Mermaid diagram of the components and how data flows between them.
  - **Components.** One line each: name, path, what it owns.
  - **Boundaries and invariants.** What may call what, where external data enters, which rules must hold.
  - **External dependencies.** Databases, services, APIs, queues.
  - **Changelog.** One line per structural change: date, what changed, link to the commit or PR.
- **Update it in the same change.** Adding, removing, moving, splitting, or merging a component, or changing a boundary, a data flow, or an external dependency, updates the map in that commit. A change that leaves the shape alone doesn't touch it.
- **Code wins, then fix the map.** When the map and the code disagree, the code is the truth. Fix the map in the current change.
- **Say what moved.** When a change updates the map, the reply says in one or two lines how the system's shape changed.
