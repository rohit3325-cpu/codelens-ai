import fs from "fs";
import path from "path";

export function getRepositoryInsights(
  repoPath: string
) {
  let totalFiles = 0;

  let typescriptFiles = 0;
  let javascriptFiles = 0;
  let testFiles = 0;
  let configFiles = 0;

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(
        dir,
        entry.name
      );

      if (
        entry.isDirectory() &&
        entry.name !== "node_modules" &&
        entry.name !== ".git"
      ) {
        scan(fullPath);
      }

      if (entry.isFile()) {
        totalFiles++;

        const ext = path.extname(
          entry.name
        );

        if (
          ext === ".ts" ||
          ext === ".tsx"
        ) {
          typescriptFiles++;
        }

        if (
          ext === ".js" ||
          ext === ".jsx"
        ) {
          javascriptFiles++;
        }

        if (
          entry.name.includes(".test")
        ) {
          testFiles++;
        }

        if (
          entry.name.includes("config")
        ) {
          configFiles++;
        }
      }
    }
  }

  scan(repoPath);

  return {
    totalFiles,
    typescriptFiles,
    javascriptFiles,
    testFiles,
    configFiles,
  };
}