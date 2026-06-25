"use client";

import { useEffect, useState } from "react";
import { IconChat, IconCpu, IconOverview, IconTrash } from "@/components/icons";

type Tab = "chats" | "summaries" | "onboarding";

interface ChatThread {
  repositoryId: string;
  repoName: string;
  messageCount: number;
  lastMessageAt: string;
}

interface SummaryItem {
  _id: string;
  repoName: string;
  filePath: string;
  createdAt: string;
}

interface OnboardingItem {
  _id: string;
  repoName: string;
  createdAt: string;
}

const TABS: { id: Tab; label: string; icon: typeof IconChat }[] = [
  { id: "chats", label: "Chat History", icon: IconChat },
  { id: "summaries", label: "Summary History", icon: IconCpu },
  { id: "onboarding", label: "Onboarding History", icon: IconOverview },
];

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>("chats");

  const [chats, setChats] = useState<ChatThread[] | null>(null);
  const [summaries, setSummaries] = useState<SummaryItem[] | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingItem[] | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history/chats")
      .then((res) => res.json())
      .then((data) => setChats(data.threads || []));

    fetch("/api/history/summaries")
      .then((res) => res.json())
      .then((data) => setSummaries(data.summaries || []));

    fetch("/api/history/onboarding")
      .then((res) => res.json())
      .then((data) => setOnboarding(data.guides || []));
  }, []);

  const deleteChatThread = async (repositoryId: string) => {
    setDeletingId(repositoryId);
    try {
      const res = await fetch(`/api/history/chats/${repositoryId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setChats((prev) => (prev || []).filter((c) => c.repositoryId !== repositoryId));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const deleteSummaryItem = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/history/summaries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSummaries((prev) => (prev || []).filter((s) => s._id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const deleteOnboardingItem = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/history/onboarding/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setOnboarding((prev) => (prev || []).filter((o) => o._id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold">History</h1>
      <p className="mt-2 text-neutral-400">
        Everything generated across your repositories — review or clean it up.
      </p>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-neutral-800 pb-px">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "border-red-500 text-white"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "chats" && (
          <HistoryList
            items={chats}
            emptyMessage="No chat conversations yet."
            isDeleting={deletingId}
            renderRow={(thread: ChatThread) => (
              <Row
                key={thread.repositoryId}
                title={thread.repoName}
                subtitle={`${thread.messageCount} messages · ${new Date(thread.lastMessageAt).toLocaleString()}`}
                isDeleting={deletingId === thread.repositoryId}
                onDelete={() => deleteChatThread(thread.repositoryId)}
              />
            )}
          />
        )}

        {tab === "summaries" && (
          <HistoryList
            items={summaries}
            emptyMessage="No file summaries yet."
            isDeleting={deletingId}
            renderRow={(item: SummaryItem) => (
              <Row
                key={item._id}
                title={item.filePath}
                subtitle={`${item.repoName} · ${new Date(item.createdAt).toLocaleString()}`}
                isDeleting={deletingId === item._id}
                onDelete={() => deleteSummaryItem(item._id)}
              />
            )}
          />
        )}

        {tab === "onboarding" && (
          <HistoryList
            items={onboarding}
            emptyMessage="No onboarding guides generated yet."
            isDeleting={deletingId}
            renderRow={(item: OnboardingItem) => (
              <Row
                key={item._id}
                title={item.repoName}
                subtitle={new Date(item.createdAt).toLocaleString()}
                isDeleting={deletingId === item._id}
                onDelete={() => deleteOnboardingItem(item._id)}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}

function HistoryList<T>({
  items,
  emptyMessage,
  renderRow,
}: {
  items: T[] | null;
  emptyMessage: string;
  isDeleting: string | null;
  renderRow: (item: T) => React.ReactNode;
}) {
  if (items === null) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        <span className="text-neutral-400">Loading...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center text-neutral-400">
        {emptyMessage}
      </div>
    );
  }

  return <div className="space-y-3">{items.map(renderRow)}</div>;
}

function Row({
  title,
  subtitle,
  isDeleting,
  onDelete,
}: {
  title: string;
  subtitle: string;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="min-w-0">
        <p className="truncate font-medium text-white">{title}</p>
        <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-700 text-neutral-400 transition hover:border-red-500 hover:text-red-400 disabled:opacity-50"
        aria-label="Delete"
      >
        <IconTrash className="h-4 w-4" />
      </button>
    </div>
  );
}
