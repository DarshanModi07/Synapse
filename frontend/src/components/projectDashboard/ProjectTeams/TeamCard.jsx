import {
    Users,
    User,
    BriefcaseBusiness,
    Activity,
    Trash2,
    ArrowRight
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { theme } from "@/lib/theme";

const TeamCard = ({
    team,
    onRemove
}) => {

    const navigate = useNavigate();

    const { slug } = useParams();

    return (

        <div

            className="rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"

            style={{

                background: "rgba(13,13,18,.55)",

                border:
                    "1px solid rgba(167,139,250,.10)",

                backdropFilter: "blur(24px)"

            }}

        >

            {/* Header */}

            <div className="flex items-start justify-between">

                <div>

                    <h2

                        className="text-xl font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {team.name}

                    </h2>

                    <p

                        className="mt-1 text-sm"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        {team.department?.name}

                    </p>

                </div>

                <button

    onClick={() =>

        navigate(

            `/workspace/${slug}/project-team/${team.projectTeamId}`

        )

    }

    className="rounded-xl p-2 transition hover:bg-white/5"

>
                    <ArrowRight

                        size={20}

                        color={theme.primaryLight}

                    />

                </button>

            </div>

            {/* Divider */}

            <div

                className="my-6 h-px"

                style={{

                    background:

                        "rgba(255,255,255,.05)"

                }}

            />

            {/* Leader */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <User

                        size={18}

                        color={theme.primaryLight}

                    />

                    <span

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Leader

                    </span>

                </div>

                <span

                    style={{

                        color: theme.text

                    }}

                >

                    {

                        team.leader?.name ||

                        "Not Assigned"

                    }

                </span>

            </div>

            {/* Members */}

            <div className="mt-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <Users

                        size={18}

                        color={theme.primaryLight}

                    />

                    <span

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Members

                    </span>

                </div>

                <span

                    style={{

                        color: theme.text

                    }}

                >

                    {team.members}

                </span>

            </div>

            {/* Tasks */}

            <div className="mt-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <BriefcaseBusiness

                        size={18}

                        color={theme.primaryLight}

                    />

                    <span

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Tasks

                    </span>

                </div>

                <span

                    style={{

                        color: theme.text

                    }}

                >

                    {team.tasks}

                </span>

            </div>

            {/* Progress */}

            <div className="mt-6">

                <div className="mb-2 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <Activity

                            size={18}

                            color={theme.primaryLight}

                        />

                        <span

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Progress

                        </span>

                    </div>

                    <span

                        style={{

                            color: theme.text

                        }}

                    >

                        {team.progress}%

                    </span>

                </div>

                <div

                    className="h-2 overflow-hidden rounded-full"

                    style={{

                        background:

                            "rgba(255,255,255,.08)"

                    }}

                >

                    <div

                        className="h-full rounded-full transition-all"

                        style={{

                            width:

                                `${team.progress}%`,

                            background:

                                "linear-gradient(90deg,#7C3AED,#A78BFA)"

                        }}

                    />

                </div>

            </div>

            {/* Footer */}

            <button

                onClick={() =>

                    onRemove(team)

                }

                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 transition"

                style={{

                    background:

                        "rgba(239,68,68,.08)",

                    border:

                        "1px solid rgba(239,68,68,.18)",

                    color:

                        "#EF4444"

                }}

            >

                <Trash2 size={17} />

                Remove Team

            </button>

        </div>

    );

};

export default TeamCard;