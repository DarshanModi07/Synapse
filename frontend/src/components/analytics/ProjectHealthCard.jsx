import {
    HeartPulse,
    CheckCircle2,
    AlertTriangle,
    Wrench
} from "lucide-react";

import { theme } from "@/lib/theme";

const statusColor = {

    healthy: "text-green-400",

    warning: "text-yellow-400",

    at_risk: "text-orange-400",

    critical: "text-red-400"

};

const scoreColor = (score) => {

    if (score >= 80) return "#22C55E";

    if (score >= 60) return "#EAB308";

    if (score >= 40) return "#F97316";

    return "#EF4444";

};

const ProjectHealthCard = ({

    data

}) => {

    if (!data) return null;

    const health = data.health;

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

                        Project Health

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        AI generated health assessment.

                    </p>

                </div>

                <HeartPulse

                    size={34}

                    color="#EF4444"

                />

            </div>

            {/* Score */}

            <div className="mt-8 grid gap-5 md:grid-cols-2">

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <p

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Health Score

                    </p>

                    <h1

                        className="mt-4 text-6xl font-bold"

                        style={{

                            color: scoreColor(

                                health.healthScore

                            )

                        }}

                    >

                        {health.healthScore}

                    </h1>

                </div>

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <p

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Current Status

                    </p>

                    <h2

                        className={`mt-4 text-3xl font-bold ${statusColor[health.status]}`}

                    >

                        {

                            health.status

                                ?.replaceAll("_", " ")

                        }

                    </h2>

                </div>

            </div>

            {/* Details */}

            <div className="mt-10 grid gap-6 lg:grid-cols-3">

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

                            health.strengths.map(

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

                {/* Concerns */}

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

                            Concerns

                        </h3>

                    </div>

                    <div className="space-y-3">

                        {

                            health.concerns.map(

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

                {/* Actions */}

                <div>

                    <div className="mb-4 flex items-center gap-2">

                        <Wrench

                            size={20}

                            color="#A78BFA"

                        />

                        <h3

                            style={{

                                color: theme.text

                            }}

                        >

                            Recommended Actions

                        </h3>

                    </div>

                    <div className="space-y-3">

                        {

                            health.recommendedActions.map(

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

export default ProjectHealthCard;