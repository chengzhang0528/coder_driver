import fs from "node:fs";
import path from "node:path";

export function hasMachineSpecificWorkspacePath(text) {
  return /\b[A-Za-z]:[\\/][^\s`]+/.test(text);
}

function primaryCheckout(root) {
  // Linked worktrees record their owning Git directory; never guess a drive or checkout path.
  try {
    const pointer = fs.readFileSync(path.join(root, ".git"), "utf8").trim().match(/^gitdir: (.+)$/);
    if (!pointer) return null;
    const gitDir = path.resolve(root, pointer[1]);
    const common = path.resolve(gitDir, fs.readFileSync(path.join(gitDir, "commondir"), "utf8").trim());
    if (path.basename(common) !== ".git" || !fs.statSync(common).isDirectory()) return null;
    return path.dirname(common);
  } catch {
    return null;
  }
}

export function resolveDocumentReference({ root, docsRoot, source, raw, exists = fs.existsSync }) {
  let value = raw.trim().replace(/^`|`$/g, "");
  const link = value.match(/^\[[^\]]*\]\(([^)]+)\)$/);
  if (link) value = link[1];
  value = value.split("#", 1)[0].trim();
  if (!value || /^(?:https?:|mailto:|data:)/i.test(value)) return null;
  if (value.startsWith("<WORKSPACE_ROOT>/")) value = value.slice(17);
  else value = value.replace(/^<|>$/g, "");
  try {
    value = decodeURIComponent(value);
  } catch {
    // Keep the literal path so the caller can report the broken reference.
  }
  value = value.replaceAll("\\", "/");
  if (value.startsWith("/人类-文档/")) value = value.slice(1);

  if (/^(?:文档|人类-文档|\.agents\/skills)\//.test(value)) {
    return path.resolve(root, ...value.split("/"));
  }
  if (/^(?:项目|工作空间|工作流)\//.test(value)) {
    return path.resolve(docsRoot, ...value.split("/"));
  }
  if (["TASK_CONTROL.md", "WORK_CANDIDATES.md", "WORKSPACE_STRUCTURE.md"].includes(value)) {
    return path.join(docsRoot, value);
  }

  const localTarget = path.resolve(path.dirname(source), value);
  const workspaceTarget = path.resolve(root, ...value.split("/"));
  if (exists(workspaceTarget) && !exists(localTarget)) return workspaceTarget;
  if (!exists(localTarget)) {
    const relative = path.relative(root, localTarget);
    const parts = relative.split(path.sep);
    // Only missing sibling-project references may use the primary checkout's neighbors.
    // Missing files inside this worktree must remain errors, even if main has them.
    if (parts[0] === ".." && parts[1] && parts[1] !== ".." && !path.isAbsolute(relative)) {
      const primary = primaryCheckout(root);
      const siblingTarget = primary && path.resolve(primary, relative);
      if (siblingTarget && exists(siblingTarget)) return siblingTarget;
    }
  }
  return localTarget;
}
