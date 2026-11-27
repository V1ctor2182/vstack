#!/bin/sh
# Installs vstack for Claude Code: links skills and agents, removes links to ones it dropped, turns vstack on in every session,
# and registers the arch-map-check hook. Safe to rerun.
# Ends with a check of the outside tools vstack points to. `./install.sh --check` runs only that check.
# Retires an old pstack install (~/.claude/pstack and its copied skills) by moving it to a backup folder.
set -eu

vstack="$(cd "$(dirname "$0")" && pwd)"
claude="$HOME/.claude"
backup="$claude/vstack-backup/$(date +%Y%m%d-%H%M%S)"
settings="$claude/settings.json"
moved=""

# Print one line per outside tool: ok, or missing with the command that fixes it. Never exits on a miss.
report() {
  if [ "$2" = yes ]; then printf '  %-16s ok\n' "$1"; else printf '  %-16s missing -> %s\n' "$1" "$3"; missing=1; fi
}
has_cmd() { if command -v "$1" >/dev/null 2>&1; then echo yes; else echo no; fi; }
has_mcp() {
  if command -v jq >/dev/null 2>&1 && [ -f "$HOME/.claude.json" ] &&
    jq -e --arg n "$1" '.mcpServers[$n] // empty' "$HOME/.claude.json" >/dev/null 2>&1; then echo yes; else echo no; fi
}
mcp_fix() {
  echo "on a machine that has it run 'claude mcp get $1' for the URL, then: claude mcp add --transport http --scope user $1 <url> --header 'Authorization: Bearer <access code>'"
}
check() {
  missing=""
  echo "vstack check:"
  report "skills" "$(if [ -f "$claude/skills/vstack-mode/SKILL.md" ]; then echo yes; else echo no; fi)" "run ./install.sh"
  report "jq" "$(has_cmd jq)" "brew install jq"
  report "gh" "$(has_cmd gh)" "brew install gh, then: gh auth login"
  report "node" "$(has_cmd node)" "brew install node"
  report "factory" "$(has_cmd factory)" "clone the tool factory, then: ln -s <tool-factory>/factory/bin/factory.mjs ~/.local/bin/factory"
  report "writing-style" "$(if [ -f "$claude/skills/writing-style/SKILL.md" ]; then echo yes; else echo no; fi)" "in a tool factory checkout that stays on main: node factory/bin/factory.mjs link writing-style --global"
  report "victor-ui" "$(has_mcp victor-ui)" "$(mcp_fix victor-ui)"
  report "artifact-index" "$(has_mcp artifact-index)" "$(mcp_fix artifact-index)"
  report "nomi" "$(has_mcp nomi)" "$(mcp_fix nomi)"
  if [ -n "$missing" ]; then echo "Some tools are missing. vstack still loads. The rules that name them will say so."; fi
}
if [ "${1:-}" = "--check" ]; then check; exit 0; fi
if ! command -v jq >/dev/null 2>&1; then echo "install.sh needs jq to edit $settings. Run: brew install jq" >&2; exit 1; fi

# Move a real file or folder out of the way before a link takes its place.
make_room() {
  if [ -e "$1" ] && [ ! -L "$1" ]; then
    mkdir -p "$backup/$2"
    mv "$1" "$backup/$2/"
    moved=1
  fi
}

mkdir -p "$claude/skills" "$claude/agents"
# Drop links to skills and agents this repo no longer has.
for link in "$claude"/skills/* "$claude"/agents/*; do
  [ -L "$link" ] || continue
  case "$(readlink "$link")" in "$vstack"/*) [ -e "$link" ] || rm "$link" ;; esac
done
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
check
