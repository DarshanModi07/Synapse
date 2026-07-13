import {
    CalendarDays,
    FolderKanban,
    Building2,
    Users,
    ArrowRight,
    Pencil,
    Trash2
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";

import { theme } from "@/lib/theme";

const statusColor = {

    planning: "#F59E0B",

    active: "#22C55E",

    completed: "#3B82F6",

    on_hold: "#EF4444"

};

const ProjectCard = ({

    project,

    onEdit,

    onDelete

}) => {

    const navigate = useNavigate();
    const { slug } = useParams();
    const { workspace } = useWorkspace();
    
    const rolePrefix = workspace?.memberRole?.sysRole === "manager" ? "/manager" : "";

    return (

        <div

            className="rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"

            style={{

                background: "rgba(13,13,18,.55)",

                border:
                    "1px solid rgba(167,139,250,.10)",

                backdropFilter: "blur(24px)"

            }}

        >

            <div className="flex items-start justify-between">

                <div>

                    <h2

                        className="text-xl font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {project.name}

                    </h2>

                    <div

                        className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium"

                        style={{

                            background:
                                statusColor[
                                    project.status
                                ] + "20",

                            color:
                                statusColor[
                                    project.status
                                ]

                        }}

                    >

                        {project.status}

                    </div>

                </div>

                <button
                    onClick={() =>
                        navigate(
                            `/workspace/${slug}${rolePrefix}/projects/${project.id}`
                        )
                    }

                    className="rounded-xl p-2 transition hover:bg-white/5"

                >

                    <ArrowRight

                        size={20}

                        color={theme.primaryLight}

                    />

                </button>

            </div>

            <p

                className="mt-5 line-clamp-3 text-sm"

                style={{

                    color: theme.secondary

                }}

            >

                {

                    project.description ||

                    "No description"

                }

            </p>

            <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <Building2
                            size={18}
                            color={theme.primaryLight}
                        />

                        <span
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Departments
                        </span>

                    </div>

                    <span
                        style={{
                            color: theme.text
                        }}
                    >
                        {project.departments}
                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <Users
                            size={18}
                            color={theme.primaryLight}
                        />

                        <span
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Teams
                        </span>

                    </div>

                    <span
                        style={{
                            color: theme.text
                        }}
                    >
                        {project.teams}
                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <FolderKanban
                            size={18}
                            color={theme.primaryLight}
                        />

                        <span
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Tasks
                        </span>

                    </div>

                    <span
                        style={{
                            color: theme.text
                        }}
                    >
                        {project.tasks}
                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <CalendarDays
                            size={18}
                            color={theme.primaryLight}
                        />

                        <span
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Due Date
                        </span>

                    </div>

                    <span
                        style={{
                            color: theme.text
                        }}
                    >
                        {

                            project.dueDate

                                ?

                                new Date(
                                    project.dueDate
                                ).toLocaleDateString()

                                :

                                "-"

                        }

                    </span>

                </div>

            </div>

            <div className="mt-8 flex gap-3">

                <button

                    onClick={() =>
                        onEdit(project)
                    }

                    className="flex-1 rounded-xl py-3 transition"

                    style={{

                        background:
                            "rgba(124,58,237,.15)",

                        color:
                            theme.primaryLight

                    }}

                >

                    <div className="flex items-center justify-center gap-2">

                        <Pencil size={17} />

                        Edit

                    </div>

                </button>

                <button

                    onClick={() =>
                        onDelete(project)
                    }

                    className="flex-1 rounded-xl py-3 transition"

                    style={{

                        background:
                            "rgba(239,68,68,.12)",

                        color:
                            "#EF4444"

                    }}

                >

                    <div className="flex items-center justify-center gap-2">

                        <Trash2 size={17} />

                        Delete

                    </div>

                </button>

            </div>

        </div>

    );

};

export default ProjectCard;