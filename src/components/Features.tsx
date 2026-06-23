export default function Features() {
  const features = [
    {
      title: "AI File Summary",
      description:
        "Understand source files instantly.",
    },
    {
      title: "Repository Chat",
      description:
        "Ask questions about any codebase.",
    },
    {
      title: "Architecture Diagram",
      description:
        "Visualize project structure.",
    },
  ];

  return (
    <section className="py-16">
      <h2 className="mb-12 text-center text-4xl font-bold">
        Everything You Need
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition-all hover:border-indigo-500"
          >
            <h3 className="text-xl font-semibold">{feature.title}</h3>

            <p className="mt-4 text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}