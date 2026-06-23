"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface Insights {
  totalFiles: number;
  typescriptFiles: number;
  javascriptFiles: number;
  testFiles: number;
  configFiles: number;
}

interface FileEntry {
  content: string;
  summary: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RepositoryData {
  insights: Insights | null;
  setInsights: (value: Insights) => void;

  overview: string | null;
  setOverview: (value: string) => void;

  files: string[] | null;
  setFiles: (value: string[]) => void;

  selectedFile: string;
  setSelectedFile: (value: string) => void;

  fileCache: Record<string, FileEntry>;
  setFileEntry: (path: string, entry: FileEntry) => void;

  architecture: string | null;
  setArchitecture: (value: string) => void;

  messages: ChatMessage[];
  setMessages: (value: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
}

const RepositoryDataContext = createContext<RepositoryData | null>(null);

export function RepositoryDataProvider({ children }: { children: ReactNode }) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [overview, setOverview] = useState<string | null>(null);
  const [files, setFiles] = useState<string[] | null>(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileCache, setFileCache] = useState<Record<string, FileEntry>>({});
  const [architecture, setArchitecture] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const setFileEntry = (path: string, entry: FileEntry) => {
    setFileCache((prev) => ({ ...prev, [path]: entry }));
  };

  return (
    <RepositoryDataContext.Provider
      value={{
        insights,
        setInsights,
        overview,
        setOverview,
        files,
        setFiles,
        selectedFile,
        setSelectedFile,
        fileCache,
        setFileEntry,
        architecture,
        setArchitecture,
        messages,
        setMessages,
      }}
    >
      {children}
    </RepositoryDataContext.Provider>
  );
}

export function useRepositoryData() {
  const ctx = useContext(RepositoryDataContext);

  if (!ctx) {
    throw new Error(
      "useRepositoryData must be used within a RepositoryDataProvider"
    );
  }

  return ctx;
}
