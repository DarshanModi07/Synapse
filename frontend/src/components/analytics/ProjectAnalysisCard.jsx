import {
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    TrendingUp
} from "lucide-react";

import { theme } from "@/lib/theme";

const statusColor = {

    ahead: "text-green-400",

    on_track: "text-blue-400",

    behind: "text-yellow-400",

    critical: "text-red-400"

};

const ProjectAnalysisCard = ({

    data

}) => {

    if (!data) return null;

    const analysis = data.analysis;

    return (

        <section

            className="rounded-3xl p-8"

            style={{

                background: "rgba(13,13,18,.55)",

                border: "1px solid rgba(167,139,250,.10)",

                backdropFilter: "blur(20px)"

            }}

        >

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2

                        className="text-2xl font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        Project Analysis

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        AI generated project assessment.

                    </p>

                </div>

                <TrendingUp

                    size={34}

                    color={theme.primaryLight}

                />

            </div>

            {/* Assessment */}

            <div

                className="mt-8 rounded-2xl p-6"

                style={{

                    background: "#16131F"

                }}

            >

                <p

                    style={{

                        color: theme.secondary

                    }}

                >

                    Overall Assessment

                </p>

                <p

                    className="mt-3 leading-7"

                    style={{

                        color: theme.text

                    }}

                >

                    {analysis.overallAssessment}

                </p>

            </div>

            {/* Stats */}

            <div className="mt-8 grid gap-5 md:grid-cols-2">

                <div

                    className="rounded-2xl p-5"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <p

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Completion Rate

                    </p>

                    <h3

                        className="mt-3 text-4xl font-bold"

                        style={{

                            color: theme.primaryLight

                        }}

                    >

                        {analysis.completionRate}%

                    </h3>

                </div>

                <div

                    className="rounded-2xl p-5"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <p

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Progress Status

                    </p>

                    <h3

                        className={`mt-3 text-3xl font-bold ${statusColor[analysis.progressVsTimeGap]}`}

                    >

                        {

                            analysis.progressVsTimeGap

                                ?.replaceAll("_", " ")

                        }

                    </h3>

                </div>

            </div>

            {/* Lists */}

            <div className="mt-8 grid gap-6 lg:grid-cols-3">

                {/* Strengths */}

                <div>

                    <div className="mb-4 flex items-center gap-2">

                        <CheckCircle2

                            size={20}

                            color="#22C55E"

                        />

                        <h3

                            style={{

                                color: theme.text

                            }}

                        >

                            Strengths

                        </h3>

                    </div>

                    <div className="space-y-3">

                        {

                            analysis.strengths.map(

                                (item, index) => (

                                    <div

                                        key={index}

                                        className="rounded-xl bg-green-500/10 p-3 text-sm text-green-300"

                                    >

                                        {item}

                                    </div>

                                )

                            )

                        }

                    </div>

                </div>

                {/* Weaknesses */}

                <div>

                    <div className="mb-4 flex items-center gap-2">

                        <AlertTriangle

                            size={20}

                            color="#F59E0B"

                        />

                        <h3

                            style={{

                                color: theme.text

                            }}

                        >

                            Weaknesses

                        </h3>

                    </div>

                    <div className="space-y-3">

                        {

                            analysis.weaknesses.map(

                                (item, index) => (

                                    <div

                                        key={index}

                                        className="rounded-xl bg-yellow-500/10 p-3 text-sm text-yellow-300"

                                    >

                                        {item}

                                    </div>

                                )

                            )

                        }

                    </div>

                </div>

                {/* Recommendations */}

                <div>

                    <div className="mb-4 flex items-center gap-2">

                        <Lightbulb

                            size={20}

                            color="#A78BFA"

                        />

                        <h3

                            style={{

                                color: theme.text

                            }}

                        >

                            Recommendations

                        </h3>

                    </div>

                    <div className="space-y-3">

                        {

                            analysis.recommendations.map(

                                (item, index) => (

                                    <div

                                        key={index}

                                        className="rounded-xl bg-violet-500/10 p-3 text-sm"

                                        style={{

                                            color: theme.primaryLight

                                        }}

                                    >

                                        {item}

                                    </div>

                                )

                            )

                        }

                    </div>

                </div>

            </div>

        </section>

    );

};

export default ProjectAnalysisCard;