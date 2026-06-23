import simpleGit from "simple-git";
import path from "path";

export function getRepoPath(repoId: string) {
  return path.join(process.cwd(), "repos", repoId);
}

export async function cloneRepository(repoUrl: string) {
  const repoName = Date.now().toString();

  const repoPath = getRepoPath(repoName);

  const git = simpleGit();

  console.log("Cloning repository...");

  await git.clone(repoUrl, repoPath, [
    "--depth",
    "1",
  ]);

  console.log("Clone completed.");

  return {
    repoName,
    repoPath,
  };
}