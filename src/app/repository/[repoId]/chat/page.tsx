"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRepositoryData } from "@/components/RepositoryDataProvider";

export default function ChatPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const { messages, setMessages } = useRepositoryData();

  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const askRepository = async () => {
    if (!question.trim()) return;

    const currentQuestion = question;
    setQuestion("");
    setIsAsking(true);

    try {
      const res = await fetch("/api/chat-repository", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoId, question: currentQuestion }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "user", content: currentQuestion },
        { role: "assistant", content: data.answer || "" },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex h-full max-w-4xl flex-col">
      <h1 className="text-3xl font-bold">Chat</h1>
      <p className="mt-2 text-neutral-400">
        Ask questions about this repository and get answers grounded in its
        code.
      </p>

      <div className="mt-8 flex-1 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-500">
            No messages yet — ask something about this repository to get
            started.
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-2xl p-4 text-sm ${
              msg.role === "user"
                ? "ml-auto bg-red-600 text-white"
                : "bg-neutral-800 text-neutral-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askRepository()}
          placeholder="Ask about this repository..."
          className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-white outline-none focus:border-red-500"
        />

        <button
          onClick={askRepository}
          disabled={isAsking}
          className="rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700 disabled:opacity-50"
        >
          {isAsking ? "Asking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
