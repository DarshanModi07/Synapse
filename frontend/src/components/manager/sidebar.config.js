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
      {
        label: "Tasks",
        icon: CheckSquare,
        path: "tasks",
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
  {
    title: "System",
    items: [
      {
        label: "Settings",
        icon: Settings,
        path: "settings",
      },
    ],
  },
];
