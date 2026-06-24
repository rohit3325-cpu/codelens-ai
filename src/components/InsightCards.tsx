interface Insights {
  totalFiles: number;
  typescriptFiles: number;
  javascriptFiles: number;
  testFiles: number;
  configFiles: number;
}

export default function InsightCards({
  insights,
}: {
  insights: Insights;
}) {
  const cards = [
    { label: "Total Files", value: insights.totalFiles, accent: "text-white" },
    { label: "TypeScript", value: insights.typescriptFiles, accent: "text-red-400" },
    { label: "JavaScript", value: insights.javascriptFiles, accent: "text-amber-400" },
    { label: "Tests", value: insights.testFiles, accent: "text-emerald-400" },
    { label: "Config", value: insights.configFiles, accent: "text-cyan-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition hover:border-red-500/50"
        >
          <p className="text-sm text-neutral-400">{card.label}</p>
          <p className={`mt-2 text-3xl font-bold ${card.accent}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
