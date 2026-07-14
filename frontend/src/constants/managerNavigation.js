import {
    LayoutDashboard,
    Building2,
    Users,
    FolderKanban,
    BarChart3,
    Settings
} from "lucide-react";

const managerNavigation = [
    {
        title: "Dashboard",
        path: "",
        icon: LayoutDashboard
    },
    {
        title: "Department",
        path: "department",
        icon: Building2
    },
    {
        title: "Teams",
        path: "teams",
        icon: Users
    },
    {
        title: "Projects",
        path: "projects",
        icon: FolderKanban
    },
    {
        title: "Members",
        path: "members",
        icon: Users
    },
    {
        title: "Analytics",
        path: "analytics",
        icon: BarChart3
    },
    {
        title: "Settings",
        path: "settings",
        icon: Settings
    }
];

export default managerNavigation;