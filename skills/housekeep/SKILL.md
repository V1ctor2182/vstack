---
name: housekeep
description: "Check and restore branch health in the current repo: merged and stale branches, worktrees, unpushed or uncommitted work, branches behind main, broken stacks, and stuck PRs. Run only when Victor types /housekeep."
disable-model-invocation: true
---

# Housekeep

Bring the repo's branches back in line with the **principle-commit-and-merge-cadence** skill. Report first, then act on what is safe.

## 1. Inventory

Run `git fetch --prune`. Then gather, for every local branch, remote branch of Victor's, and worktree:

- Merged into `main` or not. Use the PR state from `gh pr list --author @me --state all`, not `git branch --merged`, because squash merges never show as merged in git.
- Commits ahead of and behind `origin/main`, and the date of the last commit.
- Unpushed commits and uncommitted changes.
- The PR, if any: state, draft, CI result, conflicts, review threads open, and its base branch.

For worktrees, run pstack's `~/.claude/skills/poteto-mode/scripts/worktree-audit.sh`.

## 2. Classify

| Bucket | Meaning | Action |
|---|---|---|
| Merged | PR merged, no unpushed or uncommitted work | Delete the branch and worktree |
| Orphaned stack child | Parent merged, base still the parent branch | Rebase onto `main`, retarget base to `main` |
| Behind | Open, behind `main`, rebases cleanly | Rebase and push |
| Conflicted | Open, conflicts with `main` | Report the files. Don't resolve unasked |
| Unpushed | Local commits not on the remote | Push |
| Uncommitted | Dirty working tree | Report the files. Don't touch |
| Stale | Unmerged, no commit in 14 days | Report. Victor decides |
| Stuck PR | CI red, or ready with unresolved threads | Report what blocks it |

## 3. Act

Show the table first. Then do the Merged, Behind, Unpushed, and Orphaned-stack-child actions without asking, because each is recoverable. Before a rebase-and-push, confirm nobody else pushes to that branch. Never delete an unmerged branch or uncommitted work, and never force-push a branch someone else owns, without Victor's explicit OK for that branch.

**Reply:** the table, what was done, and the decisions left for Victor.
