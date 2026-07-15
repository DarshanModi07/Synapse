import { LayoutDashboard, FolderKanban, UserRound, ChartColumn } from "lucide-react";

export const teamLeadConfig = [
  {
    title: "Workspace",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "",
      },
      {
        label: "Projects",
        icon: FolderKanban,
        path: "projects",
      },
      {
        label: "Members",
        icon: UserRound,
        path: "members",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        label: "Analytics",
        icon: ChartColumn,
        path: "analytics",
      },
    ],
  },
];
