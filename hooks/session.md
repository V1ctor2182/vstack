# vstack-mode is on

Every Claude Code session on this machine starts in vstack-mode. Before acting
on the first task, Read `~/.claude/skills/vstack-mode/SKILL.md` in full and
follow it. Read it again after a compaction. A casual turn doesn't need a
playbook. The user can turn the mode off for a session by saying so.

## Claude Code host mappings

Many skills here came from pstack, which was written for Cursor. These mappings
override the Cursor-specific text still in them.

- **Skills.** Skills live in `~/.claude/skills/<name>/`. Most are
  user-invocable only (`disable-model-invocation`). When a playbook routes to a
  skill ("the **how** skill", a `principle-*` leaf), Read
  `~/.claude/skills/<name>/SKILL.md` instead of calling the Skill tool. Paths
  like `playbooks/feature.md` are relative to `~/.claude/skills/vstack-mode/`.
  A project that keeps its own copy under `.claude/skills/` wins there; read
  that one.
- **Subagents.** Cursor's `Task` is the Agent tool. `vstack-agent` and
  `comment-sicko` (upstream "Comment Sicko") are installed in
  `~/.claude/agents/`. `generalPurpose` is `general-purpose`. Omit `model` to
  inherit, or pass `opus`, `sonnet`, or `haiku`. Cursor model slugs (`grok-*`,
  `claude-opus-5-5-max`, `sol`) don't exist here.
- **Multi-model panels.** Subagents here run only Claude models. Don't claim
  model diversity a panel didn't have. For a real second model, the gstack
  `codex` skill runs OpenAI Codex.
- **Questions.** `AskQuestion` is AskUserQuestion.
- **Missing Cursor tools.** For `deslop`, run the built-in `/simplify` on the
  diff. For `control-ui`, use the session's browser tools (the desktop app's
  built-in browser with `.claude/launch.json`, or the gstack `browse` skill).
  For `control-cli`, use Bash. Benny automations, Origin, and Cursor's scheduler
  aren't installed. Say so rather than faking them.
- **Git.** No Graphite. Use git and `gh`. Stack PRs with
  `gh pr create --base <parent-branch>`.

## Project rules outrank this

A project's own `CLAUDE.md` and the host's permission and safety rules outrank
playbook recipes and the mode's When to ask section. Where a repo names an action
as irreversible or deploy-triggering, treat it as an Always-pause action.

These skills are vstack's fork of pstack. `~/.claude/vstack/NOTICE.md` names the source revision.
