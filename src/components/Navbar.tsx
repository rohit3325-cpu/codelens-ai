import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
 <Image
  src="/logo6.png"
  alt="CodeLens AI"
  width={100}
  height={68}
  className="h-10 w-10"
/>

<span className="text-xl font-bold ">
  CodeLens  <span className=" text-red-500">AI</span> 
</span>
</div>

          <div className="hidden items-center gap-8 text-neutral-400 md:flex">
            <Link href="/#features" className="transition hover:text-white">
              Features
            </Link>

            <Link href="/docs" className="transition hover:text-white">
              Docs
            </Link>

            <Link href="/#pricing" className="transition hover:text-white">
              Pricing
            </Link>
          </div>

          {userId ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/repositories"
                className="hidden text-sm font-medium text-neutral-400 transition hover:text-white sm:inline"
              >
                Dashboard
              </Link>
              <UserButton />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-xl bg-red-600 px-4 py-2 font-medium transition hover:bg-red-700">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}