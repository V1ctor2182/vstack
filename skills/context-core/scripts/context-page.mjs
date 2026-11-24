// Renders a repo's recorded Context as one static HTML page: no script, no
// external request, so the file opens from disk by double-click.

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

const STYLE = `
:root {
  color-scheme: light dark;
  --bg: #faf9f7; --fg: #22211f; --muted: #6a6862; --line: #e4e2dc;
  --tint: #f0eee9; --accent: #3f55c4;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #191918; --fg: #e8e6e1; --muted: #a09e97; --line: #2f2e2b;
    --tint: #232321; --accent: #9aa8ff;
  }
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0; padding: 48px 16px 96px; background: var(--bg); color: var(--fg);
  font: 15px/1.55 var(--sans); overflow-wrap: anywhere;
}
main { max-width: 840px; margin: 0 auto; }
h1 { margin: 0; font-size: 26px; line-height: 1.2; font-weight: 650; letter-spacing: -0.01em; }
.total { margin: 6px 0 0; color: var(--muted); }
summary { list-style: none; cursor: pointer; }
summary::-webkit-details-marker { display: none; }
summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.room { margin-top: 36px; }
.room > summary {
  display: flex; align-items: center; gap: 8px; padding: 7px 12px;
  background: var(--tint); border-radius: 8px;
}
.room h2 { margin: 0; font-size: 15px; font-weight: 600; }
.count {
  padding: 0 7px; border-radius: 999px; font-size: 12px; line-height: 20px;
  color: var(--muted); background: color-mix(in srgb, var(--fg) 7%, transparent);
  font-variant-numeric: tabular-nums;
}
.chev {
  width: 7px; height: 7px; flex: none; border: solid var(--muted); border-width: 0 1.5px 1.5px 0;
  transform: rotate(-45deg); transition: transform 0.18s cubic-bezier(0.23, 1, 0.32, 1);
}
.room > summary .chev { margin-left: auto; margin-right: 4px; }
details[open] > summary .chev { transform: rotate(45deg); }
.record + .record { border-top: 1px solid var(--line); }
.record > summary {
  display: grid; grid-template-columns: 7px minmax(0, 1fr) auto; align-items: baseline;
  column-gap: 14px; padding: 12px;
}
.record > summary .chev { align-self: start; margin-top: 7px; }
.record > summary:hover { background: color-mix(in srgb, var(--fg) 4%, transparent); }
.record[open] > summary .title { font-weight: 600; }
.meta {
  display: flex; gap: 10px; align-items: baseline; color: var(--muted);
  font-size: 13px; white-space: nowrap;
}
.meta time { font-variant-numeric: tabular-nums; }
.inactive .title { color: var(--muted); }
.inactive .state { padding: 0 7px; border: 1px solid var(--muted); border-radius: 999px; }
.record:target > summary { box-shadow: inset 2px 0 0 var(--accent); }
.body { padding: 2px 12px 22px 33px; }
.body p { margin: 0; white-space: pre-wrap; }
.body p, blockquote { max-width: 70ch; }
blockquote {
  margin: 16px 0 0; padding: 2px 0 2px 14px; border-left: 2px solid var(--accent);
  white-space: pre-wrap;
}
dl { display: grid; grid-template-columns: 6.5rem minmax(0, 1fr); gap: 12px 14px; margin: 18px 0 0; font-size: 14px; }
dt { color: var(--muted); }
dd { margin: 0; }
ul { margin: 0; padding: 0; list-style: none; }
li + li { margin-top: 8px; }
code { font: 12.5px/1.5 var(--mono); }
.ref { display: block; color: var(--muted); }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tags span { padding: 0 8px; border-radius: 999px; background: var(--tint); font-size: 13px; }
.steps > li { padding: 10px 0; }
.steps > li + li { margin-top: 0; border-top: 1px solid var(--line); }
.steps .when { color: var(--muted); font-size: 13px; font-variant-numeric: tabular-nums; }
.steps dl { margin-top: 8px; }
@media (max-width: 600px) {
  body { padding-top: 28px; }
  .record > summary { grid-template-columns: 7px minmax(0, 1fr); row-gap: 2px; }
  .meta { grid-column: 2; }
  .body { padding-left: 12px; }
  dl { grid-template-columns: minmax(0, 1fr); row-gap: 4px; }
  dd { margin-bottom: 10px; }
}
@media (prefers-reduced-motion: reduce) { .chev { transition: none; } }
`;

function refHtml(ref) {
  const text = esc(ref);
  return /^https?:\/\//i.test(ref) ? `<a href="${text}" rel="noreferrer"><code>${text}</code></a>` : `<code>${text}</code>`;
}

function listRow(label, items) {
  return items.length ? `<dt>${label}</dt><dd><ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul></dd>` : "";
}

