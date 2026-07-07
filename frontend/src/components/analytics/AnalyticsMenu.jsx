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

const analytics = [

    {

        type: "summary",

        title: "Executive Summary",

        description:
            "60-second AI briefing for project owners.",

        icon: Brain

    },

    {

        type: "health",

        title: "Project Health",

        description:
            "Overall project health score.",

        icon: Activity

    },

    {

        type: "analysis",

        title: "Project Analysis",

        description:
            "Overall project assessment.",

        icon: ChartColumn

    },

    {

        type: "risk",

        title: "Risk Analysis",

        description:
            "Identify project risks.",

        icon: ShieldAlert

    },

    {

        type: "deadline",

        title: "Deadline Prediction",

        description:
            "Predict delivery timeline.",

        icon: CalendarClock

    },

    {

        type: "workload",

        title: "Workload Analysis",

        description:
            "Team workload distribution.",

        icon: Users

    },

    {

        type: "resource",

        title: "Resource Prediction",

        description:
            "AI resource planning.",

        icon: Workflow

    },

    {

        type: "productivity",

        title: "Productivity Analysis",

        description:
            "Find top performers.",

        icon: Gauge

    },

    {

        type: "bottleneck",

        title: "Bottleneck Analysis",

        description:
            "Detect project blockers.",

        icon: BarChart3

    }

];

const AnalyticsMenu = ({

    selected,

    loading,

    runAnalysis

}) => {

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {

                analytics.map(item => {

                    const Icon =
                        item.icon;

                    const active =
                        selected === item.type;

                    return (

                        <button

                            key={item.type}

                            disabled={loading}

                            onClick={() =>

                                runAnalysis(

                                    item.type

                                )

                            }

                            className="rounded-3xl p-7 text-left transition-all duration-300 hover:-translate-y-1"

                            style={{

                                background:

                                    active

                                        ? "rgba(124,58,237,.18)"

                                        : "rgba(13,13,18,.55)",

                                border:

                                    active

                                        ? `1px solid ${theme.primary}`

                                        : "1px solid rgba(167,139,250,.08)",

                                backdropFilter:

                                    "blur(20px)"

                            }}

                        >

                            <div className="flex items-center justify-between">

                                <div

                                    className="flex h-14 w-14 items-center justify-center rounded-2xl"

                                    style={{

                                        background:

                                            "rgba(124,58,237,.12)"

                                    }}

                                >

                                    <Icon

                                        size={28}

                                        color={theme.primaryLight}

                                    />

                                </div>

                                {

                                    active &&

                                    <span

                                        className="rounded-full bg-violet-500 px-3 py-1 text-xs font-medium text-white"

                                    >

                                        Selected

                                    </span>

                                }

                            </div>

                            <h3

                                className="mt-6 text-xl font-semibold"

                                style={{

                                    color:
                                        theme.text

                                }}

                            >

                                {item.title}

                            </h3>

                            <p

                                className="mt-3 leading-7"

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

    );

};

export default AnalyticsMenu;