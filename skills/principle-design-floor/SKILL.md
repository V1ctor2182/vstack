---
name: principle-design-floor
description: "Apply when building or restyling any UI, before showing Victor a UI, and when Victor calls a UI ugly, cheap, low quality, AI-ish, or says it has no vibe. Nine floor lines every project keeps, a screenshot check before showing, and a log that grows the floor. Not a style guide: each project's look lives in its own DESIGN.md."
disable-model-invocation: true
---

# Design floor

> "model is so good at achieving the average" (Victor, 2026-11-16)

Defaults are what make UI look AI-made, so every visual choice needs a reason. This file holds only the floor, the things Victor never wants to see in any project. A project's own look (palette, type, radius, density) comes from its DESIGN.md. Where a project has none, ask rather than invent a house style.

The floor comes from Victor's own complaints across about 1,200 Claude and Codex sessions (`log.md`). Lines are ordered by how often he raised them.

## The floor

| # | Don't | Instead | Victor's words | Count |
|---|---|---|---|---|
| 1 | Stiff or laggy motion: white flashes, full page reloads, the same animation looping forever | Transitions ease and keep the user's place. Respond at once. Vary or stop loops | "很僵硬", "一直会闪的白屏", "lags for like 1s" | 9 |
| 2 | Extra explanatory text and AI voice: subtitles that repeat the title, greetings, all-caps eyebrows, invented names | Let the content speak. Name things plainly. Add text only when it tells the user something new | "too much word and ugly", "名字不要是 Talkatory Motion Study，就直接写" | 7 |
| 3 | Boxes and lines everywhere: every block a bordered card of equal weight | Group with space and type weight. Use a border only where it separates something | "不要有这种大方边框什么的 太丑了", "不要有太多的线" | 6 |
| 4 | Overlap or clipping: stickers on text, dropdowns hidden, buttons cut off | Check every element at real sizes and states. Everything stays fully visible | "sticker 不能放在文字上面", "dropdown会被挡住", "button 有被切掉" | 6 |
| 5 | No focus: crowded screens, empty placeholders on show | One thing per screen is clearly the most important. Hide what is empty. Give it room | "information is too crowded", "没有重点" | 6 |
| 6 | Too many colors, colors too bright, dead black | A calm base plus one accent. Soften pure black | "颜色不要太亮", "too black" | 5 |
| 7 | Hard to read: low-contrast text, low-resolution images | Check contrast and image sharpness at real size | "too hard to see", "像素实在太低了" | 5 |
| 8 | Emoji as icons | SVG icons for functions, real logos for brands | "功能图标用 SVG", "github用Logo" | 4 |
| 9 | Fake materials: CSS gradients faking light, noise overlays, painted wood grain | Real assets, or clean flat color | "看起来很廉价", "丑丑丑" | 3 |

**Don't over-correct.** Fixing AI-ish UI doesn't mean deleting decoration. On jobfeed, Victor called a page AI-ish, the agent stripped it to black on white, and he asked for the original back with more images. Keep images, color, and texture that have a reason.

## Taste

`taste.md` holds the other side: qualities Victor wants, distilled from designs he saved. Read it with the floor before building or restyling UI.

## Check before showing

Before showing Victor any UI you built or changed:

1. Screenshot it at real size, including open menus, hover and loading states, and a narrow width.
2. Check it against each floor line. Fix what fails.
3. Show it, with one line saying the check ran and what it fixed: "Floor check: removed card borders (3), shortened the subtitle (2)."

## Log complaints

When Victor calls a UI ugly, cheap, low quality, AI-ish, or says it has no vibe, append one entry to `log.md` (next to this file) in the same session. An entry has:
- the date and project
- what was on screen
- his words
- what fixed it, once known

Then compare it with earlier entries:
- **A floor line covers it.** Raise that line's count. The line isn't working, so say which check missed it.
- **No floor line covers it, but an earlier entry matches.** That's a repeat. Propose a new floor line as a merge-time candidate (**principle-commit-and-merge-cadence**), with both entries quoted. Victor confirms before it joins the table.
- **No match.** Leave it in the log.

Commit log changes to vstack on a branch, like any vstack change.
