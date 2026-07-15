import {
  LayoutDashboard,
  Users,
  FolderKanban,
  UserRound,
  CheckSquare,
  ChartColumn,
  Settings,
} from "lucide-react";

export const managerConfig = [
  {
    title: "Workspace",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "",
      },
      {
        label: "Teams",
        icon: Users,
        path: "teams",
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
