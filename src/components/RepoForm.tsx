"use client";

import { useState } from "react";

export default function RepoForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  const [selectedFile, setSelectedFile] = useState("");
const [fileContent, setFileContent] = useState("");


const [summary, setSummary] = useState("");

const generateSummary = async (code: string) => {
  const res = await fetch("/api/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });

  const data = await res.json();

  setSummary(data.summary);
};


  const analyzeRepo = async () => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoUrl }),
    });

    const data = await response.json();
    setResult(data);
  };
  
  const fetchFileContent = async (filePath: string) => {
  const res = await fetch("/api/file-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repoPath: result.repoPath,
      filePath,
    }),
  });

  const data = await res.json();

  setSelectedFile(filePath);
setFileContent(data.content);

await generateSummary(data.content);
};


  return (
    <div className="max-w-2xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">
        AI Codebase Explainer
      </h1>

      <input
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="https://github.com/user/repo"
        className="w-full border p-3 rounded"
      />

      <button
        onClick={analyzeRepo}
        className="mt-4 px-5 py-3 rounded bg-black text-white"
      >
        Analyze Repository
      </button>

    {result?.files && (
  <div className="grid grid-cols-2 gap-6 mt-8">

    <div className="bg-zinc-900 rounded-lg p-4 max-h-[600px] overflow-auto">
      <h2 className="text-xl font-bold mb-4">
        Repository Files ({result.totalFiles})
      </h2>

      {result.files.map((file: string) => (
        <button
          key={file}
          onClick={() => fetchFileContent(file)}
          className="block w-full text-left py-1 text-green-400 hover:text-blue-400"
        >
          {file}
        </button>
      ))}
    </div>

    <div className="bg-zinc-900 rounded-lg p-4 max-h-[600px] overflow-auto">
  <h2 className="text-xl font-bold mb-4">
    {selectedFile || "Select a File"}
  </h2>

  <pre className="text-sm whitespace-pre-wrap">
    {fileContent}
  </pre>

  <div className="mt-6 border-t border-zinc-700 pt-4">
    <h2 className="text-xl font-bold mb-4">
      AI Summary
    </h2>

    <div className="whitespace-pre-wrap text-gray-300">
      {summary || "No summary yet"}
    </div>
  </div>
</div>

  </div>
)}
    </div>
  );
}