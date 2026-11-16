---
name: principle-earn-every-test
description: "Apply when you are about to add, expand, or edit a test. Write the fewest tests that catch real bugs; no test you can't name the bug for, and no rewriting an expectation to make it pass."
disable-model-invocation: true
---

# Earn Every Test

A test costs reading time, runtime, and a rewrite on every refactor. It pays only when it catches a bug a plausible change would introduce. Write fewer, better tests. This principle sets how many. The **principle-test-behavior-not-implementation** skill sets what each one asserts.

- **Name the bug first.** Before writing a test, say in one line which realistic mistake it catches. If you can't, don't write it.
- **Budget per change.** For each behavior you changed, one test on the main path, plus one per edge case the contract names. Nothing for code you didn't change.
- **Skip what can't break.** No tests of framework or library behavior, getters and setters, restated constants, types the compiler already checks, or pass-through wrappers. No second case that drives the same branch with different data.
- **Extend before adding.** Add a case to an existing test before creating a new test or file. Delete a duplicate or implementation-pinned test before adding one beside it.
- **Don't overwrite to pass.** Never change an existing test's expected value to make it green. Change it only when the requirement changed, and name that requirement in the reply.
- **A check is not a test.** Proving a change works on the real artifact (the **principle-prove-it-works** skill) is often a one-off run. Don't promote it to a permanent test unless it guards a bug likely to come back.

**In the reply:** one line per test added or changed, naming the bug it catches. A test with no line gets deleted.
