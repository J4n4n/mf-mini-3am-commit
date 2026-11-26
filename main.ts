// 3 AM commit — the message you push at 3 AM and regret at 9 AM.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;

function resolvePaths() {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  return { source: join(botDir, "entry.txt"), target: join(outDir, "entry.txt"), outDir };
}

function stageEntry(source: string, target: string, outDir: string): string {
  mkdirSync(outDir, { recursive: true });
  copyFileSync(source, target);
  const raw = readFileSync(target, "utf8");
  // Strip just the trailing newline added by the editor; keep everything else intact.
  const trimmed = raw.endsWith("\n") ? raw.slice(0, -1) : raw;
  return trimmed;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function checkLength(text: string): void {
  if (text.length > MAX_CHARS) {
    fail(`Error: entry is ${text.length} characters, over the ${MAX_CHARS} character limit.`);
  }
  if (text.length === 0) {
    fail("Error: entry.txt is empty.");
  }
}

const { source, target, outDir } = resolvePaths();
const entry = stageEntry(source, target, outDir);
checkLength(entry);

console.log(`Character count: ${entry.length}`);
console.log(entry);
