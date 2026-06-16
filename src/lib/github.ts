import simpleGit from "simple-git";
import path from "path";

export async function cloneRepository(repoUrl: string) {
  const repoName = Date.now().toString();

  const repoPath = path.join(
    process.cwd(),
    "repos",
    repoName
  );

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