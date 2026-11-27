#!/usr/bin/env node
// Checks the rules an agent breaks when it edits vstack from one file without seeing the rest.
// Each failure names the file, the line, and the fix. Exit 1 on any failure.
// Usage: node scripts/lint.mjs [repo root]
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? join(import.meta.dirname, '..'));
const MODE = 'skills/vstack-mode/SKILL.md';
const MODE_BUDGET = 150;
// Names a rule may cite that live outside this repo.
const EXTERNAL = new Set(['writing-style']);

const failures = [];
const fail = (rule, where, message) => failures.push(`FAIL ${rule}: ${where}: ${message}`);

const read = (path) => readFileSync(join(root, path), 'utf8');
const tracked = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' })
  .split('\n')
  .filter((f) => f && existsSync(join(root, f)));
const markdown = tracked.filter((f) => f.endsWith('.md'));

const skills = readdirSync(join(root, 'skills')).filter((d) => statSync(join(root, 'skills', d)).isDirectory());
const playbooks = readdirSync(join(root, 'skills/vstack-mode/playbooks')).map((f) => f.replace(/\.md$/, ''));
const agents = readdirSync(join(root, 'agents')).map((f) => f.replace(/\.md$/, ''));
const names = new Set([...skills, ...playbooks, ...agents, ...EXTERNAL]);

function frontmatter(path) {
  const m = read(path).match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  return Object.fromEntries(m[1].split('\n').map((l) => l.match(/^(\w[\w-]*):\s*(.*)$/)).filter(Boolean).map((m) => [m[1], m[2]]));
}

// Headings and bold lead-ins ("**Size and stacks.** ...") a rule can point at, per file.
const anchors = new Map(
  markdown.map((f) => {
    const text = read(f);
    const titles = [...text.matchAll(/^#+\s+(.+?)\s*$/gm), ...text.matchAll(/^(?:[-\d.]+\s+)?\*\*([^*]+?)\.?\*\*/gm)].map((m) => m[1]);
    return [f, new Set(titles)];
  }),
);
const anyAnchor = (title) => [...anchors.values()].some((s) => s.has(title));

// 1. Every skill and agent registers under its own name.
for (const s of skills) {
  const path = `skills/${s}/SKILL.md`;
  if (!existsSync(join(root, path))) { fail('skill-has-skill-md', `skills/${s}`, 'add SKILL.md, or delete the folder.'); continue; }
  const fm = frontmatter(path);
  if (!fm) fail('frontmatter', path, 'start the file with --- name/description --- frontmatter.');
  else {
    if (fm.name !== s) fail('frontmatter', path, `name is "${fm.name}", but the folder is "${s}". Set name: ${s}.`);
    if (!fm.description) fail('frontmatter', path, 'add a description that says when the skill applies.');
  }
}
for (const a of agents) {
  const fm = frontmatter(`agents/${a}.md`);
  if (fm?.name !== a) fail('frontmatter', `agents/${a}.md`, `set name: ${a}.`);
}

// 2. The one rulebook stays short enough to read in full every session.
const modeLines = read(MODE).split('\n').length - 1;
if (modeLines > MODE_BUDGET) fail('mode-budget', MODE, `${modeLines} lines, over the ${MODE_BUDGET}-line budget. Remove lines before you add them.`);

// 3. Every skill is reachable from the rulebook or the README.
const index = read(MODE) + read('README.md');
for (const s of skills) if (!index.includes(s)) fail('skill-indexed', `skills/${s}`, `name ${s} in vstack-mode (or the README for a command or a library skill), or delete it.`);

// 4. Every reference resolves.
for (const f of markdown) {
  if (f.startsWith('templates/') || f.includes('/references/feature-map-example/')) continue;
  read(f).split('\n').forEach((line, i) => {
    const at = `${f}:${i + 1}`;
    for (const [, name] of line.matchAll(/\*\*([a-z0-9]+(?:-[a-z0-9]+)+)\.?\*\*/g)) {
      if (names.has(name)) continue;
      const hint = names.has(`principle-${name}`) ? ` Write **principle-${name}**.` : '';
      fail('ref-resolves', at, `**${name}** names no skill, playbook, or agent.${hint}`);
    }
    for (const [, title, file] of line.matchAll(/\b(?:per|Run) \*\*([A-Z][^*]+?)\*\*(?: in `([^`]+)`)?/g)) {
      const target = file && markdown.find((m) => m.endsWith(file));
      if (target ? anchors.get(target)?.has(title) : anyAnchor(title)) continue;
      fail('ref-resolves', at, `**${title}** is no heading or bold lead-in${file ? ` in ${file}` : ''}. Point at a section that exists, or state the rule here.`);
    }
    for (const [, title, skill] of line.matchAll(/\bthe ([A-Z][\w ]*?) section(?: of the \*\*([a-z-]+)\*\* skill)?/g)) {
      const target = skill ? `skills/${skill}/SKILL.md` : MODE;
      if (anchors.get(target)?.has(title) || anchors.get(f)?.has(title)) continue;
      fail('ref-resolves', at, `${target} has no "${title}" section.`);
    }
    for (const [, link] of line.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
      if (/^[a-z]+:/.test(link)) continue;
      if (!existsSync(join(root, dirname(f), link))) fail('link-resolves', at, `${link} does not exist.`);
    }
  });
}

// 5. NOTICE lists only forked skills that still exist.
for (const [, s] of read('NOTICE.md').matchAll(/^- `([a-z0-9-]+)`$/gm)) {
  if (!skills.includes(s)) fail('notice', 'NOTICE.md', `lists ${s}, which skills/ no longer has. Remove the line.`);
}

// 6. The session hook still turns the mode on.
for (const arg of ['session', 'prompt']) {
  let out = '';
  try { out = execFileSync('sh', [join(root, 'hooks/session.sh'), arg], { encoding: 'utf8' }); } catch {}
  if (!out.trim()) fail('session-hook', 'hooks/session.sh', `prints nothing for "${arg}", so sessions start without vstack-mode.`);
}
if (!read('hooks/session.md').includes(MODE.replace('skills/', '~/.claude/skills/'))) {
  fail('session-hook', 'hooks/session.md', `must tell the agent to read ~/.claude/${MODE.replace('skills/', 'skills/')}.`);
}

for (const f of failures) console.log(f);
console.log(failures.length ? `${failures.length} failure(s)` : 'PASS lint');
process.exit(failures.length ? 1 : 0);
