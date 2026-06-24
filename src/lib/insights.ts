import { getRepoTree, type RepoRef } from "@/lib/github";
import { withCache } from "@/lib/githubCache";
import type { HealthRating, RepositoryHealth } from "@/models/Repository";

export interface RepositoryInsights {
  totalFiles: number;
  typescriptFiles: number;
  javascriptFiles: number;
  testFiles: number;
  configFiles: number;
}

export async function getRepositoryInsights(
  ref: RepoRef
): Promise<RepositoryInsights> {
  const tree = await withCache(
    `tree:${ref.owner}/${ref.repo}/${ref.branch}`,
    () => getRepoTree(ref.owner, ref.repo, ref.branch)
  );

  let totalFiles = 0;
  let typescriptFiles = 0;
  let javascriptFiles = 0;
  let testFiles = 0;
  let configFiles = 0;

  for (const entry of tree) {
    if (entry.path.split("/").includes("node_modules")) continue;

    totalFiles++;

    const name = entry.path.split("/").pop() || "";
    const dot = name.lastIndexOf(".");
    const ext = dot === -1 ? "" : name.slice(dot);

    if (ext === ".ts" || ext === ".tsx") typescriptFiles++;
    if (ext === ".js" || ext === ".jsx") javascriptFiles++;
    if (name.includes(".test")) testFiles++;
    if (name.includes("config")) configFiles++;
  }

  return {
    totalFiles,
    typescriptFiles,
    javascriptFiles,
    testFiles,
    configFiles,
  };
}

function rate(ratio: number): HealthRating {
  if (ratio >= 0.6) return "Excellent";
  if (ratio >= 0.3) return "Good";
  if (ratio > 0) return "Average";
  return "Poor";
}

// Deterministic heuristic derived from the existing file-tree insights —
// no extra AI call, so it stays fast and free to compute on every analysis.
export function computeRepositoryHealth(
  insights: RepositoryInsights
): RepositoryHealth {
  const codeFiles = insights.typescriptFiles + insights.javascriptFiles;

  const testRatio = codeFiles > 0 ? insights.testFiles / codeFiles : 0;
  const typeRatio = codeFiles > 0 ? insights.typescriptFiles / codeFiles : 0;
  const hasConfig = insights.configFiles > 0;

  const score = Math.round(
    Math.min(100, typeRatio * 40 + testRatio * 40 + (hasConfig ? 20 : 5))
  );

  return {
    score,
    testCoverage: rate(testRatio),
    documentation: hasConfig ? "Good" : "Average",
    typeSafety: rate(typeRatio),
  };
}
