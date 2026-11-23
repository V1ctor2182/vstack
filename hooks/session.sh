#!/bin/sh
# Turns vstack on for every Claude Code session. install.sh wires it into ~/.claude/settings.json.
here="$(cd "$(dirname "$0")" && pwd)"
case "$1" in
  session) cat "$here/session.md" ;;
  prompt) echo "vstack-mode: New task? Large or risky -> open the matching playbook. Casual turn or user opts out -> don't." ;;
esac
