#!/bin/sh
# Links vstack skills into ~/.claude/skills and loads vstack-mode in every session.
# Safe to rerun. Requires pstack (poteto-mode and its hook) installed first.
set -eu

vstack="$(cd "$(dirname "$0")" && pwd)"
skills="$HOME/.claude/skills"
pstack_md="$HOME/.claude/pstack/PSTACK.md"
marker="<!-- vstack -->"

mkdir -p "$skills"
for dir in "$vstack"/skills/*/; do
  name="$(basename "$dir")"
  ln -sfn "${dir%/}" "$skills/$name"
done

if [ -f "$pstack_md" ] && ! grep -qF "$marker" "$pstack_md"; then
  printf '\n%s\n## vstack is on\n\nAfter poteto-mode, Read `~/.claude/skills/vstack-mode/SKILL.md` in full and follow it. It wins where it conflicts with poteto-mode.\n' "$marker" >> "$pstack_md"
fi

ls "$vstack"/skills
