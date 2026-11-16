---
name: principle-proposals-become-issues
description: "Apply when you propose work you are not doing in this change: a follow-up, refactor, new rule, or 'we should'. File it as a GitHub issue labeled proposed. Only issues labeled approved, or ones the user explicitly OKs, are real work."
disable-model-invocation: true
---

# Proposals Become Issues

A proposal that lives only in chat is lost when the chat ends. Write it down where it can be approved, tracked, and picked up by another agent.

- **File it.** Every out-of-scope proposal becomes a GitHub issue in the repo it touches, labeled `proposed`. If no repo fits, file it in `V1ctor2182/vstack`. The reply links the issue instead of restating the proposal.
- **Keep it short.** Body: the problem, the evidence (`file:line`, a link, a log), the proposed change, and what done looks like.
- **Search first.** If an open issue covers it, comment there instead of filing a duplicate.
- **`proposed` is not work.** Never implement a `proposed` issue. Work starts only when the issue carries `approved`, or when the user explicitly OKs that specific issue in chat. Then add the `approved` label yourself and note the approval in a comment. Approval is per issue, never blanket.
- **Don't file noise.** In-scope work you were asked for: just do it. File only proposals that need the user's decision.

This narrows the **principle-never-block-on-the-human** skill: reversible in-scope work still proceeds without asking. Out-of-scope ideas become issues, not unasked-for code.
