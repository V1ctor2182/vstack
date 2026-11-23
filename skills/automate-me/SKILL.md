---
name: automate-me
description: "Use for \"automate me\", \"update my rules from my sessions\", or \"what should vstack learn\". Mines recent sessions for repeated corrections and proposes at most three rule changes as issues."
disable-model-invocation: true
---

# Automate me

Keeps vstack matched to how the human works. It reads what they said in recent sessions, finds what they keep correcting, and proposes small changes to existing rules. It never edits a rule itself.

## Flow

1. **Find the window.** Sessions since this skill last ran. Read the date from the newest issue labeled `automate-me` in the vstack repo. With none, take the last four weeks.
2. **Mine.** Claude Code transcripts live in `~/.claude/projects/*/*.jsonl`. Extract the human's messages with a script, not by reading files (**principle-build-the-lever**). For a large window, split by time and give each slice to a subagent that returns counts and quotes.
3. **Count three things.**
   - Corrections, grouped by what went wrong: didn't understand, did too much, looks bad, wasn't verified, acted without asking. Give each as a rate per 100 messages, next to the rate from the last run.
   - Which skills and playbooks agents opened, and how often.
   - Design directions the human picked, and what the picked ones share.
4. **Check before proposing.** For each candidate, find the existing rule that should have covered it, and change that rule. Add a file only when nothing covers it (**principle-laziness-protocol**). A correction seen once is noise. Require two.
5. **Propose at most three changes.** One `proposed` issue each in the vstack repo, also labeled `automate-me` (**principle-proposals-become-issues**). Each has the human's words, the count, the file, and the exact lines to add or remove. Removing a rule that changed nothing is a valid proposal. So is deleting a skill nobody opened.
6. **Reply** with the rates table and the issue links.

## Guardrails

- `vstack-mode` has a budget of 150 lines. A proposal that adds lines to it names the lines it removes.
- Taste goes into examples, not rules. A look the human picked twice becomes a component proposal for victor-ui or a line in that project's `DESIGN.md`, not a principle.
- Read only the human's own sessions on this machine.
