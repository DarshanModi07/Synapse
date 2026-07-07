import {
    BriefcaseBusiness,
    CircleCheckBig,
    TriangleAlert,
    ArrowRightCircle,
    Siren
} from "lucide-react";

import { theme } from "@/lib/theme";

const statusColor = {

    on_track:
        "bg-green-500/15 text-green-300",

    at_risk:
        "bg-yellow-500/15 text-yellow-300",

    delayed:
        "bg-orange-500/15 text-orange-300",

    critical:
        "bg-red-500/15 text-red-300"

};

const ExecutiveSummaryCard = ({

    data

}) => {

    if (!data) return null;

    const summary =
        data.summary;

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

                        Executive Summary

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color:
                                theme.secondary

                        }}

                    >

                        AI generated leadership overview.

                    </p>

                </div>

                <BriefcaseBusiness

                    size={34}

                    color={theme.primaryLight}

                />

            </div>

            {/* Status */}

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

                        Overall Status

                    </span>

                    <span

                        className={`rounded-full px-4 py-2 text-sm font-semibold ${statusColor[summary.overallStatus]}`}

                    >

                        {

                            summary.overallStatus.replace(

                                "_",

                                " "

                            )

                        }

                    </span>

                </div>

            </div>

            {/* Summary */}

            <div

                className="mt-8 rounded-2xl p-6"

                style={{

                    background:
                        "#16131F"

                }}

            >

                <h3

                    className="mb-4 text-lg font-semibold"

                    style={{

                        color:
                            theme.text

                    }}

                >

                    Executive Brief

                </h3>

                <p

                    className="leading-8"

                    style={{

                        color:
                            theme.secondary

                    }}

                >

                    {summary.summary}

                </p>

            </div>

            {/* Grid */}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

                {/* Achievements */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background:
                            "#16131F"

                    }}

                >

                    <div className="mb-5 flex items-center gap-2">

                        <CircleCheckBig

                            size={20}

                            color="#22C55E"

                        />

                        <h3

                            style={{

                                color:
                                    theme.text

                            }}

                        >

                            Key Achievements

                        </h3>

                    </div>

                    <div className="space-y-3">

                        {

                            summary.keyAchievements.map(

                                (item, index) => (

                                    <div

                                        key={index}

                                        className="rounded-xl bg-green-500/10 p-4"

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

                {/* Concerns */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background:
                            "#16131F"

                    }}

                >

                    <div className="mb-5 flex items-center gap-2">

                        <TriangleAlert

                            size={20}

                            color="#F59E0B"

                        />

                        <h3

                            style={{

                                color:
                                    theme.text

                            }}

                        >

                            Major Concerns

                        </h3>

                    </div>

                    <div className="space-y-3">

                        {

                            summary.majorConcerns.map(

                                (item, index) => (

                                    <div

                                        key={index}

                                        className="rounded-xl bg-yellow-500/10 p-4"

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

            </div>

            {/* Next Actions */}

            <div

                className="mt-8 rounded-2xl p-6"

                style={{

                    background:
                        "#16131F"

                }}

            >

                <div className="mb-5 flex items-center gap-2">

                    <ArrowRightCircle

                        size={20}

                        color={theme.primaryLight}

                    />

                    <h3

                        style={{

                            color:
                                theme.text

                        }}

                    >

                        Next Actions

                    </h3>

                </div>

                <div className="space-y-3">

                    {

                        summary.nextActions.map(

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

            {/* Red Flags */}

            <div

                className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6"

            >

                <div className="mb-5 flex items-center gap-2">

                    <Siren

                        size={20}

                        color="#EF4444"

                    />

                    <h3

                        style={{

                            color:
                                theme.text

                        }}

                    >

                        Red Flags

                    </h3>

                </div>

                {

                    summary.redFlags.length === 0

                        ?

                        (

                            <p

                                style={{

                                    color:
                                        theme.secondary

                                }}

                            >

                                No critical issues detected.

                            </p>

                        )

                        :

                        <div className="space-y-3">

                            {

                                summary.redFlags.map(

                                    (item, index) => (

                                        <div

                                            key={index}

                                            className="rounded-xl bg-red-500/10 p-4"

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

                }

            </div>

        </section>

    );

};

export default ExecutiveSummaryCard;