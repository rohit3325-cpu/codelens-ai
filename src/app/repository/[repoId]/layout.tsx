import RepositorySidebar from "@/components/RepositorySidebar";
import RepositoryTopbar from "@/components/RepositoryTopbar";
import MobileRepositoryNav from "@/components/MobileRepositoryNav";
import { RepositoryDataProvider } from "@/components/RepositoryDataProvider";

export default async function RepositoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ repoId: string }>;
}) {
  const { repoId } = await params;

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      <RepositorySidebar repoId={repoId} />

      <div className="flex min-h-screen flex-1 flex-col">
        <RepositoryTopbar repoId={repoId} />
        <MobileRepositoryNav repoId={repoId} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <RepositoryDataProvider>{children}</RepositoryDataProvider>
        </main>
      </div>
    </div>
  );
}
