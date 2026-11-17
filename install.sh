#!/bin/sh
# Links vstack skills into ~/.claude/skills and loads vstack-mode in every session.
# Also registers the arch-map-check hook in ~/.claude/settings.json. Safe to rerun. Requires pstack (poteto-mode and its hook) installed first.
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

# Stable path for templates and hooks.
ln -sfn "$vstack" "$HOME/.claude/vstack"

# Register the arch-map-check hook once (PreToolUse on Bash).
settings="$HOME/.claude/settings.json"
hook='~/.claude/vstack/hooks/arch-map-check.sh'
[ -f "$settings" ] || echo '{}' > "$settings"
if ! grep -qF "$hook" "$settings"; then
  cp "$settings" "$settings.bak-vstack"
  jq --arg cmd "$hook" '.hooks.PreToolUse = ((.hooks.PreToolUse // []) + [{"matcher": "Bash", "hooks": [{"type": "command", "command": $cmd, "timeout": 10}]}])' \
    "$settings.bak-vstack" > "$settings"
fi

ls "$vstack"/skills
