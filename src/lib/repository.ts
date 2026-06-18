import fs from "fs";
import path from "path";

const ALLOWED_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".md",
  ".json",
];

function getAllFiles(dir: string): string[] {
  let files: string[] = [];

  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (
      entry.isDirectory() &&
      entry.name !== "node_modules" &&
      entry.name !== ".git" &&
      entry.name !== ".next"
    ) {
      files = files.concat(getAllFiles(fullPath));
    }

    if (entry.isFile()) {
      const ext = path.extname(entry.name);

      if (ALLOWED_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

export function getRepositoryContext(
  repoPath: string
) {
  const files = getAllFiles(repoPath);

  const importantFiles = files
    .sort((a, b) => {
      const sizeA = fs.statSync(a).size;
      const sizeB = fs.statSync(b).size;

      return sizeB - sizeA;
    })
    .slice(0, 10);

  let context = "";

  for (const file of importantFiles) {
    const content = fs.readFileSync(
      file,
      "utf-8"
    );

    context += `
FILE: ${path.relative(repoPath, file)}

${content.slice(0, 2000)}

--------------------------------
`;
  }

  return context;
}