import {
    Calendar,
    FolderKanban,
    User,
    Building2,
    Pencil,
    Trash2,
    Clock3
} from "lucide-react";

import { theme } from "@/lib/theme";

const getStatusColor = (status) => {

    switch (status) {

        case "planning":
            return "#FACC15";

        case "active":
            return "#3B82F6";

        case "completed":
            return "#22C55E";

        case "on_hold":
            return "#F97316";

        case "cancelled":
            return "#EF4444";

        default:
            return theme.primaryLight;

    }

};

const ProjectHeader = ({ project }) => {

    return (

        <section
            className="rounded-3xl p-8"
            style={{
                background: "rgba(13,13,18,.55)",
                border: "1px solid rgba(167,139,250,.10)",
                backdropFilter: "blur(24px)"
            }}
        >

            <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">

                <div className="space-y-5">

                    <div>

                        <h1
                            className="text-4xl font-bold"
                            style={{
                                color: theme.text
                            }}>
                            {project?.name}
                        </h1>

                        <p
                            className="mt-3 max-w-3xl"
                            style={{
                                color: theme.secondary
                            }}>
                            {project?.description ||
                                "No description available."}
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-3">

                        <div
                            className="rounded-full px-4 py-2 text-sm font-semibold"
                            style={{
                                background:
                                    getStatusColor(project?.status),
                                color: "#fff"
                            }}
                        >
                            {project?.status}
                        </div>

                    </div>

                </div>

                <div className="flex gap-3 self-start">

                    <button
                        className="rounded-xl px-5 py-3 transition hover:scale-[1.03]"
                        style={{
                            background: "rgba(255,255,255,.05)",
                            border: "1px solid rgba(255,255,255,.08)",
                            color: theme.text
                        }}
                    >
                        <Pencil size={18} />

                    </button>

                    <button
                        className="rounded-xl px-5 py-3 transition hover:scale-[1.03]"
                        style={{
                            background: "rgba(251,191,36,.10)",
                            border: "1px solid rgba(251,191,36,.20)",
                            color: "#FACC15"
                        }}
                    >
                        <Clock3 size={18} />

                    </button>

                    <button
                        className="rounded-xl px-5 py-3 transition hover:scale-[1.03]"
                        style={{
                            background: "rgba(239,68,68,.10)",
                            border: "1px solid rgba(239,68,68,.20)",
                            color: "#EF4444"
                        }}
                    >
                        <Trash2 size={18} />

                    </button>

                </div>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <div className="flex items-center gap-4">

                    <FolderKanban
                        size={20}
                        color={theme.primaryLight}
                    />

                    <div>

                        <p
                            className="text-sm"
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Workspace
                        </p>

                        <h3
                            style={{
                                color: theme.text
                            }}>
                            {project?.workspace?.name}
                        </h3>

                    </div>

                </div>

                <div className="flex items-center gap-4">

                    <User
                        size={20}
                        color={theme.primaryLight}
                    />

                    <div>

                        <p
                            className="text-sm"
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Created By
                        </p>

                        <h3
                            style={{
                                color: theme.text
                            }}>
                            {project?.createdBy?.name}
                        </h3>

                    </div>

                </div>

                <div className="flex items-center gap-4">

                    <Calendar
                        size={20}
                        color={theme.primaryLight}
                    />

                    <div>

                        <p
                            className="text-sm"
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Start Date
                        </p>

                        <h3
                            style={{
                                color: theme.text
                            }}>
                            {project?.startDate
                                ? new Date(
                                      project.startDate
                                  ).toLocaleDateString()
                                : "--"}
                        </h3>

                    </div>

                </div>

                <div className="flex items-center gap-4">

                    <Building2
                        size={20}
                        color={theme.primaryLight}
                    />

                    <div>

                        <p
                            className="text-sm"
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Due Date
                        </p>

                        <h3
                            style={{
                                color: theme.text
                            }}>
                            {project?.dueDate
                                ? new Date(
                                      project.dueDate
                                  ).toLocaleDateString()
                                : "--"}
                        </h3>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default ProjectHeader;