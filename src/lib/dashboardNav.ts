import { IconBook, IconClock, IconSettings, IconWorkspace } from "@/components/icons";

export function getDashboardNavLinks() {
  return [
    {
      name: "Repositories",
      href: "/dashboard/repositories",
      icon: IconWorkspace,
    },
    {
      name: "Onboarding",
      href: "/dashboard/onboarding",
      icon: IconBook,
    },
    {
      name: "History",
      href: "/dashboard/history",
      icon: IconClock,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: IconSettings,
    },
  ];
}
