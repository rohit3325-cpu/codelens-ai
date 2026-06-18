"use client";

import { useState } from "react";
import MermaidDiagram from "@/components/MermaidDiagram";

export default function RepoForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  const [selectedFile, setSelectedFile] = useState("");
const [fileContent, setFileContent] = useState("");


const [summary, setSummary] = useState("");

const [overview, setOverview] = useState("");

const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");

const [insights, setInsights] = useState<any>(null);

const [architecture, setArchitecture] =
  useState("");

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

const insightRes = await fetch(
  "/api/repository-insights",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repoPath: data.repoPath,
    }),
  }
);

const insightData =
  await insightRes.json();

setInsights(insightData);
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
 

 const generateOverview = async () => {
  const res = await fetch(
    "/api/repository-overview",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoPath: result.repoPath,
      }),
    }
  );

  const data = await res.json();

  setOverview(data.overview);
};

const fetchInsights = async () => {
  const res = await fetch(
    "/api/repository-insights",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoPath: result.repoPath,
      }),
    }
  );

  const data = await res.json();

  setInsights(data);
};

const askRepository = async () => {
  const res = await fetch(
    "/api/chat-repository",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoPath: result.repoPath,
        question,
      }),
    }
  );

  const data = await res.json();

  setAnswer(data.answer);
};

const generateArchitecture =
  async () => {
    const res = await fetch(
      "/api/architecture",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          repoPath: result.repoPath,
        }),
      }
    );

    const data = await res.json();

    setArchitecture(data.diagram);
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


{insights && (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">

    <div className="bg-zinc-900 p-4 rounded-lg">
      <p className="text-sm text-gray-400">
        Total Files
      </p>
      <p className="text-2xl font-bold">
        {insights.totalFiles}
      </p>
    </div>

    <div className="bg-zinc-900 p-4 rounded-lg">
      <p className="text-sm text-gray-400">
        TypeScript
      </p>
      <p className="text-2xl font-bold">
        {insights.typescriptFiles}
      </p>
    </div>

    <div className="bg-zinc-900 p-4 rounded-lg">
      <p className="text-sm text-gray-400">
        JavaScript
      </p>
      <p className="text-2xl font-bold">
        {insights.javascriptFiles}
      </p>
    </div>

    <div className="bg-zinc-900 p-4 rounded-lg">
      <p className="text-sm text-gray-400">
        Tests
      </p>
      <p className="text-2xl font-bold">
        {insights.testFiles}
      </p>
    </div>

    <div className="bg-zinc-900 p-4 rounded-lg">
      <p className="text-sm text-gray-400">
        Config
      </p>
      <p className="text-2xl font-bold">
        {insights.configFiles}
      </p>
    </div>

  </div>
)}

      {result && (
  <button
    onClick={generateOverview}
    className="mt-4 ml-4 px-5 py-3 rounded bg-blue-600 text-white"
  >
    Generate Repository Overview
  </button>
)}

<button
  onClick={generateArchitecture}
  className="mt-4 ml-4 px-5 py-3 rounded bg-purple-600 text-white"
>
  Generate Architecture
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

{overview && (
  <div className="mt-8 bg-zinc-900 p-4 rounded-lg">
    <h2 className="text-2xl font-bold mb-4">
      Repository Overview
    </h2>

    <div className="whitespace-pre-wrap text-gray-300">
      {overview}
    </div>
  </div>
)}

<div className="mt-8 bg-zinc-900 p-4 rounded-lg">
  <h2 className="text-2xl font-bold mb-4">
    Chat With Repository
  </h2>

  <input
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Ask about this repository..."
    className="w-full p-3 rounded bg-zinc-800 text-white border border-zinc-700"
  />

  <button
    onClick={askRepository}
    className="mt-4 px-5 py-3 rounded bg-green-600 text-white"
  >
    Ask
  </button>

  {answer && (
    <div className="mt-6 whitespace-pre-wrap text-gray-300">
      {answer}
    </div>
  )}
</div>

{architecture && (
  <div className="mt-8 bg-zinc-900 p-4 rounded-lg">
    <h2 className="text-2xl font-bold mb-4">
      Architecture Diagram
    </h2>

    <MermaidDiagram
  chart={architecture}
/>
  </div>
)}
    </div>
  );
}