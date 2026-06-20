export default function Stats() {
  const stats = [
    {
      value: "200+",
      label: "Repositories",
    },
    {
      value: "AI",
      label: "Architecture",
    },
    {
      value: "24/7",
      label: "Repository Chat",
    },
    {
      value: "100%",
      label: "Developer Focused",
    },
  ];

  return (
    <section className="py-16">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((item) => (
          <div
            key={item.label}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-6
              hover:border-violet-500
              transition-all
            "
          >
            <h3 className="text-4xl font-bold">
              {item.value}
            </h3>

            <p className="text-zinc-400 mt-2">
              {item.label}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}