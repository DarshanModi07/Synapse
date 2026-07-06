import {
    Calendar,
    Flag,
    SquarePen,
    Trash2
} from "lucide-react";

import { theme } from "@/lib/theme";

const priorityColor = {

    low: "bg-green-500/15 text-green-400",

    medium: "bg-yellow-500/15 text-yellow-400",

    high: "bg-orange-500/15 text-orange-400",

    urgent: "bg-red-500/15 text-red-400"

};

const statusColor = {

    todo: "bg-zinc-700 text-zinc-300",

    in_progress: "bg-blue-500/15 text-blue-400",

    in_review: "bg-amber-500/15 text-amber-400",

    done: "bg-green-500/15 text-green-400",

    cancelled: "bg-red-500/15 text-red-400"

};

const TaskCard = ({

    task,

    onEdit,

    onDelete

}) => {

    return (

        <div

            className="rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"

            style={{

                background: "rgba(13,13,18,.55)",

                border:
                    "1px solid rgba(167,139,250,.08)",

                backdropFilter: "blur(20px)"

            }}

        >

            {/* Header */}

            <div className="flex items-start justify-between">

                <div className="space-y-2">

                    <h3

                        className="text-lg font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {task.title}

                    </h3>

                    <p

                        className="text-sm"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        {

                            task.description ||

                            "No description"

                        }

                    </p>

                </div>

            </div>

            {/* Badges */}

            <div className="mt-6 flex flex-wrap gap-2">

                <span

                    className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColor[task.priority]}`}

                >

                    <Flag

                        size={12}

                        className="mr-1 inline"

                    />

                    {task.priority}

                </span>

                <span

                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[task.status]}`}

                >

                    {task.status.replace("_", " ")}

                </span>

            </div>

            {/* Due Date */}

            <div

                className="mt-6 flex items-center gap-2 text-sm"

                style={{

                    color: theme.secondary

                }}

            >

                <Calendar size={16} />

                {

                    task.dueDate

                        ?

                        new Date(

                            task.dueDate

                        ).toLocaleDateString()

                        :

                        "No Due Date"

                }

            </div>

            {/* Footer */}

            <div className="mt-8 flex gap-3">

                <button

                    onClick={() =>

                        onEdit(task)

                    }

                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 transition hover:bg-violet-500/10"

                    style={{

                        border:
                            "1px solid rgba(124,58,237,.2)",

                        color:
                            theme.primaryLight

                    }}

                >

                    <SquarePen size={18} />

                    Edit

                </button>

                <button

                    onClick={() =>

                        onDelete(task)

                    }

                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 transition hover:bg-red-500/10"

                    style={{

                        border:
                            "1px solid rgba(239,68,68,.15)",

                        color:
                            "#EF4444"

                    }}

                >

                    <Trash2 size={18} />

                    Delete

                </button>

            </div>

        </div>

    );

};

export default TaskCard;