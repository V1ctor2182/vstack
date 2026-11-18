#!/bin/bash
# Claude Code PreToolUse hook (Bash). Blocks an agent's `git commit` in Victor's repos
# when the change reshapes the project but leaves ARCHITECTURE.md untouched.
# See skills/principle-keep-the-architecture-map. Exit 2 blocks; stderr goes to the agent.
set -u

input="$(cat)"
cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"
case "$cmd" in *"git commit"*) ;; *) exit 0 ;; esac
case "$cmd" in *"Arch-Map: unchanged"*) exit 0 ;; esac

dir="$(printf '%s' "$input" | jq -r '.cwd // empty')"
# Follow every `cd <dir>` before the commit, in order, so the commit's own repo is checked.
before_commit="${cmd%%git commit*}"
while read -r target; do
  [ -n "$target" ] || continue
  dir="$(cd "${dir:-.}" 2>/dev/null && cd "${target/#\~/$HOME}" 2>/dev/null && pwd)" || exit 0
done <<EOF
$(printf '%s\n' "$before_commit" | grep -oE '(^|[;&|[:space:]])cd[[:space:]]+[^;&|[:space:]]+' | sed -E 's/^.*cd[[:space:]]+//')
EOF
cd "${dir:-.}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

origin="$(git remote get-url origin 2>/dev/null || true)"
if [ -n "$origin" ]; then
  case "$origin" in *github.com[:/]V1ctor2182/*) ;; *) exit 0 ;; esac
fi

# Files that will be in the commit's tree. If the command stages too, count the working tree.
if printf '%s' "$cmd" | grep -Eq 'git add|git commit[^;&|]*[[:space:]](-a|-[a-zA-Z]*a[a-zA-Z]*|--all)([[:space:]]|$)'; then
  after="$( { git ls-files --cached --others --exclude-standard; } | grep -vxF -f <(git ls-files --deleted) | sort -u)"
  changed="$( { git diff HEAD --name-only 2>/dev/null; git diff --cached --name-only; git ls-files --others --exclude-standard; } | sort -u)"
else
  after="$(git ls-files --cached | sort -u)"
  changed="$(git diff --cached --name-only | sort -u)"
fi
before="$(git ls-tree -r --name-only HEAD 2>/dev/null | sort -u)"

[ -z "$changed" ] && exit 0
printf '%s\n' "$changed" | grep -qx 'ARCHITECTURE.md' && exit 0

# Structural units: top-level dirs, first-level dirs under module roots, manifests, infra files.
units() {
  awk -F/ '
    $1 == ".vibehub" { next }
    NF > 1 { print "dir " $1 }
    NF > 2 && $1 ~ /^(src|apps|packages|services|lib)$/ { print "dir " $1 "/" $2 }
    { n = $NF }
    n ~ /^(package\.json|pyproject\.toml|go\.mod|Cargo\.toml)$/ { print "manifest " $0 }
    n ~ /Dockerfile/ || n ~ /^(docker-)?compose.*\.ya?ml$/ || n ~ /\.tf$/ ||
      $0 ~ /^(k8s|kubernetes|helm|\.github\/workflows)\// { print "infra " $0 }
  ' | sort -u
}
hits="$(comm -3 <(printf '%s\n' "$before" | units) <(printf '%s\n' "$after" | units) |
  sed -e 's/^\t/added: /' -e '/^added: /!s/^/removed: /')"
[ -z "$hits" ] && exit 0

if [ -f ARCHITECTURE.md ]; then
  fix="Update ARCHITECTURE.md in this commit (Components, Diagram, Key flows as needed) and refresh Last verified."
else
  fix="This repo has no ARCHITECTURE.md. Create it from ~/.claude/vstack/templates/ARCHITECTURE.md in this commit."
fi
{
  echo "arch-map-check: this commit changes the project's structure but not ARCHITECTURE.md."
  printf '%s\n' "$hits" | head -20 | sed 's/^/  /'
  echo "$fix"
  echo "If the shape truly didn't change, add the trailer 'Arch-Map: unchanged — <reason>' to the commit message."
} >&2
exit 2
