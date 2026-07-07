import {
  LayoutDashboard,
  Building2,
  Users,
  FolderKanban,
  UserRound,
  ChartColumn,
  BrainCircuit,
  Settings,
} from "lucide-react";

export const sidebarConfig = {
  owner: [
    {
      title: "Workspace",

      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "",
        },

        {
          label: "Departments",
          icon: Building2,
          path: "departments",
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
        }
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
  ],
};