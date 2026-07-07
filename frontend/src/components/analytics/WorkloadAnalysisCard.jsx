import {
    Users,
    AlertTriangle,
    CheckCircle2,
    ArrowDownCircle,
    Lightbulb
} from "lucide-react";

import { theme } from "@/lib/theme";

const WorkloadAnalysisCard = ({

    data

}) => {

    if (!data) return null;

    const workload = data.workload;

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

                        Workload Analysis

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        AI workload distribution across team members.

                    </p>

                </div>

                <Users

                    size={34}

                    color={theme.primaryLight}

                />

            </div>

            {/* Overview */}

            <div className="mt-8 grid gap-5 md:grid-cols-3">

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <AlertTriangle

                        size={22}

                        color="#EF4444"

                    />

                    <p

                        className="mt-4"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Overloaded

                    </p>

                    <h2

                        className="mt-3 text-4xl font-bold text-red-400"

                    >

                        {

                            workload.overloadedMembers.length

                        }

                    </h2>

                </div>

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <CheckCircle2

                        size={22}

                        color="#22C55E"

                    />

                    <p

                        className="mt-4"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Balanced

                    </p>

                    <h2

                        className="mt-3 text-4xl font-bold text-green-400"

                    >

                        {

                            workload.balancedMembers.length

                        }

                    </h2>

                </div>

                <div

                    className="rounded-2xl p-6"

                    style={{

                        background: "#16131F"

                    }}

                >

                    <ArrowDownCircle

                        size={22}

                        color="#3B82F6"

                    />

                    <p

                        className="mt-4"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Underutilized

                    </p>

                    <h2

                        className="mt-3 text-4xl font-bold text-blue-400"

                    >

                        {

                            workload.underutilizedMembers.length

                        }

                    </h2>

                </div>

            </div>

            {/* Details */}

            <div className="mt-10 grid gap-6 lg:grid-cols-3">

                {/* Overloaded */}

                <div>

                    <h3

                        className="mb-4 text-lg font-semibold text-red-400"

                    >

                        Overloaded Members

                    </h3>

                    <div className="space-y-4">

                        {

                            workload.overloadedMembers.length === 0

                            &&

                            (

                                <div

                                    className="rounded-xl bg-green-500/10 p-4 text-green-400"

                                >

                                    No overloaded members.

                                </div>

                            )

                        }

                        {

                            workload.overloadedMembers.map(

                                (member, index) => (

                                    <div

                                        key={index}

                                        className="rounded-xl bg-red-500/10 p-4"

                                    >

                                        <h4

                                            className="font-semibold text-red-300"

                                        >

                                            {member.name}

                                        </h4>

                                        <p

                                            className="mt-2 text-sm"

                                            style={{

                                                color: theme.secondary

                                            }}

                                        >

                                            {member.subtaskCount} Subtasks

                                        </p>

                                        <p

                                            className="text-sm"

                                            style={{

                                                color: theme.secondary

                                            }}

                                        >

                                            {member.overdueCount} Overdue

                                        </p>

                                        <p

                                            className="mt-2 text-sm text-red-300"

                                        >

                                            {member.risk}

                                        </p>

                                    </div>

                                )

                            )

                        }

                    </div>

                </div>

                {/* Balanced */}

                <div>

                    <h3

                        className="mb-4 text-lg font-semibold text-green-400"

                    >

                        Balanced Members

                    </h3>

                    <div className="space-y-4">

                        {

                            workload.balancedMembers.map(

                                (member, index) => (

                                    <div

                                        key={index}

                                        className="rounded-xl bg-green-500/10 p-4"

                                    >

                                        <h4

                                            className="font-semibold text-green-300"

                                        >

                                            {member.name}

                                        </h4>

                                        <p

                                            className="mt-2 text-sm"

                                            style={{

                                                color: theme.secondary

                                            }}

                                        >

                                            {member.subtaskCount} Assigned Subtasks

                                        </p>

                                    </div>

                                )

                            )

                        }

                    </div>

                </div>

                {/* Underutilized */}

                <div>

                    <h3

                        className="mb-4 text-lg font-semibold text-blue-400"

                    >

                        Underutilized Members

                    </h3>

                    <div className="space-y-4">

                        {

                            workload.underutilizedMembers.map(

                                (member, index) => (

                                    <div

                                        key={index}

                                        className="rounded-xl bg-blue-500/10 p-4"

                                    >

                                        <h4

                                            className="font-semibold text-blue-300"

                                        >

                                            {member.name}

                                        </h4>

                                        <p

                                            className="mt-2 text-sm"

                                            style={{

                                                color: theme.secondary

                                            }}

                                        >

                                            {member.subtaskCount} Assigned Subtasks

                                        </p>

                                        <p

                                            className="mt-2 text-sm text-blue-300"

                                        >

                                            {member.recommendation}

                                        </p>

                                    </div>

                                )

                            )

                        }

                    </div>

                </div>

            </div>

            {/* AI Recommendations */}

            <div

                className="mt-10 rounded-2xl p-6"

                style={{

                    background: "#16131F"

                }}

            >

                <div className="mb-5 flex items-center gap-2">

                    <Lightbulb

                        size={20}

                        color={theme.primaryLight}

                    />

                    <h3

                        style={{

                            color: theme.text

                        }}

                    >

                        AI Recommendations

                    </h3>

                </div>

                <div className="space-y-3">

                    {

                        workload.recommendations.map(

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

export default WorkloadAnalysisCard;