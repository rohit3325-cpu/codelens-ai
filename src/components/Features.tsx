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

      <h2 className="text-4xl font-bold text-center mb-12">
        Everything You Need
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {features.map((feature) => (
          <div
            key={feature.title}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-8
              hover:border-violet-500
              transition-all
            "
          >
            <h3 className="text-xl font-semibold">
              {feature.title}
            </h3>

            <p className="text-zinc-400 mt-4">
              {feature.description}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}