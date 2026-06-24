const GITHUB_API_BASE = "https://api.github.com";

export interface RepoRef {
  owner: string;
  repo: string;
  branch: string;
}

export interface RepoTreeEntry {
  path: string;
  type: "blob" | "tree" | "commit";
  size?: number;
  sha: string;
}

export class GitHubApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function githubFetch(path: string) {
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: githubHeaders(),
    cache: "no-store",
  });

  if (res.status === 404) {
    throw new GitHubApiError("Repository not found or is private.", 404);
  }

  if (res.status === 403 || res.status === 429) {
    throw new GitHubApiError(
      "GitHub API rate limit exceeded. Set a GITHUB_TOKEN env var to increase the limit.",
      res.status
    );
  }

  if (!res.ok) {
    throw new GitHubApiError(
      `GitHub API request failed: ${res.status} ${res.statusText}`,
      res.status
    );
  }

  return res.json();
}

/**
 * Accepts the common GitHub URL shapes:
 * https://github.com/owner/repo
 * https://github.com/owner/repo.git
 * git@github.com:owner/repo.git
 * owner/repo
 */
export function parseGitHubUrl(repoUrl: string): { owner: string; repo: string } {
  const trimmed = repoUrl.trim().replace(/\.git$/i, "").replace(/\/+$/, "");

  const match = trimmed.match(/github\.com[/:]([^/\s]+)\/([^/\s]+)/i) ?? trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);

  if (!match) {
    throw new GitHubApiError("Invalid GitHub repository URL.", 400);
  }

  return { owner: match[1], repo: match[2] };
}

export async function getDefaultBranch(owner: string, repo: string): Promise<string> {
  const data = await githubFetch(`/repos/${owner}/${repo}`);
  return data.default_branch as string;
}

export async function resolveRepoRef(repoUrl: string): Promise<RepoRef> {
  const { owner, repo } = parseGitHubUrl(repoUrl);
  const branch = await getDefaultBranch(owner, repo);

  return { owner, repo, branch };
}

export async function getRepoTree(owner: string, repo: string, branch: string): Promise<RepoTreeEntry[]> {
  const data = await githubFetch(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );

  if (data.truncated) {
    console.warn(
      `Repository tree for ${owner}/${repo}@${branch} was truncated by the GitHub API (too many files).`
    );
  }

  return (data.tree as RepoTreeEntry[]).filter((entry) => entry.type === "blob");
}

export async function getFileContent(
  owner: string,
  repo: string,
  branch: string,
  filePath: string
): Promise<string> {
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodedPath}`;

  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) {
    throw new GitHubApiError("File not found", 404);
  }

  if (!res.ok) {
    throw new GitHubApiError(`Failed to fetch file content: ${filePath}`, res.status);
  }

  return res.text();
}

/**
 * repoId encodes {owner, repo, branch} so every route can be fully stateless —
 * no local clone or database lookup is needed to resolve a repository.
 */
export function encodeRepoId(ref: RepoRef): string {
  return Buffer.from(JSON.stringify(ref)).toString("base64url");
}

export function decodeRepoId(repoId: string): RepoRef {
  try {
    const data = JSON.parse(Buffer.from(repoId, "base64url").toString("utf-8"));

    if (!data?.owner || !data?.repo || !data?.branch) {
      throw new Error("missing fields");
    }

    return data as RepoRef;
  } catch {
    throw new GitHubApiError("Invalid repository id.", 400);
  }
}
