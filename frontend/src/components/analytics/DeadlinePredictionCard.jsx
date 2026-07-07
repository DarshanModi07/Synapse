import {
    CalendarClock,
    CalendarCheck2,
    CalendarX2,
    BadgeAlert,
    Brain
} from "lucide-react";

import { theme } from "@/lib/theme";

const DeadlinePredictionCard = ({

    data

}) => {

    if (!data) return null;

    const prediction = data.prediction;

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

                        Deadline Prediction

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        AI forecast based on project velocity and progress.

                    </p>

                </div>

                <CalendarClock

                    size={34}

                    color={theme.primaryLight}

                />

            </div>

            {/* Top Stats */}

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                {/* Completion */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <CalendarCheck2

                        size={24}

                        color="#22C55E"

                    />

                    <p

                        className="mt-4"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Predicted Completion

                    </p>

                    <h3

                        className="mt-2 text-lg font-bold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {

                            prediction.predictedCompletionDate ||

                            "Unknown"

                        }

                    </h3>

                </div>

                {/* Confidence */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <Brain

                        size={24}

                        color="#A78BFA"

                    />

                    <p

                        className="mt-4"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Confidence

                    </p>

                    <h3

                        className="mt-2 text-3xl font-bold"

                        style={{

                            color: theme.primaryLight

                        }}

                    >

                        {prediction.confidence}%

                    </h3>

                </div>

                {/* Miss */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background: "#16131F"

                    }}

                >

                    {

                        prediction.isLikelyToMissDeadline

                        ?

                        <CalendarX2

                            size={24}

                            color="#EF4444"

                        />

                        :

                        <CalendarCheck2

                            size={24}

                            color="#22C55E"

                        />

                    }

                    <p

                        className="mt-4"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Miss Deadline

                    </p>

                    <h3

                        className="mt-2 text-xl font-bold"

                        style={{

                            color:

                                prediction.isLikelyToMissDeadline

                                    ? "#EF4444"

                                    : "#22C55E"

                        }}

                    >

                        {

                            prediction.isLikelyToMissDeadline

                                ? "YES"

                                : "NO"

                        }

                    </h3>

                </div>

                {/* Delay */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <BadgeAlert

                        size={24}

                        color="#F59E0B"

                    />

                    <p

                        className="mt-4"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Delay Estimate

                    </p>

                    <h3

                        className="mt-2 text-3xl font-bold"

                        style={{

                            color: "#F59E0B"

                        }}

                    >

                        {prediction.delayEstimateDays}

                    </h3>

                    <p

                        className="text-sm"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        days

                    </p>

                </div>

            </div>

            {/* AI Reasoning */}

            <div

                className="mt-8 rounded-2xl p-6"

                style={{

                    background: "#16131F"

                }}

            >

                <div className="mb-5 flex items-center gap-2">

                    <Brain

                        size={20}

                        color={theme.primaryLight}

                    />

                    <h3

                        style={{

                            color: theme.text

                        }}

                    >

                        AI Reasoning

                    </h3>

                </div>

                <div className="space-y-3">

                    {

                        prediction.reasoning.map(

                            (item, index) => (

                                <div

                                    key={index}

                                    className="rounded-xl bg-violet-500/10 p-4"

                                >

                                    <p

                                        style={{

                                            color: theme.secondary

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

export default DeadlinePredictionCard;