export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between">

          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              CodeLens AI
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8 text-zinc-400">

            <button className="hover:text-white transition">
              Features
            </button>

            <button className="hover:text-white transition">
              Docs
            </button>

            <button className="hover:text-white transition">
              GitHub
            </button>

          </div>

          <button
            className="
            bg-violet-600
            hover:bg-violet-700
            px-4 py-2
            rounded-xl
            font-medium
            transition
          "
          >
            Sign In
          </button>

        </div>

      </div>
    </nav>
  );
}