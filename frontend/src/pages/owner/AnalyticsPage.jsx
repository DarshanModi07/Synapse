import {
    useEffect,
    useMemo,
    useState
} from "react";

import { useParams } from "react-router-dom";

import {
    Activity,
    BarChart3,
    Brain,
    CalendarClock,
    ChartColumn,
    Gauge,
    ShieldAlert,
    Users,
    Workflow
} from "lucide-react";

import { theme } from "@/lib/theme";

import { useProjects } from "@/hooks/useProjects";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useAnalytics } from "@/hooks/useAnalytics";

import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import ProjectSelector from "@/components/analytics/ProjectSelector";

import ProjectAnalysisCard from "@/components/analytics/ProjectAnalysisCard";
import ProjectHealthCard from "@/components/analytics/ProjectHealthCard";
import RiskAnalysisCard from "@/components/analytics/RiskAnalysisCard";
import DeadlinePredictionCard from "@/components/analytics/DeadlinePredictionCard";
import WorkloadAnalysisCard from "@/components/analytics/WorkloadAnalysisCard";
import ResourcePredictionCard from "@/components/analytics/ResourcePredictionCard";
import ProductivityAnalysisCard from "@/components/analytics/ProductivityAnalysisCard";
import BottleneckAnalysisCard from "@/components/analytics/BottleneckAnalysisCard";
import ExecutiveSummaryCard from "@/components/analytics/ExecutiveSummaryCard";

const ANALYTICS = [

    {
        type: "summary",
        title: "Executive Summary",
        description: "Quick AI overview for project owners.",
        icon: Brain
    },

    {
        type: "health",
        title: "Project Health",
        description: "Overall health score.",
        icon: Activity
    },

    {
        type: "analysis",
        title: "Project Analysis",
        description: "Overall project assessment.",
        icon: ChartColumn
    },

    {
        type: "risk",
        title: "Risk Analysis",
        description: "Detect project risks.",
        icon: ShieldAlert
    },

    {
        type: "deadline",
        title: "Deadline Prediction",
        description: "Predict delivery timeline.",
        icon: CalendarClock
    },

    {
        type: "workload",
        title: "Workload Analysis",
        description: "Team workload distribution.",
        icon: Users
    },

    {
        type: "resource",
        title: "Resource Prediction",
        description: "Resource planning.",
        icon: Workflow
    },

    {
        type: "productivity",
        title: "Productivity Analysis",
        description: "Find top performers.",
        icon: Gauge
    },

    {
        type: "bottleneck",
        title: "Bottleneck Analysis",
        description: "Detect project blockers.",
        icon: BarChart3
    }

];

