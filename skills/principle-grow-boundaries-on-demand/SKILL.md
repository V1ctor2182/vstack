---
name: principle-grow-boundaries-on-demand
description: "Apply when designing structure: adding an interface, base class, adapter, wrapper, layer, module, package, or service, or deciding whether to split one. Start as modules in one deployable; abstract on the second use; split a service only for a named reason."
disable-model-invocation: true
---

# Grow Boundaries on Demand

Structure grows in steps: function, module, package, service. Each step costs more to read, cross, and change. Take the next step only when the current one has proven too small.

- **Modules first.** Start as one deployable with clear modules. Each module owns its data and exposes a small public surface. Other modules call only that surface, never its internals.
- **Abstract on the second use.** Write concrete code the first time. Add an interface, base class, adapter, or wrapper only when a second real implementation or caller exists. Exception: one adapter at an external-system boundary (database, third-party API) is allowed from the start.
- **A service needs a reason.** Split a module into a service only when at least one holds:
  - It needs its own deploy cadence.
  - It needs to scale independently.
  - A different owner runs it.
  - It needs a separate runtime or security boundary.

  "Might need to scale later" is not a reason.
- **No pass-through layers.** A layer or service that only forwards calls gets deleted (**principle-minimize-reader-load**).
- **Extensible means clean seams.** A module with a small surface and its own data can be extracted later. That is the extension plan, not layers added now.
- **Record every step up.** Adding a module, package, or service updates `ARCHITECTURE.md` components and changelog with the reason (**principle-keep-the-architecture-map**).

In someone else's repo, follow their existing architecture.
