import { getFileContent, getRepoTree, type RepoRef } from "@/lib/github";
import { withCache } from "@/lib/githubCache";

const ALLOWED_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".md", ".json"];

const IGNORED_PATH_SEGMENTS = [
  "node_modules",
  ".git",
  ".next",
  ".github",
  ".husky",
  "dist",
  "build",
];

function isIgnoredPath(filePath: string): boolean {
  return filePath.split("/").some((segment) => IGNORED_PATH_SEGMENTS.includes(segment));
}

function extname(filePath: string): string {
  const name = filePath.split("/").pop() || "";
  const dot = name.lastIndexOf(".");

  return dot === -1 ? "" : name.slice(dot);
}

export async function listRepositoryFiles(ref: RepoRef): Promise<string[]> {
  const tree = await withCache(
    `tree:${ref.owner}/${ref.repo}/${ref.branch}`,
    () => getRepoTree(ref.owner, ref.repo, ref.branch)
  );

  return tree.filter((entry) => !isIgnoredPath(entry.path)).map((entry) => entry.path);
}

export async function getRepositoryContext(ref: RepoRef): Promise<string> {
  return withCache(`context:${ref.owner}/${ref.repo}/${ref.branch}`, async () => {
    const tree = await getRepoTree(ref.owner, ref.repo, ref.branch);

    const importantFiles = tree
      .filter((entry) => !isIgnoredPath(entry.path))
      .filter((entry) => ALLOWED_EXTENSIONS.includes(extname(entry.path)))
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, 10);

    const files = await Promise.all(
      importantFiles.map(async (entry) => {
        try {
          const content = await getFileContent(ref.owner, ref.repo, ref.branch, entry.path);
          return { path: entry.path, content };
        } catch (error) {
          console.error(`Failed to fetch ${entry.path}:`, error);
          return null;
        }
      })
    );

    let context = "";

    for (const file of files) {
      if (!file) continue;

      context += `
FILE: ${file.path}

${file.content.slice(0, 2000)}

--------------------------------
`;
    }

    return context;
  });
}