const AnalyticsPage = () => {

    const { slug } = useParams();

    /*
    =====================================================
    WORKSPACE
    =====================================================
    */

    const {

        workspaces,

        loading: workspaceLoading

    } = useWorkspaces();

    const workspace = useMemo(() => {

        const current = workspaces.find(

            item => item.workspace.slug === slug

        );

        return current?.workspace;

    }, [

        workspaces,

        slug

    ]);

    /*
    =====================================================
    PROJECTS
    =====================================================
    */

    const {

        projects,

        loading: projectLoading

    } = useProjects(

        workspace?.id

    );

    /*
    =====================================================
    SELECTED PROJECT
    =====================================================
    */

    const [

        selectedProject,

        setSelectedProject

    ] = useState("");

    useEffect(() => {

        if (

            projects.length > 0 &&

            !selectedProject

        ) {

            setSelectedProject(

                projects[0].id

            );

        }

    }, [

        projects,

        selectedProject

    ]);

    /*
    =====================================================
    ANALYTICS
    =====================================================
    */

    const {

        loading,

        error,

        selected,

        analysis,

        runAnalysis

    } = useAnalytics(

        selectedProject

    );

    /*
    =====================================================
    LOADING
    =====================================================
    */

    if (

        workspaceLoading ||

        projectLoading

    ) {

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
    UI
    =====================================================
    */

    return (

        <main className="space-y-8">

            <AnalyticsHeader />

            <ProjectSelector

                projects={projects}

                selectedProject={selectedProject}

                setSelectedProject={setSelectedProject}

            />

            {/* AI MENU */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {

                    ANALYTICS.map(item => {

                        const Icon = item.icon;

                        return (

                            <button

                                key={item.type}

                                onClick={() =>

                                    runAnalysis(

                                        item.type

                                    )

                                }

                                className="rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1"

                                style={{

                                    background:

                                        selected === item.type

                                            ? "rgba(124,58,237,.18)"

                                            : "rgba(13,13,18,.55)",

                                    border:

                                        selected === item.type

                                            ? `1px solid ${theme.primary}`

                                            : "1px solid rgba(167,139,250,.08)"

                                }}

                            >

                                <Icon

                                    size={30}

                                    color={theme.primaryLight}

                                />

                                <h2

                                    className="mt-6 text-xl font-semibold"

                                    style={{

                                        color:

                                            theme.text

                                    }}

                                >

                                    {item.title}

                                </h2>

                                <p

                                    className="mt-3"

                                    style={{

                                        color:

                                            theme.secondary

                                    }}

                                >

                                    {item.description}

                                </p>

                            </button>

                        );

                    })

                }

            </div>

                        {/* ===========================================
                LOADING
            =========================================== */}

            {

                loading && (

                    <div

                        className="rounded-3xl p-10 text-center"

                        style={{

                            background: "rgba(13,13,18,.55)",

                            border: "1px solid rgba(167,139,250,.08)"

                        }}

                    >

                        <div

                            className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-t-transparent"

                            style={{

                                borderColor:

                                    "rgba(167,139,250,.25)",

                                borderTopColor:

                                    theme.primary

                            }}

                        />

                        <h2

                            className="mt-6 text-2xl font-semibold"

                            style={{

                                color: theme.text

                            }}

                        >

                            Synapse AI is thinking...

                        </h2>

                        <p

                            className="mt-3"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Analyzing project data and generating insights.

                        </p>

                    </div>

                )

            }

            {/* ===========================================
                ERROR
            =========================================== */}

            {

                error && (

                    <div

                        className="rounded-3xl p-8"

                        style={{

                            background:

                                "rgba(239,68,68,.08)",

                            border:

                                "1px solid rgba(239,68,68,.25)",

                            color:

                                "#F87171"

                        }}

                    >

                        {error}

                    </div>

                )

            }

            {/* ===========================================
                EMPTY STATE
            =========================================== */}

            {

                !loading &&

                !analysis &&

                !error && (

                    <div

                        className="rounded-3xl p-16 text-center"

                        style={{

                            background:

                                "rgba(13,13,18,.55)",

                            border:

                                "1px solid rgba(167,139,250,.08)"

                        }}

                    >

                        <Brain

                            size={60}

                            color={theme.primaryLight}

                            className="mx-auto"

                        />

                        <h2

                            className="mt-6 text-3xl font-bold"

                            style={{

                                color:

                                    theme.text

                            }}

                        >

                            AI Analytics

                        </h2>

                        <p

                            className="mx-auto mt-4 max-w-2xl"

                            style={{

                                color:

                                    theme.secondary

                            }}

                        >

                            Choose any analysis above to generate an
                            AI-powered report for the selected project.

                        </p>

                    </div>

                )

            }

            {/* ===========================================
                RESULT
            =========================================== */}

            {

                !loading &&

                analysis &&

                <>

                    {

                        selected === "summary" && (

                            <ExecutiveSummaryCard

                                data={analysis}

                            />

                        )

                    }

                    {

                        selected === "analysis" && (

                            <ProjectAnalysisCard

                                data={analysis}

                            />

                        )

                    }

                    {

                        selected === "health" && (

                            <ProjectHealthCard

                                data={analysis}

                            />

                        )

                    }

                    {

                        selected === "risk" && (

                            <RiskAnalysisCard

                                data={analysis}

                            />

                        )

                    }

                    {

                        selected === "deadline" && (

                            <DeadlinePredictionCard

                                data={analysis}

                            />

                        )

                    }

                    {

                        selected === "workload" && (

                            <WorkloadAnalysisCard

                                data={analysis}

                            />

                        )

                    }

                    {

                        selected === "resource" && (

                            <ResourcePredictionCard

                                data={analysis}

                            />

                        )

                    }

                    {

                        selected === "productivity" && (

                            <ProductivityAnalysisCard

                                data={analysis}

                            />

                        )

                    }

                    {

                        selected === "bottleneck" && (

                            <BottleneckAnalysisCard

                                data={analysis}

                            />

                        )

                    }

                </>

            }

        </main>

    );

};

export default AnalyticsPage;