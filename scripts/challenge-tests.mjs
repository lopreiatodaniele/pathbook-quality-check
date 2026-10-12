import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = path.resolve(import.meta.dir, "..");
await fs.mkdir(path.join(root, "tmp"), { recursive: true });
const isolated = await fs.mkdtemp(path.join(root, "tmp/project-challenge-"));
for (const file of ["package.json", "tsconfig.json", "vitest.project.config.ts", "tests/setup.ts", "tests/helpers.ts", "src/model.ts", "src/controller.ts", "src/debounce.ts", "src/BookingForm.tsx", "project/regression.test.tsx"]) { const target = path.join(isolated, file); await fs.mkdir(path.dirname(target), { recursive: true }); await fs.copyFile(path.join(root, file), target); }
// Resolution climbs to this lab's existing frozen-installed node_modules.
const mutants = [
  ["upper-boundary", "src/model.ts", "value <= 3", "value < 3"],
  ["lost-draft", "src/BookingForm.tsx", "/* Preserve the rejected draft. */", 'setTitle("");'],
  ["stale-success", "src/controller.ts", "if (token !== intent) return false;", "/* Obsolete success is no longer guarded. */"],
  ["missing-name", "src/BookingForm.tsx", 'htmlFor="workshop-title"', 'htmlFor="missing-title"'],
];
const originals = new Map(); for (const [, file] of mutants) originals.set(file, await fs.readFile(path.join(isolated, file), "utf8"));
function run(name) {
  const report = path.join(isolated, `${name}.json`), result = spawnSync(process.execPath, ["--bun", "run", path.join(root, "node_modules/vitest/vitest.mjs"), "run", "--config", "vitest.project.config.ts", "--reporter=json", `--outputFile=${report}`], { cwd: isolated, encoding: "utf8", timeout: 60000 });
  assert([0, 1].includes(result.status), result.stderr);
  return { result, report };
}
const base = run("baseline"); assert.equal(base.result.status, 0, base.result.stdout + base.result.stderr);
const survived = [];
for (const [name, file, before, after] of mutants) {
  const source = originals.get(file); assert(source.includes(before), `Missing mutation target: ${name}`);
  await fs.writeFile(path.join(isolated, file), source.replace(before, after));
  const check = run(name), report = JSON.parse(await fs.readFile(check.report, "utf8"));
  if (check.result.status === 0) survived.push(name);
  else assert(report.numFailedTests > 0 && report.testResults.some(suite => suite.assertionResults.some(test => test.status === "failed")), `${name}: an import/compile failure is not behavioral detection`);
  await fs.writeFile(path.join(isolated, file), source);
}
console.log(`Project baseline is green. Isolated reports: ${isolated}`);
if (survived.length) { console.error(`Strengthen independent tests: surviving behavioral defects: ${survived.join(", ")}`); process.exitCode = 1; }
else console.log("All four declared compiling defects are detected by unchanged project assertions. This is not a general mutation score.");
