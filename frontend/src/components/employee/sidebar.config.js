import { LayoutDashboard, CheckSquare, BarChart2 } from "lucide-react";

export const employeeConfig = [
  {
    title: "WORKSPACE",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "",
      },
      {
        label: "Tasks",
        icon: CheckSquare,
        path: "tasks",
      },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      {
        label: "Analytics",
        icon: BarChart2,
        path: "analytics",
      },
    ],
  },
];
