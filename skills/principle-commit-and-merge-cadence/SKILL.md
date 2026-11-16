---
name: principle-commit-and-merge-cadence
description: "Apply whenever you commit, push, branch, open or stack a PR, or merge. When each happens, how big each is, and what must be true before a merge."
disable-model-invocation: true
---

# Commit and Merge Cadence

Branches stay healthy when work moves in small, verified steps and lands soon. Long-lived branches, giant PRs, and deep stacks rot. pstack's `playbooks/opening-a-pr.md` and `playbooks/shipping.md` hold the mechanics. This sets the cadence.

## Commit

- **Commit when a unit is verified.** Each time one logical change reaches a state that passes its check, commit it. Don't wait for the end of a session, and don't commit a broken state.
- **One logical change per commit.** Cleanup, refactor, and behavior change go in separate commits. Title in Conventional Commits: `type(scope): subject`.
- **Clean before you commit.** No debug prints, commented-out code, temp files, unused imports, or unrelated edits. Never commit secrets or generated files.

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
- **Victor merges** unless he granted merge rights for this work, such as an autopilot run. An agent with the grant follows pstack's Shipping playbook.
- **Squash-merge. Land stacks bottom-up.** After the parent lands, rebase the child onto `main` and retarget its base to `main`.
- **Clean up at merge time.** Whenever a merge happens in a session (you merged it, or Victor says he did), clean only that branch: `git fetch --prune`, delete the local branch and its worktree, delete the remote branch if GitHub didn't, and rebase each child PR onto `main` with its base retargeted to `main`. Leave every other branch to `/housekeep`.
