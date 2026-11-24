---
name: housekeep
description: "Check and restore branch health in the current repo: merged and stale branches, worktrees, unpushed work, branches behind main, broken stacks, and stuck PRs, and sort uncommitted work into pushed branches with Victor's confirmation. Run only when Victor types /housekeep."
disable-model-invocation: true
---

# Housekeep

Bring the repo's branches back in line with the **principle-commit-and-merge-cadence** skill. Report first, then act on what is safe. Only the current repo; for another repo, Victor runs it there.

## 1. Inventory

Run `git fetch --prune`. Then gather, for every local branch, remote branch of Victor's, and worktree:

- Merged into `main` or not. Use the PR state from `gh pr list --author @me --state all`, not `git branch --merged`, because squash merges never show as merged in git.
- Commits ahead of and behind `origin/main`, and the date of the last commit.
- Unpushed commits and uncommitted changes.
- The PR, if any: state, draft, CI result, conflicts, review threads open, and its base branch.

For worktrees, run `~/.claude/skills/vstack-mode/scripts/worktree-audit.sh`. Note each worktree's location:

- `~/victor/<repo>-<topic>` is the standard place.
- Under `~/Happy/Workspaces/` or `.claude/worktrees/`, a tool created it and tracks its path. Report it, never move it.
- Anywhere else, especially `/tmp` or `/private/tmp`, it's misplaced.

In a repo Victor owns (see "Whose project" in **vstack-mode**), also read the merge settings: `gh api repos/{owner}/{repo} -q '.delete_branch_on_merge, .allow_squash_merge, .allow_merge_commit, .allow_rebase_merge'`. The target is auto-delete on and squash as the only method. If they differ, ask Victor once, then apply with `gh api -X PATCH repos/{owner}/{repo} -F delete_branch_on_merge=true -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false`. In someone else's repo, skip this.

## 2. Classify

| Bucket | Meaning | Action |
|---|---|---|
| Merged | PR merged, no unpushed or uncommitted work | Delete the branch and worktree |
| Orphaned stack child | Parent merged, base still the parent branch | Rebase onto `main`, retarget base to `main` |
| Behind | Open, behind `main`, rebases cleanly | Rebase and push |
| Conflicted | Open, conflicts with `main` | Report the files. Don't resolve unasked |
| Unpushed | Local commits not on the remote | Push |
| Uncommitted | Dirty or untracked files in a worktree | Sort into units (step 3) |
| Prunable | `git worktree list` marks it prunable | `git worktree prune` |
| Misplaced | Agent-made worktree outside `~/victor/<repo>-<topic>` | Offer `git worktree move` |
| Stale | Unmerged, no commit in 14 days | Report. Victor decides |
| Stuck PR | CI red, or ready with unresolved threads | Report what blocks it |

## 3. Sort uncommitted work

In Victor's repos only. In someone else's repo, report the files and stop.

For each worktree with uncommitted or untracked changes:

1. Read the diff and the untracked files. Group the changes into logical units, one change each, the way they would have been committed.
2. Show one table per worktree:

   | Unit | Files | Proposal |
   |---|---|---|
   | login form fix | `src/login.tsx`, … | branch `fix/login-form`, commit `fix(login): …` |
   | continues `feat/x` | … | commit to `feat/x` |
   | debug leftovers | `tmp.log`, … | move to Trash |
   | unclear | … | ask what it is |

3. Victor confirms or edits the rows in one reply. Nothing moves before that.
4. For each confirmed unit, cut its branch from current `origin/main` in a new worktree at `~/victor/<repo>-<topic>`, or use the existing branch it continues. Carry the unit's files over, commit, push, and open a draft PR. Leave the original worktree's copy until the new commit is pushed. Then, in the original worktree, `git restore` the unit's tracked files and move its untracked files to the Trash, since they now live on the new branch.
5. Move confirmed junk to the Trash, never `rm`. Leave unclear rows and any row Victor says to keep untouched.

The worktree ends clean, or holding only the rows Victor chose to keep.

## 4. Act

Show the table first. Then do the Merged, Behind, Unpushed, Prunable, and Orphaned-stack-child actions without asking, because each is recoverable. Before a rebase-and-push, confirm nobody else pushes to that branch. Never delete an unmerged branch or uncommitted work, and never force-push a branch someone else owns, without Victor's explicit OK for that branch.

Move a misplaced worktree only with Victor's OK, and never one a tool created.

**Reply:** the table, the units sorted and their PRs, what was done, and the decisions left for Victor.
