import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const skipDirs = new Set(["node_modules", ".git", "test"]);
const skipFiles = new Set(["index.js", "scripts/ingest-products.js"]);

async function walk(dir, output = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, output);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".js")) {
      const relative = path.relative(root, fullPath).replaceAll("\\", "/");
      if (!skipFiles.has(relative)) output.push(fullPath);
    }
  }
  return output;
}

function checkSyntax(file) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "pipe" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    throw new Error(`Syntax check failed for ${file}`);
  }
}

const files = await walk(root);

for (const file of files) {
  checkSyntax(file);
}

for (const file of files) {
  await import(pathToFileURL(file).href);
}

const { chatbotGraph } = await import(pathToFileURL(path.join(root, "graph", "chatbot.graph.js")).href);
const graph = await chatbotGraph.getGraphAsync();
const nodeNames = Object.keys(graph.nodes);
for (const expected of ["understandTurn", "discoverProducts", "productInfo", "chat", "clarify"]) {
  if (!nodeNames.includes(expected)) {
    throw new Error(`Graph node missing: ${expected}`);
  }
}

console.log(`Verified ${files.length} JavaScript files and LangGraph topology.`);
