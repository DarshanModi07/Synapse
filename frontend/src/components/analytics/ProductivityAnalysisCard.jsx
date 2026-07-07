import {
    Trophy,
    TrendingDown,
    Eye,
    Lightbulb
} from "lucide-react";

import { theme } from "@/lib/theme";

const ProductivityAnalysisCard = ({

    data

}) => {

    if (!data) return null;

    const productivity =
        data.productivity;

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

                        Productivity Analysis

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color:
                                theme.secondary

                        }}

                    >

                        AI comparison of team and employee productivity.

                    </p>

                </div>

                <Trophy

                    size={34}

                    color="#FACC15"

                />

            </div>

            {/* Performers */}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

                {/* Top */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background:
                            "#16131F"

                    }}

                >

                    <div className="mb-5 flex items-center gap-2">

                        <Trophy

                            size={20}

                            color="#22C55E"

                        />

                        <h3

                            style={{

                                color:
                                    theme.text

                            }}

                        >

                            Top Performers

                        </h3>

                    </div>

                    <div className="space-y-4">

                        {

                            productivity.topPerformers.length === 0

                                ?

                                (

                                    <p

                                        style={{

                                            color:
                                                theme.secondary

                                        }}

                                    >

                                        No data available.

                                    </p>

                                )

                                :

                                productivity.topPerformers.map(

                                    (item, index) => (

                                        <div

                                            key={index}

                                            className="rounded-xl bg-green-500/10 p-4"

                                        >

                                            <div className="flex items-center justify-between">

                                                <h4

                                                    className="font-semibold text-green-300"

                                                >

                                                    {item.name}

                                                </h4>

                                                <span

                                                    className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300"

                                                >

                                                    {item.type}

                                                </span>

                                            </div>

                                            <p

                                                className="mt-3 text-sm"

                                                style={{

                                                    color:
                                                        theme.secondary

                                                }}

                                            >

                                                Completion Rate :

                                                {" "}

                                                {item.completionRate}%

                                            </p>

                                            <p

                                                className="mt-2 text-sm text-green-300"

                                            >

                                                {item.reason}

                                            </p>

                                        </div>

                                    )

                                )

                        }

                    </div>

                </div>

                {/* Lowest */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background:
                            "#16131F"

                    }}

                >

                    <div className="mb-5 flex items-center gap-2">

                        <TrendingDown

                            size={20}

                            color="#EF4444"

                        />

                        <h3

                            style={{

                                color:
                                    theme.text

                            }}

                        >

                            Lowest Performers

                        </h3>

                    </div>

                    <div className="space-y-4">

                        {

                            productivity.lowestPerformers.length === 0

                                ?

                                (

                                    <p

                                        style={{

                                            color:
                                                theme.secondary

                                        }}

                                    >

                                        No data available.

                                    </p>

                                )

                                :

                                productivity.lowestPerformers.map(

                                    (item, index) => (

                                        <div

                                            key={index}

                                            className="rounded-xl bg-red-500/10 p-4"

                                        >

                                            <div className="flex items-center justify-between">

                                                <h4

                                                    className="font-semibold text-red-300"

                                                >

                                                    {item.name}

                                                </h4>

                                                <span

                                                    className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300"

                                                >

                                                    {item.type}

                                                </span>

                                            </div>

                                            <p

                                                className="mt-3 text-sm"

                                                style={{

                                                    color:
                                                        theme.secondary

                                                }}

                                            >

                                                Completion Rate :

                                                {" "}

                                                {item.completionRate}%

                                            </p>

                                            <p

                                                className="mt-2 text-sm text-red-300"

                                            >

                                                {item.reason}

                                            </p>

                                        </div>

                                    )

                                )

                        }

                    </div>

                </div>

            </div>

            {/* Observations */}

            <div

                className="mt-8 rounded-2xl p-6"

                style={{

                    background:
                        "#16131F"

                }}

            >

                <div className="mb-5 flex items-center gap-2">

                    <Eye

                        size={20}

                        color="#60A5FA"

                    />

                    <h3

                        style={{

                            color:
                                theme.text

                        }}

                    >

                        AI Observations

                    </h3>

                </div>

                <div className="space-y-3">

                    {

                        productivity.observations.map(

                            (item, index) => (

                                <div

                                    key={index}

                                    className="rounded-xl bg-blue-500/10 p-4"

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

            {/* Recommendations */}

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

                        productivity.recommendations.map(

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

export default ProductivityAnalysisCard;