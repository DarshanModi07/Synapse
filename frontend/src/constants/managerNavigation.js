import {
    LayoutDashboard,
    Building2,
    Users,
    FolderKanban,
    CheckSquare,
    ListTodo,
    ClipboardList,
    Sparkles,
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
        title: "Members",
        path: "members",
        icon: Users
    },

    {
        title: "Projects",
        path: "projects",
        icon: FolderKanban
    },

    {
        title: "Tasks",
        path: "tasks",
        icon: CheckSquare
    },

    {
        title: "Subtasks",
        path: "subtasks",
        icon: ListTodo
    },

    {
        title: "Work Items",
        path: "workitems",
        icon: ClipboardList
    },

    {
        title: "AI Assistant",
        path: "ai",
        icon: Sparkles
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