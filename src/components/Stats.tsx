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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-indigo-500"
          >
            <h3 className="text-4xl font-bold">{item.value}</h3>

            <p className="mt-2 text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}