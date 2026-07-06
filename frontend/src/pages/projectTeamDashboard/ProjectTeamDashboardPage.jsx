import { useParams } from "react-router-dom";

import { theme } from "@/lib/theme";

import { useProjectTeamDashboard } from "@/hooks/useProjectTeamDashboard";
import TaskSection from "@/components/projectTask/TaskSection";

const ProjectTeamDashboardPage = () => {

    const { projectTeamId } = useParams();

    const {

        dashboard,

        loading,

        error,

        refresh

    } = useProjectTeamDashboard(
        projectTeamId
    );

    /*
    =====================================================
    LOADING
    =====================================================
    */

    if (loading) {

        return (

            <div className="flex h-[80vh] items-center justify-center">

                <div

                    className="h-14 w-14 animate-spin rounded-full border-4 border-t-transparent"

                    style={{

                        borderColor:
                            "rgba(167,139,250,.25)",

                        borderTopColor:
                            theme.primary

                    }}

                />

            </div>

        );

    }

    /*
    =====================================================
    ERROR
    =====================================================
    */

    if (error || !dashboard) {

        return (

            <div

                className="flex h-[80vh] items-center justify-center text-xl"

                style={{

                    color: theme.text

                }}

            >

                Failed to load Project Team Dashboard.

            </div>

        );

    }

        /*
    =====================================================
    UI
    =====================================================
    */

    return (

        <main className="space-y-8">

            {/* Header */}

            <div

                className="rounded-3xl p-8"

                style={{

                    background: "rgba(13,13,18,.55)",

                    border:
                        "1px solid rgba(167,139,250,.10)",

                    backdropFilter: "blur(24px)"

                }}

            >

                <div className="flex items-center justify-between">

                    <div>

                        <h1

                            className="text-4xl font-bold"

                            style={{

                                color: theme.text

                            }}

                        >

                            {dashboard.team.name}

                        </h1>

                        <p

                            className="mt-2"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Project Team Dashboard

                        </p>

                    </div>

                    <button

                        onClick={refresh}

                        className="rounded-xl bg-violet-600 px-5 py-3 text-white transition hover:bg-violet-500"

                    >

                        Refresh

                    </button>

                </div>

            </div>

            {/* Statistics */}

            <div className="grid gap-6 md:grid-cols-4">

                <div

                    className="rounded-3xl p-6"

                    style={{

                        background: "rgba(13,13,18,.55)",

                        border:
                            "1px solid rgba(167,139,250,.10)"

                    }}

                >

                    <h3

                        className="text-sm"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Tasks

                    </h3>

                    <p

                        className="mt-3 text-4xl font-bold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {dashboard.tasks.total}

                    </p>

                </div>

                <div

                    className="rounded-3xl p-6"

                    style={{

                        background: "rgba(13,13,18,.55)",

                        border:
                            "1px solid rgba(167,139,250,.10)"

                    }}

                >

                    <h3

                        className="text-sm"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Completed

                    </h3>

                    <p

                        className="mt-3 text-4xl font-bold text-green-500"

                    >

                        {dashboard.tasks.completed}

                    </p>

                </div>

                <div

                    className="rounded-3xl p-6"

                    style={{

                        background: "rgba(13,13,18,.55)",

                        border:
                            "1px solid rgba(167,139,250,.10)"

                    }}

                >

                    <h3

                        className="text-sm"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Subtasks

                    </h3>

                    <p

                        className="mt-3 text-4xl font-bold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {dashboard.subtasks.total}

                    </p>

                </div>

                <div

                    className="rounded-3xl p-6"

                    style={{

                        background: "rgba(13,13,18,.55)",

                        border:
                            "1px solid rgba(167,139,250,.10)"

                    }}

                >

                    <h3

                        className="text-sm"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Work Items

                    </h3>

                    <p

                        className="mt-3 text-4xl font-bold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {dashboard.workItems.total}

                    </p>

                </div>

            </div>

            {/* Progress */}

            <div

                className="rounded-3xl p-8"

                style={{

                    background: "rgba(13,13,18,.55)",

                    border:
                        "1px solid rgba(167,139,250,.10)"

                }}

            >

                <div className="mb-4 flex justify-between">

                    <h2

                        className="text-xl font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        Overall Progress

                    </h2>

                    <span

                        className="font-semibold"

                        style={{

                            color: theme.primaryLight

                        }}

                    >

                        {dashboard.progress}%

                    </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-zinc-800">

                    <div

                        className="h-full rounded-full transition-all duration-500"

                        style={{

                            width: `${dashboard.progress}%`,

                            background:
                                "linear-gradient(90deg,#7C3AED,#A78BFA)"

                        }}

                    />

                </div>

            </div>

                        {/* Task Management */}

            <TaskSection

                projectTeamId={projectTeamId}

            />

            

        </main>

    );

};

export default ProjectTeamDashboardPage;