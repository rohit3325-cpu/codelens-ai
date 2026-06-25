import RepositorySidebar from "@/components/RepositorySidebar";
import RepositoryTopbar from "@/components/RepositoryTopbar";
import MobileRepositoryNav from "@/components/MobileRepositoryNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      <RepositorySidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <RepositoryTopbar />
        <MobileRepositoryNav />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
