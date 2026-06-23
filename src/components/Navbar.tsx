import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { IconGithub } from "@/components/icons";
import Image from "next/image";

export default async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
 <Image
  src="/logo2.png"
  alt="CodeLens AI"
  width={120}
  height={48}
  className="h-10 w-10"
/>
<span className="text-xl font-bold ">
  CodeLens AI
</span>
</div>

          <div className="hidden items-center gap-8 text-slate-400 md:flex">
            <button className="transition hover:text-white">
              Features
            </button>

            <button className="transition hover:text-white">Docs</button>

            <button className="flex items-center gap-2 transition hover:text-white">
              <IconGithub className="h-4 w-4" />
              GitHub
            </button>
          </div>

          {userId ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-xl bg-indigo-600 px-4 py-2 font-medium transition hover:bg-indigo-700">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}