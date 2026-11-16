---
name: principle-continuous-housekeeping
description: "Apply before finishing any change, and when running a housekeeping sweep on a project. Leave what you touched cleaner than you found it, clean up after yourself, and sweep the whole project on a schedule so mess never piles up."
disable-model-invocation: true
---

# Continuous Housekeeping

Mess compounds. Dead code, stale docs, and abandoned branches get copied by the next agent and hide what the system really is. Clean a little on every change and sweep the whole project regularly, so no big cleanup is ever needed.

## On every change

Before finishing, clean what this change touched:

- **Your own leftovers.** Debug prints, commented-out code, temp files, unused imports, and dependencies you added and no longer use.
- **The files you edited.** Dead code, stale comments, and TODOs that this change resolved or made wrong.
- **Your own branches and worktrees.** Remove them once their work is merged.

Put cleanup in its own commit, separate from behavior changes. Stay inside what you touched. Mess you notice elsewhere becomes one `housekeeping` issue per sweep-sized batch, per the **principle-proposals-become-issues** skill.

## The sweep

A sweep is a pass over one whole project. Check:

- **Dead weight.** Unused code, exports, files, and dependencies.
- **Drift.** `ARCHITECTURE.md` against the code (the **principle-keep-the-architecture-map** skill), and README and setup steps against what actually runs.
- **Tests.** Flaky, skipped, duplicate, or useless tests (the **principle-earn-every-test** skill).
- **Git.** Merged or abandoned branches and worktrees (pstack's `playbooks/worktree-cleanup.md`).
- **Issues and TODOs.** Issues that are done or stale, and TODOs with no issue.
- **Dependencies.** Outdated packages and known vulnerabilities.

Fix what is small, reversible, and changes no behavior, in one PR. Everything else becomes an issue labeled `housekeeping` and `proposed`. Pause before anything irreversible, such as deleting an unmerged branch or uncommitted work.

**In the reply:** what was cleaned, and the issues filed.
