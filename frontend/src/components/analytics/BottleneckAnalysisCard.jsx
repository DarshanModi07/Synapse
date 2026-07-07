import {
    AlertTriangle,
    ShieldAlert,
    Lightbulb
} from "lucide-react";

import { theme } from "@/lib/theme";

const severityColor = {

    low:
        "bg-green-500/15 text-green-300",

    medium:
        "bg-yellow-500/15 text-yellow-300",

    high:
        "bg-orange-500/15 text-orange-300",

    critical:
        "bg-red-500/15 text-red-300"

};

const BottleneckAnalysisCard = ({

    data

}) => {

    if (!data) return null;

    const bottleneck =
        data.bottlenecks;

    return (

        <section

            className="rounded-3xl p-8"

            style={{

                background:
                    "rgba(13,13,18,.55)",

                border:
                    "1px solid rgba(167,139,250,.10)",

                backdropFilter:
                    "blur(20px)"

            }}

        >

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2

                        className="text-2xl font-semibold"

                        style={{

                            color:
                                theme.text

                        }}

                    >

                        Bottleneck Analysis

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color:
                                theme.secondary

                        }}

                    >

                        AI detected project blockers.

                    </p>

                </div>

                <AlertTriangle

                    size={34}

                    color="#F97316"

                />

            </div>

            {/* Overall */}

            <div

                className="mt-8 rounded-2xl p-6"

                style={{

                    background:
                        "#16131F"

                }}

            >

                <div className="flex items-center justify-between">

                    <span

                        style={{

                            color:
                                theme.secondary

                        }}

                    >

                        Overall Severity

                    </span>

                    <span

                        className={`rounded-full px-4 py-2 text-sm font-semibold ${severityColor[bottleneck.overallSeverity]}`}

                    >

                        {bottleneck.overallSeverity.replace("_", " ")}

                    </span>

                </div>

            </div>

            {/* Bottlenecks */}

            <div className="mt-8 space-y-5">

                {

                    bottleneck.bottlenecks.length === 0

                        ?

                        (

                            <div

                                className="rounded-2xl p-6"

                                style={{

                                    background:
                                        "#16131F"

                                }}

                            >

                                <p

                                    style={{

                                        color:
                                            theme.secondary

                                    }}

                                >

                                    No bottlenecks detected.

                                </p>

                            </div>

                        )

                        :

                        bottleneck.bottlenecks.map(

                            (item, index) => (

                                <div

                                    key={index}

                                    className="rounded-2xl p-6"

                                    style={{

                                        background:
                                            "#16131F"

                                    }}

                                >

                                    <div className="flex items-center justify-between">

                                        <h3

                                            className="text-lg font-semibold"

                                            style={{

                                                color:
                                                    theme.text

                                            }}

                                        >

                                            {item.title}

                                        </h3>

                                        <span

                                            className={`rounded-full px-3 py-1 text-xs font-medium ${severityColor[item.severity]}`}

                                        >

                                            {item.severity}

                                        </span>

                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">

                                        <span

                                            className="rounded-full bg-violet-500/15 px-3 py-1 text-xs text-violet-300"

                                        >

                                            {item.type}

                                        </span>

                                    </div>

                                    <div className="mt-5">

                                        <h4

                                            className="font-medium"

                                            style={{

                                                color:
                                                    theme.text

                                            }}

                                        >

                                            Details

                                        </h4>

                                        <p

                                            className="mt-2"

                                            style={{

                                                color:
                                                    theme.secondary

                                            }}

                                        >

                                            {item.detail}

                                        </p>

                                    </div>

                                    <div

                                        className="mt-5 rounded-xl bg-violet-500/10 p-4"

                                    >

                                        <div className="flex items-center gap-2">

                                            <ShieldAlert

                                                size={18}

                                                color={theme.primaryLight}

                                            />

                                            <h4

                                                style={{

                                                    color:
                                                        theme.text

                                                }}

                                            >

                                                Recommendation

                                            </h4>

                                        </div>

                                        <p

                                            className="mt-3"

                                            style={{

                                                color:
                                                    theme.secondary

                                            }}

                                        >

                                            {item.recommendation}

                                        </p>

                                    </div>

                                </div>

                            )

                        )

                }

            </div>

            {/* Global Recommendations */}

            <div

                className="mt-8 rounded-2xl p-6"

                style={{

                    background:
                        "#16131F"

                }}

            >

                <div className="mb-5 flex items-center gap-2">

                    <Lightbulb

                        size={20}

                        color={theme.primaryLight}

                    />

                    <h3

                        style={{

                            color:
                                theme.text

                        }}

                    >

                        AI Recommendations

                    </h3>

                </div>

                <div className="space-y-3">

                    {

                        bottleneck.recommendations.map(

                            (item, index) => (

                                <div

                                    key={index}

                                    className="rounded-xl bg-violet-500/10 p-4"

                                >

                                    <p

                                        style={{

                                            color:
                                                theme.secondary

                                        }}

                                    >

                                        • {item}

                                    </p>

                                </div>

                            )

                        )

                    }

                </div>

            </div>

        </section>

    );

};

export default BottleneckAnalysisCard;