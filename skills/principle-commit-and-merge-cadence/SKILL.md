---
name: principle-commit-and-merge-cadence
description: "Apply at the start of every task (where to work: same branch, new branch, or new worktree) and whenever you commit, push, branch, open or stack a PR, or merge. When each happens, how big each is, and what must be true before a merge."
disable-model-invocation: true
---

# Commit and Merge Cadence

Branches stay healthy when work moves in small, verified steps and lands soon. Long-lived branches, giant PRs, and deep stacks rot. vstack's `playbooks/opening-a-pr.md` and `playbooks/shipping.md` hold the mechanics. This sets the cadence.

## Commit

- **Commit when a unit is verified.** Each time one logical change reaches a state that passes its check, commit it. Don't wait for the end of a session, and don't commit a broken state.
- **One logical change per commit.** Cleanup, refactor, and behavior change go in separate commits. Title in Conventional Commits: `type(scope): subject`.
- **Clean before you commit.** No debug prints, commented-out code, temp files, unused imports, or unrelated edits. Never commit secrets or generated files.

## Where to work

Decide at the start of every task, and say it in one line ("Same branch, continuing #12", or "New worktree: the main folder has unfinished work").

| Situation | Where |
|---|---|
| Continuing the same change or PR | Same branch, same folder |
| A new, unrelated change. The folder is clean and pushed, and nothing else runs in it | New branch from fresh `main`, same folder |
| The folder has unfinished work, another session or agent works in it, or two things run at once (one waits on CI or review) | New worktree at `~/victor/<repo>-<topic>` on a new branch |
| A second clone | Never. A worktree covers it |

Never create a worktree in `/tmp`. Remove the worktree when its branch merges.

**Catch merges made elsewhere.** At the start of a task in a repo, find worktrees whose branch has a merged PR. Remove each one with no uncommitted or unpushed work, and say which in one line. Leave the rest and name them.

## Push and branch

- **One branch per change**, cut from a fresh `main`, named `type/short-description`. Never commit directly to `main`.
- **Push before you stop.** At the end of every session and before stepping away, push. Nothing lives only on this machine.
- **Short-lived.** A branch should merge within a few days. When `main` moves, rebase onto it before continuing.

## PR and stack

- **Open the PR at the first verified commit**, as a draft, so CI runs alongside the work. Mark it ready when it's done and verified.
- **Reviewable in one sitting.** Past about 400 changed lines, split it.
- **Stack only on a real dependency.** Base a PR on another PR's branch only when it needs that code (`gh pr create --base <parent-branch>`). Independent changes are separate PRs off `main`. Keep stacks at most three deep. Land the bottom before adding more.

## Merge

- **Merge only when all hold:** the change is verified on the real artifact, CI is green, review threads are resolved, and the branch is rebased on current `main` with no conflicts. Green CI alone is not enough.
- **Victor merges** unless he granted merge rights for this work, such as an autopilot run. An agent with the grant follows vstack's Shipping playbook.
- **Squash-merge. Land stacks bottom-up.** After the parent lands, rebase the child onto `main` and retarget its base to `main`.
- **Clean up at merge time.** Whenever a merge happens in a session (you merged it, or Victor says he did), clean only that branch: `git fetch --prune`, delete the local branch and its worktree, delete the remote branch if GitHub didn't, and rebase each child PR onto `main` with its base retargeted to `main`. Leave every other branch to `/housekeep`.
- **Record context at merge time.** In Victor's repos, after the cleanup, list what the merged change decided that the code doesn't say: a choice and its reason, a constraint, a convention. Give at most five lines, one claim each, or say "nothing to record". Victor confirms in one reply. Write only the confirmed lines with **context-record**, and commit them as `docs(context): ...`. In the same list, name any new reusable UI component the change added that victor-ui lacks (**principle-ui-from-victor-ui**). For each one Victor confirms, follow victor-ui's process for adding it. Also name any new floor line the design log proposes (**principle-design-floor**).
