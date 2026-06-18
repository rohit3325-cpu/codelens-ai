import fs from "fs";
import path from "path";

const ignoredFolders = [
  "node_modules",
  ".git",
  ".next",
  ".github",
  ".husky",
  "dist",
  "build",
];

export function scanDirectory(
  dirPath: string,
  basePath = dirPath
): string[] {
  let files: string[] = [];

  const entries = fs.readdirSync(dirPath, {
    withFileTypes: true,
  });

  console.log(
  "Scanning:",
  dirPath,
  "Entries:",
  entries.length
);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (
      entry.isDirectory() &&
      ignoredFolders.includes(entry.name)
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      files = files.concat(
        scanDirectory(fullPath, basePath)
      );
    } else {
      files.push(path.relative(basePath, fullPath));
    }
  }

  return files;
}




// https://github.com/vercel/ms