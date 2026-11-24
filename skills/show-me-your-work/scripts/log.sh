#!/usr/bin/env bash
# Append a well-formed row to a show-me-your-work decision log (TSV).
# Usage: log.sh <task-slug|logfile> <phase> <decision> <why> <evidence> <result>
# A first argument with no "/" and no ".tsv" is a task slug. It resolves to
# .vibehub/runs/<date>-<slug>.tsv at the repo root, and to the file that slug
# already has when one exists, so a run that crosses midnight keeps one log.
set -euo pipefail

if [ "$#" -ne 6 ]; then
	printf 'usage: log.sh <task-slug|logfile> <phase> <decision> <why> <evidence> <result>\n' >&2
	exit 1
fi

logfile="$1"
shift

case "$logfile" in
	*/*|*.tsv) ;;
	*)
		runs="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/.vibehub/runs"
		existing="$(ls "$runs"/????-??-??-"$logfile".tsv 2>/dev/null | tail -n 1 || true)"
		logfile="${existing:-$runs/$(date -u +%Y-%m-%d)-$logfile.tsv}"
		;;
esac

logdir="$(dirname "$logfile")"
if [ -n "$logdir" ] && [ "$logdir" != "." ] && [ ! -d "$logdir" ]; then
	mkdir -p "$logdir"
fi

# Use `>>` here, never `>`. A network mount can fail this test for a log
# that exists. Then the cost is one stray header line, not the rows.
if [ ! -s "$logfile" ]; then
	printf 'ts\tphase\tdecision\twhy\tevidence\tresult\n' >> "$logfile"
fi

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
# Strip tabs/newlines/CR so cells stay on one line, and prefix any cell
# whose first char a spreadsheet would parse as a formula (=, +, -, @)
# with a single quote. The skill expects this log to be read in
# spreadsheets, so attacker-controlled evidence (PR titles, filenames,
# generated text) must not become formula execution when a reviewer
# opens the file.
clean() {
	local v
	v=$(printf '%s' "$1" | tr '\t\n\r' '   ')
	case "$v" in
		=*|+*|-*|@*) printf "'%s" "$v" ;;
		*) printf '%s' "$v" ;;
	esac
}
printf '%s\t%s\t%s\t%s\t%s\t%s\n' \
	"$ts" "$(clean "$1")" "$(clean "$2")" "$(clean "$3")" "$(clean "$4")" "$(clean "$5")" \
	>> "$logfile"
