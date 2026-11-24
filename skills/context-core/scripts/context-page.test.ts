import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { expect, test } from "bun:test";

const vh = join(import.meta.dir, "vh.mjs");

function context(id: string, state: string, summary: string) {
	return {
		schema_version: 1,
		kind: "context",
		context_id: id,
		type: "decision",
		state,
		summary,
		detail: `Detail of ${id}.`,
		tags: ["demo"],
		source: { ref: "conversation:demo", quote: `Quote of ${id}.`, captured_at: "2026-01-02T03:04:05.000Z" },
		evidence: [{ ref: "https://example.com/proof", note: `Evidence of ${id}.` }],
		relations: [],
	};
}

test("context page lists every record under its room, active first, then recent runs, and leaves the repo untouched", () => {
	const dir = mkdtempSync(join(tmpdir(), "context-page-"));
	try {
		const repo = join(dir, "demo-repo");
		const room = join(repo, ".vibehub", "rooms", "design");
		mkdirSync(room, { recursive: true });
		writeFileSync(
			join(room, "room.yaml"),
			JSON.stringify({
				schema_version: 1,
				kind: "room",
				room_id: "design",
				description: "Design decisions.",
				boundary: "Owns design.",
				anchors: [],
				stale: false,
			}),
		);
		writeFileSync(join(room, "a-old.yaml"), JSON.stringify(context("a-old", "superseded", "Old <b>rule</b>")));
		writeFileSync(join(room, "b-new.yaml"), JSON.stringify(context("b-new", "active", "New rule")));
		const runs = join(repo, ".vibehub", "runs");
		mkdirSync(runs);
		writeFileSync(
			join(runs, "2026-01-02-night-port.tsv"),
			"ts\tphase\tdecision\twhy\tevidence\tresult\n2026-01-02T03:04:05Z\twidget\tmoved <i>styles</i>\tkeep it small\tpixel-diff 0\ttests green\n",
		);
		const filesBefore = readdirSync(repo, { recursive: true }).sort();
		const out = join(dir, "out", "page.html");

		const result = spawnSync("node", [vh, "context", "page", "--repo", repo, "--out", out], { encoding: "utf8" });

		expect(JSON.parse(result.stdout)).toEqual({
			ok: true,
			data: { status: "written", path: out, rooms: 1, runs: 1, contexts: 2, active: 1 },
		});
		const html = readFileSync(out, "utf8");
		expect(html).toContain("<title>demo-repo context</title>");
		expect(html.match(/<details class="record[^>]* id="c-/g)).toHaveLength(2);
		expect(html.indexOf("New rule")).toBeLessThan(html.indexOf("Old &lt;b&gt;rule&lt;/b&gt;"));
		expect(html).toContain("Quote of a-old.");
		expect(html).not.toContain("<b>rule");
		expect(html).toContain("2026-01-02-night-port");
		expect(html).toContain("moved &lt;i&gt;styles&lt;/i&gt;");
		expect(html.indexOf("New rule")).toBeLessThan(html.indexOf("Recent runs"));
		expect(html).not.toContain("<script");
		expect(readdirSync(repo, { recursive: true }).sort()).toEqual(filesBefore);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});
