---
name: principle-ui-from-victor-ui
description: "Apply before writing a new UI component (button, dialog, sidebar, form control, card, menu, and so on) in any project. Start from Victor's component gallery through the victor-ui MCP, adapt it, and verify the render. Not for copy edits, bug fixes, or style tweaks to existing UI."
disable-model-invocation: true
---

# UI from victor-ui

Victor keeps a gallery of components he has collected and built. A new component starts from the closest gallery item, not from a blank file, so his projects share one feel and nothing is written twice.

## Before writing a component

1. **Search in your own words.** Call `search_components` with what the component does, looks like, or is called, such as "settings toggle", "bottom sheet", or "page transition". It tolerates typos and matches tags and synonyms. If nothing fits, read `list_components`, which returns the whole gallery on one line per item, and choose by meaning.
2. **Inspect before choosing.** Call `get_component` on each candidate, and continue with `read_component_source` if the result is truncated. Read the source, the demonstrated usage, the dependencies, the CSS, and the license.
3. **Check the license against the repo.** In a private repo, use the item. Before putting gallery code into a **public** repo, read the item's license. If its terms forbid redistribution, ask Victor first.
4. **Adapt it.** Fit the project's framework, styling system, existing components, and design rules. Gallery items are references, not packages. Keep keyboard access, visible focus, reduced motion, and responsive behavior.
5. **Verify the render.** Open it in a browser in the consuming project and check it works, including keyboard and focus. Then run the floor check (**principle-design-floor**).
6. **Say what you used.** One line in the reply: "Started from victor-ui `sidebar`", or "Nothing in victor-ui fit; wrote `X`".

If the victor-ui tools aren't loaded in this session, say so and continue without them.

## Give new components back

When a merged change in Victor's repo adds a reusable component the gallery lacks, name it in the merge-time candidates (**principle-commit-and-merge-cadence**). Victor confirms which to save. Until victor-ui has an own-component path (V1ctor2182/victor-ui#22), add each confirmed one as a comment on that issue. After that, follow its process. Never edit victor-ui as a side effect of other work.
