---
name: principle-ui-from-victor-ui
description: "Apply before writing a new UI component (button, dialog, sidebar, form control, card, menu, and so on) in any project, before building a new site, app, or screen, and whenever Victor shares a link or image of a design he likes. Start from Victor's component gallery and saved references through the victor-ui MCP, adapt, and verify the render. Not for copy edits, bug fixes, or style tweaks to existing UI."
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

## Save the designs Victor likes

When Victor shares a link or an image and says he likes it, or that he wants something like it, save it in the same session. He doesn't have to say "remember".

1. **Ask only what is missing.** You need the kind (`site`, `app`, `mobile`, or `style` for a look with no particular screen) and what he likes about it, in his words. Infer the kind when it is plain. If he didn't say what he likes, ask in one line.
2. **Save it** from the victor-ui checkout at `~/victor/victor-ui`: `node scripts/add-ref.mjs --url <link> --kind <kind> --likes "<his words>"`, plus `--aspect`, `--tags` (the page within it, such as `hero`), and `--project` when they apply. For an image, pass `--file`. An image pasted into chat with no file on disk can't be saved: ask for the file or a link.
3. **Land it.** Commit the saves of one session together on a `refs/<date>` branch and open a victor-ui PR. This is the one change to victor-ui allowed as a side effect of other work.
4. **Confirm in one line:** "Saved to victor-ui as `site`: you like the dense sidebar and the single accent color."

## Before building a site, app, or screen

Call `search_references` with the kind you are building, then with words for the feel. Follow what Victor said he likes, not the screenshot's every detail. Say in one line which references shaped the work, or "No saved reference fit."

When two or more references share a quality Victor named, propose a line for `../principle-design-floor/taste.md` as a merge-time candidate (**principle-commit-and-merge-cadence**), quoting both. Victor confirms before it joins.

## Give new components back

When a merged change in Victor's repo adds a reusable component the gallery lacks, name it in the merge-time candidates (**principle-commit-and-merge-cadence**). Victor confirms which to save. Until victor-ui has an own-component path (V1ctor2182/victor-ui#22), add each confirmed one as a comment on that issue. After that, follow its process. Never edit victor-ui as a side effect of other work.
