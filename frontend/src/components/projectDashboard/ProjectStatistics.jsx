import {
    Building2,
    Users,
    CheckSquare,
    ListTodo,
    Briefcase
} from "lucide-react";

import { theme } from "@/lib/theme";

const StatCard = ({

    icon: Icon,

    title,

    value,

    color

}) => {

    return (

        <div
            className="rounded-2xl p-6 transition hover:-translate-y-1"
            style={{
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.06)"
            }}
        >

            <div className="flex items-center justify-between">

                <div>

                    <p
                        className="text-sm"
                        style={{
                            color: theme.secondary
                        }}
                    >
                        {title}
                    </p>

                    <h2
                        className="mt-3 text-3xl font-bold"
                        style={{
                            color: theme.text
                        }}
                    >
                        {value}
                    </h2>

                </div>

                <div
                    className="rounded-xl p-4"
                    style={{
                        background: color
                    }}
                >

                    <Icon
                        size={24}
                        color="white"
                    />

                </div>

            </div>

        </div>

    );

};

const ProjectStatistics = ({
    statistics
}) => {

    return (

        <section className="space-y-6">

            <div
                className="grid gap-6
                md:grid-cols-2
                xl:grid-cols-5"
            >

                <StatCard
                    icon={Building2}
                    title="Departments"
                    value={statistics.departments}
                    color="#7C3AED"
                />

                <StatCard
                    icon={Users}
                    title="Teams"
                    value={statistics.teams}
                    color="#2563EB"
                />

                <StatCard
                    icon={CheckSquare}
                    title="Tasks"
                    value={statistics.tasks}
                    color="#22C55E"
                />

                <StatCard
                    icon={ListTodo}
                    title="Sub Tasks"
                    value={statistics.subTasks}
                    color="#F97316"
                />

                <StatCard
                    icon={Briefcase}
                    title="Work Items"
                    value={statistics.workItems}
                    color="#EC4899"
                />

            </div>

            <div
                className="rounded-2xl p-6"
                style={{
                    background: "rgba(255,255,255,.03)",
                    border: "1px solid rgba(255,255,255,.06)"
                }}
            >

                <div className="flex items-center justify-between">

                    <h2
                        className="text-xl font-semibold"
                        style={{
                            color: theme.text
                        }}
                    >
                        Overall Progress
                    </h2>

                    <span
                        className="text-lg font-bold"
                        style={{
                            color: theme.primaryLight
                        }}
                    >
                        {statistics.overallProgress}%
                    </span>

                </div>

                <div
                    className="mt-5 h-3 overflow-hidden rounded-full"
                    style={{
                        background:
                            "rgba(255,255,255,.08)"
                    }}
                >

                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${statistics.overallProgress}%`,
                            background:
                                "linear-gradient(90deg,#7C3AED,#A78BFA)"
                        }}
                    />

                </div>

                <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">

                    <div>

                        <p
                            className="text-sm"
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Completed Tasks
                        </p>

                        <h3
                            className="mt-2 text-2xl font-bold"
                            style={{
                                color: theme.text
                            }}
                        >
                            {statistics.completedTasks}
                        </h3>

                    </div>

                    <div>

                        <p
                            className="text-sm"
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Pending Tasks
                        </p>

                        <h3
                            className="mt-2 text-2xl font-bold"
                            style={{
                                color: theme.text
                            }}
                        >
                            {statistics.pendingTasks}
                        </h3>

                    </div>

                    <div>

                        <p
                            className="text-sm"
                            style={{
                                color: theme.secondary
                            }}
                        >
                            In Progress
                        </p>

                        <h3
                            className="mt-2 text-2xl font-bold"
                            style={{
                                color: theme.text
                            }}
                        >
                            {statistics.inProgressTasks}
                        </h3>

                    </div>

                    <div>

                        <p
                            className="text-sm"
                            style={{
                                color: theme.secondary
                            }}
                        >
                            Completed Work Items
                        </p>

                        <h3
                            className="mt-2 text-2xl font-bold"
                            style={{
                                color: theme.text
                            }}
                        >
                            {statistics.completedWorkItems}
                        </h3>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default ProjectStatistics;