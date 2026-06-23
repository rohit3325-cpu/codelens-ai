import {
  IconArchitecture,
  IconChat,
  IconFiles,
  IconOverview,
} from "@/components/icons";

export function getRepositoryNavLinks(repoId: string) {
  return [
    {
      name: "Overview",
      href: `/repository/${repoId}/overview`,
      icon: IconOverview,
    },
    {
      name: "Files",
      href: `/repository/${repoId}/files`,
      icon: IconFiles,
    },
    {
      name: "Architecture",
      href: `/repository/${repoId}/architecture`,
      icon: IconArchitecture,
    },
    {
      name: "Chat",
      href: `/repository/${repoId}/chat`,
      icon: IconChat,
    },
  ];
}
