import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { hasMachineSpecificWorkspacePath, resolveDocumentReference } from "./check-docs-references.mjs";

test("accepts official web citations without mistaking URL schemes for drive letters", () => {
  assert.equal(hasMachineSpecificWorkspacePath("[Source](https://learn.microsoft.com/example)"), false);
  assert.equal(hasMachineSpecificWorkspacePath("[Local service](http://localhost:5320/)"), false);
});

test("still detects machine-specific paths in links, code and Chinese prose", () => {
  assert.equal(hasMachineSpecificWorkspacePath("[Source](D:/checkout/source.md)"), true);
  assert.equal(hasMachineSpecificWorkspacePath("`C:\\checkout\\source.md`"), true);
  assert.equal(hasMachineSpecificWorkspacePath("目录D:/checkout/source.md"), true);
  assert.equal(hasMachineSpecificWorkspacePath("https://example.org/ and D:/checkout/source.md"), true);
});

async function createFixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "check-docs-references-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const docsRoot = path.join(root, "文档");
  const projectRoot = path.join(docsRoot, "项目", "项目_demo");
  const source = path.join(projectRoot, "AGENTS.md");
  await mkdir(path.join(root, "app", "src"), { recursive: true });
  await mkdir(path.join(root, ".agents", "skills", "example"), { recursive: true });
  await mkdir(path.join(projectRoot, "技术设计"), { recursive: true });
  await mkdir(path.join(docsRoot, "工作流"), { recursive: true });
  await writeFile(source, "# demo\n", "utf8");
  await writeFile(path.join(root, "app", "src", "main.ts"), "export {};\n", "utf8");
  await writeFile(path.join(root, ".agents", "skills", "example", "SKILL.md"), "# example\n", "utf8");
  await writeFile(path.join(projectRoot, "技术设计", "DOC-0001.md"), "# design\n", "utf8");
  await writeFile(path.join(docsRoot, "工作流", "WF-0001.md"), "# workflow\n", "utf8");
  return { root, docsRoot, source, projectRoot };
}

test("resolves an existing arbitrary source root from workspace documents", async (t) => {
  const fixture = await createFixture(t);
  assert.equal(
    resolveDocumentReference({ ...fixture, raw: "app/src/main.ts" }),
    path.join(fixture.root, "app", "src", "main.ts"),
  );
});

test("prefers an existing document-local reference", async (t) => {
  const fixture = await createFixture(t);
  assert.equal(
    resolveDocumentReference({ ...fixture, raw: "技术设计/DOC-0001.md" }),
    path.join(fixture.projectRoot, "技术设计", "DOC-0001.md"),
  );
});

test("resolves governed document roots without product-specific names", async (t) => {
  const fixture = await createFixture(t);
  assert.equal(
    resolveDocumentReference({ ...fixture, raw: "工作流/WF-0001.md" }),
    path.join(fixture.docsRoot, "工作流", "WF-0001.md"),
  );
  assert.equal(
    resolveDocumentReference({ ...fixture, raw: "文档/TASK_CONTROL.md" }),
    path.join(fixture.docsRoot, "TASK_CONTROL.md"),
  );
  assert.equal(
    resolveDocumentReference({ ...fixture, raw: ".agents/skills/example/SKILL.md" }),
    path.join(fixture.root, ".agents", "skills", "example", "SKILL.md"),
  );
});

test("linked worktrees resolve missing sibling sources beside their primary checkout only", async (t) => {
  const fixture = await createFixture(t);
  const primary = path.join(fixture.root, "primary", "project");
  const linked = path.join(fixture.root, "linked", "project");
  const gitDir = path.join(primary, ".git", "worktrees", "linked");
  await mkdir(gitDir, { recursive: true });
  await mkdir(linked, { recursive: true });
  await mkdir(path.join(primary, "..", "model"), { recursive: true });
  await writeFile(path.join(linked, ".git"), `gitdir: ${gitDir}\n`);
  await writeFile(path.join(gitDir, "commondir"), "../..\n");
  const expected = path.resolve(primary, "../model/domain.md");
  await writeFile(expected, "domain");
  await writeFile(path.join(primary, "only-main.md"), "not in linked checkout");
  const resolve = raw => resolveDocumentReference({ root: linked, docsRoot: path.join(linked, "文档"), source: path.join(linked, "AGENTS.md"), raw });
  assert.equal(resolve("../model/domain.md"), expected);
  assert.equal(resolve("../model/missing.md"), path.resolve(linked, "../model/missing.md"));
  assert.equal(resolve("only-main.md"), path.join(linked, "only-main.md"));
  await mkdir(path.resolve(linked, "../model"));
  await writeFile(path.resolve(linked, "../model/domain.md"), "local wins");
  assert.equal(resolve("../model/domain.md"), path.resolve(linked, "../model/domain.md"));
});
