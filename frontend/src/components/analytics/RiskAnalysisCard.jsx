import {
    ShieldAlert,
    AlertTriangle,
    ShieldCheck
} from "lucide-react";

import { theme } from "@/lib/theme";

const levelColor = {

    low: "text-green-400",

    medium: "text-yellow-400",

    high: "text-orange-400",

    critical: "text-red-400"

};

const badgeColor = {

    low: "bg-green-500/15 text-green-400",

    medium: "bg-yellow-500/15 text-yellow-400",

    high: "bg-orange-500/15 text-orange-400",

    critical: "bg-red-500/15 text-red-400"

};

const RiskAnalysisCard = ({

    data

}) => {

    if (!data) return null;

    const risk = data.risks;

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

                        Risk Analysis

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        AI detected project risks.

                    </p>

                </div>

                <ShieldAlert

                    size={34}

                    color="#F97316"

                />

            </div>

            {/* Overall Risk */}

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

                    Overall Risk Level

                </p>

                <h2

                    className={`mt-3 text-4xl font-bold ${levelColor[risk.riskLevel]}`}

                >

                    {

                        risk.riskLevel

                            ?.replaceAll("_", " ")

                    }

                </h2>

            </div>

            {/* Risks */}

            <div className="mt-8 space-y-6">

                {

                    risk.risks.length === 0 && (

                        <div

                            className="rounded-2xl p-8 text-center"

                            style={{

                                background: "#16131F",

                                color: theme.secondary

                            }}

                        >

                            <ShieldCheck

                                size={48}

                                className="mx-auto mb-4 text-green-400"

                            />

                            No major project risks detected.

                        </div>

                    )

                }

                {

                    risk.risks.map((item, index) => (

                        <div

                            key={index}

                            className="rounded-2xl p-6"

                            style={{

                                background: "#16131F"

                            }}

                        >

                            {/* Title */}

                            <div className="flex items-center justify-between">

                                <h3

                                    className="text-lg font-semibold"

                                    style={{

                                        color: theme.text

                                    }}

                                >

                                    {item.title}

                                </h3>

                                <span

                                    className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor[item.severity]}`}

                                >

                                    {item.severity}

                                </span>

                            </div>

                            {/* Category */}

                            <div className="mt-4">

                                <span

                                    className="rounded-full bg-violet-500/15 px-3 py-1 text-sm"

                                    style={{

                                        color: theme.primaryLight

                                    }}

                                >

                                    {item.category}

                                </span>

                            </div>

                            {/* Reason */}

                            <div className="mt-5">

                                <div className="mb-2 flex items-center gap-2">

                                    <AlertTriangle

                                        size={16}

                                        color="#F59E0B"

                                    />

                                    <span

                                        style={{

                                            color: theme.text

                                        }}

                                    >

                                        Reason

                                    </span>

                                </div>

                                <p

                                    style={{

                                        color: theme.secondary

                                    }}

                                >

                                    {item.reason}

                                </p>

                            </div>

                            {/* Mitigation */}

                            <div className="mt-5">

                                <div className="mb-2 flex items-center gap-2">

                                    <ShieldCheck

                                        size={16}

                                        color="#22C55E"

                                    />

                                    <span

                                        style={{

                                            color: theme.text

                                        }}

                                    >

                                        Mitigation

                                    </span>

                                </div>

                                <p

                                    style={{

                                        color: theme.secondary

                                    }}

                                >

                                    {item.mitigation}

                                </p>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

};

export default RiskAnalysisCard;