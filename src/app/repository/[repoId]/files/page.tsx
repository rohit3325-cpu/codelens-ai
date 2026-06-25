"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRepositoryData } from "@/components/RepositoryDataProvider";

export default function FilesPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const {
    files,
    setFiles,
    selectedFile,
    setSelectedFile,
    fileCache,
    setFileEntry,
  } = useRepositoryData();

  const filesLoading = files === null;
  const hasFetchedFiles = useRef(false);

  useEffect(() => {
    if (hasFetchedFiles.current || !filesLoading) return;
    hasFetchedFiles.current = true;

    const loadFiles = async () => {
      const res = await fetch("/api/repository-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoId }),
      });

      const data = await res.json();

      setFiles(data.files || []);
    };

    loadFiles();
  }, [repoId, filesLoading, setFiles]);

  const selectedEntry = selectedFile ? fileCache[selectedFile] : undefined;
  const summaryLoading = selectedFile !== "" && !selectedEntry;

  const fetchFileContent = async (filePath: string) => {
    setSelectedFile(filePath);

    if (fileCache[filePath]) return;

    try {
      const res = await fetch("/api/file-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoId, filePath }),
      });

      const data = await res.json();
      const content = data.content || "";

      const summaryRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: content, repoId, filePath }),
      });

      const summaryData = await summaryRes.json();

      setFileEntry(filePath, {
        content,
        summary: summaryData.summary || "",
      });
    } catch (error) {
      console.error(error);
      setFileEntry(filePath, {
        content: "",
        summary: "Failed to generate summary.",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Files</h1>
      <p className="mt-2 text-neutral-400">
        Browse source files and generate an AI summary for any file.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Explorer */}
        <div className="max-h-[700px] overflow-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 xl:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <h2 className="font-semibold">Explorer</h2>
          </div>

          {filesLoading ? (
            <p className="text-sm text-neutral-500">Loading files...</p>
          ) : (
            (files || []).map((file) => (
              <button
                key={file}
                onClick={() => fetchFileContent(file)}
                className={`block w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                  selectedFile === file
                    ? "bg-red-600 text-white"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {file}
              </button>
            ))
          )}
        </div>

        {/* Right side */}
        <div className="xl:col-span-9">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {selectedFile || "Select a file"}
              </h2>

              <span className="rounded-full bg-red-600 px-2 py-1 text-xs">
                Source
              </span>
            </div>

            <pre className="max-h-[600px] overflow-auto rounded-xl bg-black/30 p-4 text-sm whitespace-pre-wrap">
              {selectedEntry?.content || ""}
            </pre>
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              <h3 className="text-lg font-semibold">AI Summary</h3>
            </div>

            {summaryLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                <span className="text-neutral-400">Generating summary...</span>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedEntry?.summary ||
                    "Select a file to generate a summary"}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
