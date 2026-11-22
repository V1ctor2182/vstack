#!/bin/sh
# Installs vstack for Claude Code: links skills and agents, turns vstack on in every session,
# and registers the arch-map-check hook. Safe to rerun.
# Retires an old pstack install (~/.claude/pstack and its copied skills) by moving it to a backup folder.
set -eu

vstack="$(cd "$(dirname "$0")" && pwd)"
claude="$HOME/.claude"
backup="$claude/vstack-backup/$(date +%Y%m%d-%H%M%S)"
settings="$claude/settings.json"
moved=""

# Move a real file or folder out of the way before a link takes its place.
make_room() {
  if [ -e "$1" ] && [ ! -L "$1" ]; then
    mkdir -p "$backup/$2"
    mv "$1" "$backup/$2/"
    moved=1
  fi
}

mkdir -p "$claude/skills" "$claude/agents"
for dir in "$vstack"/skills/*/; do
  name="$(basename "$dir")"
  make_room "$claude/skills/$name" skills
  ln -sfn "${dir%/}" "$claude/skills/$name"
done
for file in "$vstack"/agents/*.md; do
  name="$(basename "$file")"
  make_room "$claude/agents/$name" agents
  ln -sfn "$file" "$claude/agents/$name"
done

# Stable path for hooks, templates, and NOTICE.md.
ln -sfn "$vstack" "$claude/vstack"

make_room "$claude/pstack" .

# Hooks: drop the old pstack hook, then add vstack's once.
[ -f "$settings" ] || echo '{}' > "$settings"
cp "$settings" "$settings.bak-vstack"
jq '
  def add($event; $matcher; $cmd):
    if any(.hooks[$event][]?.hooks[]?; .command == $cmd) then .
    else .hooks[$event] = ((.hooks[$event] // []) + [({"hooks": [{"type": "command", "command": $cmd, "timeout": 10}]} + (if $matcher then {"matcher": $matcher} else {} end))])
    end;
  .hooks = ((.hooks // {}) | with_entries(.value |= map(select(all(.hooks[]?; (.command // "") | contains("/.claude/pstack/hook.sh") | not))))) |
  add("SessionStart"; null; "~/.claude/vstack/hooks/session.sh session") |
  add("UserPromptSubmit"; null; "~/.claude/vstack/hooks/session.sh prompt") |
  add("PreToolUse"; "Bash"; "~/.claude/vstack/hooks/arch-map-check.sh")
' "$settings.bak-vstack" > "$settings"

if [ -n "$moved" ]; then echo "Moved replaced files to $backup"; fi
echo "vstack installed: $(ls "$vstack"/skills | wc -l | tr -d ' ') skills, $(ls "$vstack"/agents | wc -l | tr -d ' ') agents"
