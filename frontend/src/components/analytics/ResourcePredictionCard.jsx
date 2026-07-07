import {
    UsersRound,
    UserPlus,
    TriangleAlert,
    Briefcase,
    Lightbulb
} from "lucide-react";

import { theme } from "@/lib/theme";

const urgencyColor = {

    low:
        "text-green-400",

    medium:
        "text-yellow-400",

    high:
        "text-orange-400",

    critical:
        "text-red-400"

};

const ResourcePredictionCard = ({

    data

}) => {

    if (!data) return null;

    const resource =
        data.resources;

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

                        Resource Prediction

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color:
                                theme.secondary

                        }}

                    >

                        AI prediction for future resource requirements.

                    </p>

                </div>

                <UsersRound

                    size={34}

                    color={theme.primaryLight}

                />

            </div>

            {/* Top Stats */}

            <div className="mt-8 grid gap-6 md:grid-cols-2">

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background:
                            "#16131F"

                    }}

                >

                    <UserPlus

                        size={24}

                        color="#22C55E"

                    />

                    <p

                        className="mt-4"

                        style={{

                            color:
                                theme.secondary

                        }}

                    >

                        Additional Resources Needed

                    </p>

                    <h2

                        className="mt-2 text-5xl font-bold"

                        style={{

                            color:
                                theme.primaryLight

                        }}

                    >

                        {

                            resource.additionalResourcesNeeded

                        }

                    </h2>

                </div>

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background:
                            "#16131F"

                    }}

                >

                    <TriangleAlert

                        size={24}

                        color="#F59E0B"

                    />

                    <p

                        className="mt-4"

                        style={{

                            color:
                                theme.secondary

                        }}

                    >

                        Urgency

                    </p>

                    <h2

                        className={`mt-2 text-3xl font-bold ${urgencyColor[resource.urgency]}`}

                    >

                        {

                            resource.urgency

                                ?.replaceAll("_", " ")

                        }

                    </h2>

                </div>

            </div>

            {/* Lists */}

            <div className="mt-10 grid gap-6 lg:grid-cols-2">

                {/* Roles */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background:
                            "#16131F"

                    }}

                >

                    <div className="mb-5 flex items-center gap-2">

                        <Briefcase

                            size={18}

                            color={theme.primaryLight}

                        />

                        <h3

                            style={{

                                color:
                                    theme.text

                            }}

                        >

                            Recommended Roles

                        </h3>

                    </div>

                    <div className="space-y-3">

                        {

                            resource.recommendedRoles.length === 0

                                ?

                                (

                                    <p

                                        style={{

                                            color:
                                                theme.secondary

                                        }}

                                    >

                                        No additional roles required.

                                    </p>

                                )

                                :

                                resource.recommendedRoles.map(

                                    (role, index) => (

                                        <div

                                            key={index}

                                            className="rounded-xl bg-violet-500/10 p-3"

                                        >

                                            <p

                                                style={{

                                                    color:
                                                        theme.primaryLight

                                                }}

                                            >

                                                {role}

                                            </p>

                                        </div>

                                    )

                                )

                        }

                    </div>

                </div>

                {/* Teams */}

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background:
                            "#16131F"

                    }}

                >

                    <div className="mb-5 flex items-center gap-2">

                        <UsersRound

                            size={18}

                            color="#3B82F6"

                        />

                        <h3

                            style={{

                                color:
                                    theme.text

                            }}

                        >

                            Teams Needing Support

                        </h3>

                    </div>

                    <div className="space-y-3">

                        {

                            resource.teamsNeedingSupport.length === 0

                                ?

                                (

                                    <p

                                        style={{

                                            color:
                                                theme.secondary

                                        }}

                                    >

                                        No support required.

                                    </p>

                                )

                                :

                                resource.teamsNeedingSupport.map(

                                    (team, index) => (

                                        <div

                                            key={index}

                                            className="rounded-xl bg-blue-500/10 p-3"

                                        >

                                            <p

                                                className="text-blue-300"

                                            >

                                                {team}

                                            </p>

                                        </div>

                                    )

                                )

                        }

                    </div>

                </div>

            </div>

            {/* Reason */}

            <div

                className="mt-8 rounded-2xl p-6"

                style={{

                    background:
                        "#16131F"

                }}

            >

                <div className="mb-3 flex items-center gap-2">

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

                        Why?

                    </h3>

                </div>

                <p

                    style={{

                        color:
                            theme.secondary

                    }}

                >

                    {resource.reason}

                </p>

            </div>

            {/* Impact */}

            <div

                className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-6"

            >

                <h3

                    className="mb-3 text-lg font-semibold text-red-400"

                >

                    Impact If Resources Are Not Added

                </h3>

                <p

                    style={{

                        color:
                            theme.secondary

                    }}

                >

                    {resource.impactIfNotAdded}

                </p>

            </div>

        </section>

    );

};

export default ResourcePredictionCard;