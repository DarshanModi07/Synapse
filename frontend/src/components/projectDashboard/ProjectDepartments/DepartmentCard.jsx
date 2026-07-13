import {
    Building2,
    UserCog,
    Users,
    CheckCircle2,
    Trash2,
    ArrowRight
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";

import { theme } from "@/lib/theme";

const DepartmentCard = ({

    department,

    onRemove

}) => {

    const navigate = useNavigate();
    const { slug } = useParams();
    const { workspace } = useWorkspace();
    
    const rolePrefix = workspace?.memberRole?.sysRole === "manager" ? "/manager" : "";

    return (

        <div

            className="group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"

            style={{

                background: "rgba(13,13,18,.55)",

                border: "1px solid rgba(167,139,250,.10)",

                backdropFilter: "blur(24px)"

            }}

        >

            <div className="flex items-start justify-between">

                <div>

                    <h2

                        className="text-2xl font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {department.name}

                    </h2>

                    <p

                        className="mt-2"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Assigned Department

                    </p>

                </div>

                <button

                    onClick={() =>
                        navigate(
                            `/workspace/${slug}${rolePrefix}/departments/${department.id}`
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

            <div

                className="my-6 h-px"

                style={{

                    background:

                        "rgba(255,255,255,.05)"

                }}

            />

            <div className="space-y-5">

                <div className="flex justify-between">

                    <div className="flex items-center gap-3">

                        <UserCog

                            size={18}

                            color={theme.primaryLight}

                        />

                        <span

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Manager

                        </span>

                    </div>

                    <span

                        style={{

                            color: theme.text

                        }}

                    >

                        {

                            department.manager?.name ||

                            "Not Assigned"

                        }

                    </span>

                </div>

                <div className="flex justify-between">

                    <div className="flex items-center gap-3">

                        <Building2

                            size={18}

                            color={theme.primaryLight}

                        />

                        <span

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Teams

                        </span>

                    </div>

                    <span

                        style={{

                            color: theme.text

                        }}

                    >

                        {department.teams}

                    </span>

                </div>

                <div className="flex justify-between">

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

                            Tasks

                        </span>

                    </div>

                    <span

                        style={{

                            color: theme.text

                        }}

                    >

                        {department.tasks}

                    </span>

                </div>

                <div>

                    <div className="mb-2 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <CheckCircle2

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

                            {department.progress}%

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

                            className="h-full rounded-full"

                            style={{

                                width: `${department.progress}%`,

                                background:
                                    "linear-gradient(90deg,#7C3AED,#A78BFA)"

                            }}

                        />

                    </div>

                </div>

            </div>

            <div className="mt-8">

                <button

                    onClick={() =>

                        onRemove(department)

                    }

                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3"

                    style={{

                        background:

                            "rgba(255,0,0,.08)",

                        border:

                            "1px solid rgba(255,0,0,.15)",

                        color:

                            "#FF6B6B"

                    }}

                >

                    <Trash2 size={17} />

                    Remove Department

                </button>

            </div>

        </div>

    );

};

export default DepartmentCard;