function recordHtml(document, summaries) {
  const inactive = document.state !== "active";
  const source = document.source ?? {};
  const date = typeof source.captured_at === "string" ? source.captured_at.slice(0, 10) : "";
  const authority = document.authority ?? {};
  const rows = [
    `<dt>Id</dt><dd><code>${esc(document.context_id)}</code></dd>`,
    source.ref ? `<dt>Source</dt><dd>${refHtml(source.ref)}</dd>` : "",
    listRow("Evidence", (document.evidence ?? []).map((item) => `${esc(item.note)}<span class="ref">${refHtml(item.ref)}</span>`)),
    listRow("Governs", (authority.governs ?? []).map((item) => `<code>${esc(item)}</code>`)),
    listRow("Canonical", (authority.canonical ?? []).map((item) => `<code>${esc(item)}</code>`)),
    listRow("Update rules", (authority.update_rules ?? []).map(esc)),
    listRow("Validation", (authority.validation ?? []).map(esc)),
    (document.tags ?? []).length
      ? `<dt>Tags</dt><dd class="tags">${document.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</dd>`
      : "",
    listRow("Relations", (document.relations ?? []).map((relation) => {
      const target = relation.target_context_id;
      return `${esc(String(relation.type).replaceAll("_", " "))} <a href="#c-${esc(target)}">${esc(summaries.get(target) ?? target)}</a>`;
    })),
  ];
  return `<details class="record${inactive ? " inactive" : ""}" id="c-${esc(document.context_id)}">
<summary><span class="chev"></span><span class="title">${esc(document.summary)}</span><span class="meta"><span>${esc(document.type)}</span><span class="state">${esc(document.state)}</span><time datetime="${esc(source.captured_at)}">${esc(date)}</time></span></summary>
<div class="body"><p>${esc(document.detail)}</p>${source.quote ? `<blockquote>${esc(source.quote)}</blockquote>` : ""}<dl>${rows.join("")}</dl></div>
</details>`;
}

function runHtml(run) {
  const last = run.rows.at(-1)?.ts ?? "";
  const steps = run.rows.map((row) => `<li><span class="when">${esc(String(row.ts).slice(0, 16).replace("T", " "))} · ${esc(row.phase)}</span>
<p>${esc(row.decision)}</p><dl>${[["Why", row.why], ["Evidence", row.evidence], ["Result", row.result]]
    .filter(([, value]) => value)
    .map(([label, value]) => `<dt>${label}</dt><dd>${esc(value)}</dd>`)
    .join("")}</dl></li>`);
  return `<details class="record" id="r-${esc(run.name)}">
<summary><span class="chev"></span><span class="title">${esc(run.name)}</span><span class="meta"><span>${run.rows.length} ${run.rows.length === 1 ? "row" : "rows"}</span><time datetime="${esc(last)}">${esc(String(last).slice(0, 10))}</time></span></summary>
<div class="body"><ul class="steps">${steps.join("\n")}</ul></div>
</details>`;
}

function byActiveThenNewest(left, right) {
  const rank = (document) => (document.state === "active" ? 0 : 1);
  return rank(left) - rank(right)
    || String(right.source?.captured_at ?? "").localeCompare(String(left.source?.captured_at ?? ""))
    || left.context_id.localeCompare(right.context_id);
}

// rooms: [{ path: "parent/child", contexts: [Context document] }]
// runs: [{ name: "2026-01-02-task", rows: [{ ts, phase, decision, why, evidence, result }] }], newest first
export function renderContextPage({ repoName, rooms, runs = [] }) {
  const groups = rooms
    .filter((room) => room.contexts.length > 0)
    .sort((left, right) => left.path.localeCompare(right.path));
  const all = groups.flatMap((room) => room.contexts);
  const summaries = new Map(all.map((document) => [document.context_id, document.summary]));
  const title = `${esc(repoName)} context`;
  const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;
  const sections = groups.map((room) => `<details class="room" open>
<summary><h2>${esc(room.path.replaceAll("/", " / "))}</h2><span class="count">${room.contexts.length}</span><span class="chev"></span></summary>
${[...room.contexts].sort(byActiveThenNewest).map((document) => recordHtml(document, summaries)).join("\n")}
</details>`);
  if (runs.length > 0) {
    sections.push(`<details class="room" open>
<summary><h2>Recent runs</h2><span class="count">${runs.length}</span><span class="chev"></span></summary>
${runs.map(runHtml).join("\n")}
</details>`);
  }
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${STYLE}</style>
</head>
<body>
<main>
<h1>${title}</h1>
<p class="total">${plural(all.length, "record")} in ${plural(groups.length, "room")}</p>
${sections.join("\n")}
</main>
</body>
</html>
`;
}
