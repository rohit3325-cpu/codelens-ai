interface RepoInputProps {
  repoUrl: string;
  setRepoUrl: (
    value: string
  ) => void;

  analyzeRepo: () => void;
}

export default function RepoInput({
  repoUrl,
  setRepoUrl,
  analyzeRepo,
}: RepoInputProps) {
  return (
    <div className="max-w-4xl mx-auto">

      <div
        className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-3xl
        p-6
      "
      >
        <div
          className="
          flex
          flex-col
          sm:flex-row
          gap-4
        "
        >
          <input
            value={repoUrl}
            onChange={(e) =>
              setRepoUrl(
                e.target.value
              )
            }
            placeholder="Paste GitHub Repository URL..."
            className="
              flex-1
              bg-zinc-800
              border
              border-zinc-700
              rounded-xl
              p-4
              text-white
              outline-none
            "
          />

          <button
            onClick={analyzeRepo}
            className="
              bg-violet-600
              hover:bg-violet-700
              transition
              px-6
              py-4
              rounded-xl
              font-semibold
              whitespace-nowrap
            "
          >
            Analyze
          </button>
        </div>

      </div>

    </div>
  );
}