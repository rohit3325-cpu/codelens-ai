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


  const [activeTab, setActiveTab] =
useState("overview");

const [isLoading, setIsLoading] =
  useState(false);

  const [messages, setMessages] = useState<
  { role: "user" | "assistant"; content: string }[]
>([]);

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
  try {
    setIsLoading(true);

    const response = await fetch(
      "/api/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          repoUrl,
        }),
      }
    );

    const data =
      await response.json();

    setResult(data);

    const insightRes =
      await fetch(
        "/api/repository-insights",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            repoPath:
              data.repoPath,
          }),
        }
      );

    const insightData =
      await insightRes.json();

   await fetch(
  "/api/repository-overview",
  {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify({
      repoPath: data.repoPath,
    }),
  }
)
.then((r) => r.json())
.then((d) =>
  setOverview(d.overview)
);

await fetch(
  "/api/architecture",
  {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify({
      repoPath: data.repoPath,
    }),
  }
)
.then((r) => r.json())
.then((d) =>
  setArchitecture(d.diagram)
);

  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
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
  setMessages((prev) => [
  ...prev,
  { role: "user", content: question },
]);

setMessages((prev) => [
  ...prev,
  { role: "assistant", content: data.answer },
]);

setQuestion("");
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
      <div className="mb-8">
  <h2 className="text-4xl font-bold">
    Repository Dashboard
  </h2>

  <p className="text-zinc-400 mt-2">
    Explore files, understand architecture,
    generate summaries and chat with the codebase.
  </p>
</div>
      <input
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="https://github.com/user/repo"
        className="w-full border p-3 rounded"
      />

      <button
  onClick={analyzeRepo}
  disabled={isLoading}
  className="
    mt-4
    px-6
    py-3
    rounded-xl
    bg-violet-600
    hover:bg-violet-700
    disabled:opacity-50
    text-white
  "
>
  {isLoading
    ? "Analyzing..."
    : "Analyze Repository"}
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

    <div className="bg-zinc-800/50
border border-zinc-700
rounded-2xl
p-6
hover:border-violet-500
transition-all">
      <p className="text-sm text-gray-400">
        TypeScript
      </p>
      <p className="text-4xl font-bold">
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
   <div
    className="
      mt-12
      bg-zinc-900/40
      backdrop-blur-xl
      border border-zinc-800
      rounded-3xl
      p-6 md:p-8
      shadow-2xl
    "
  >
  <div className="flex gap-3 mt-8 mb-8 overflow-x-auto">

    <button
      onClick={() =>
        setActiveTab("overview")
      }
      className={
        activeTab === "overview"
          ? "bg-violet-600 px-4 py-2 rounded-xl"
          : "bg-zinc-800 px-4 py-2 rounded-xl"
      }
    >
      Overview
    </button>

    <button
      onClick={() =>
        setActiveTab("files")
      }
      className={
        activeTab === "files"
          ? "bg-violet-600 px-4 py-2 rounded-xl"
          : "bg-zinc-800 px-4 py-2 rounded-xl"
      }
    >
      Files
    </button>

    <button
      onClick={() =>
        setActiveTab("chat")
      }
      className={
        activeTab === "chat"
          ? "bg-violet-600 px-4 py-2 rounded-xl"
          : "bg-zinc-800 px-4 py-2 rounded-xl"
      }
    >
      Chat
    </button>

    <button
      onClick={() =>
        setActiveTab("architecture")
      }
      className={
        activeTab ===
        "architecture"
          ? "bg-violet-600 px-4 py-2 rounded-xl"
          : "bg-zinc-800 px-4 py-2 rounded-xl"
      }
    >
      Architecture
    </button>

  </div>
  

      {/* {result && (
  <button
    onClick={generateOverview}
    className="mt-4 ml-4 px-5 py-3 rounded bg-blue-600 text-white"
  >
    Generate Repository Overview
  </button>
)} */}



    {activeTab === "files" &&
    result?.files && (
  <div
  className="
    grid
    grid-cols-1
    lg:grid-cols-3
    gap-6
    mt-8
  "
>

    <div className="bg-zinc-800/50
border border-zinc-700
rounded-2xl
p-5
lg:col-span-1 max-h-[600px] overflow-auto">
      <div className="flex items-center gap-2 mb-4">

  <div className="w-2 h-2 rounded-full bg-violet-500" />

  <h2 className="font-semibold">
    Explorer
  </h2>

</div>

      {result.files.map((file: string) => (
        <button
          key={file}
          onClick={() => fetchFileContent(file)}
          className="
block
w-full
text-left
px-3
py-2
rounded-lg
hover:bg-zinc-700
transition-all
text-zinc-300
"
        >
          {file}
        </button>
      ))}
    </div>

    <div className="bg-zinc-800/50
border border-zinc-700
rounded-2xl
p-5
lg:col-span-2">
  <h2 className="text-xl font-bold mb-4">
    <div className="flex items-center justify-between">

  <h2 className="font-semibold">
    {selectedFile ||
      "Select a File"}
  </h2>

  <span className="
    text-xs
    bg-violet-600
    px-2
    py-1
    rounded-full
  ">
    Source
  </span>

</div>
  </h2>

  <pre
  className="
    mt-4
    text-sm
    whitespace-pre-wrap
    bg-black/30
    rounded-xl
    p-4
    overflow-auto
    max-h-[500px]
  "
>
    {fileContent}
  </pre>

  <div
  className="
    mt-6
    bg-zinc-900
    border
    border-zinc-700
    rounded-xl
    p-4
  "
>
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

{activeTab === "overview" &&
overview && (
  <div className="mt-8 bg-zinc-900 p-4 rounded-lg">
    <h2 className="text-2xl font-bold mb-4">
      Repository Overview
    </h2>

    <div className="whitespace-pre-wrap text-gray-300">
      <div className="grid md:grid-cols-4 gap-4 mb-8">

  <div className="bg-zinc-800 rounded-2xl p-5">
    <p className="text-zinc-400">
      Project Type
    </p>

    <p className="font-semibold">
      Repository
    </p>
  </div>

  <div className="bg-zinc-800 rounded-2xl p-5">
    <p className="text-zinc-400">
      Language
    </p>

    <p className="font-semibold">
      TypeScript
    </p>
  </div>

  <div className="bg-zinc-800 rounded-2xl p-5">
    <p className="text-zinc-400">
      Files
    </p>

    <p className="font-semibold">
      {insights?.totalFiles}
    </p>
  </div>

  <div className="bg-zinc-800 rounded-2xl p-5">
    <p className="text-zinc-400">
      Tests
    </p>

    <p className="font-semibold">
      {insights?.testFiles}
    </p>
  </div>

</div>
      {overview}
    </div>
  </div>
)}

{activeTab === "chat" && (
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

  <div className="space-y-4 mb-6">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`max-w-[80%] p-4 rounded-2xl ${
        msg.role === "user"
          ? "ml-auto bg-violet-600 text-white"
          : "bg-zinc-800 text-gray-200"
      }`}
    >
      {msg.content}
    </div>
  ))}
</div>
</div>
)}

{activeTab === "architecture" &&
architecture && (
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
)}
    </div>
  );
}