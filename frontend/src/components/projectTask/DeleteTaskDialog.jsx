import { AlertTriangle } from "lucide-react";

import { theme } from "@/lib/theme";

const DeleteTaskDialog = ({
    open,
    task,
    loading,
    onClose,
    onDelete
}) => {

    if (!open || !task) return null;

    const handleDelete = async () => {

        try {

            await onDelete(task.id);

            onClose();

        }
        catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

            <div

                className="w-full max-w-md rounded-3xl p-7"

                style={{

                    background: theme.card,

                    border:
                        "1px solid rgba(239,68,68,.15)"

                }}

            >

                {/* Icon */}

                <div className="flex justify-center">

                    <div

                        className="flex h-16 w-16 items-center justify-center rounded-full"

                        style={{

                            background:
                                "rgba(239,68,68,.12)"

                        }}

                    >

                        <AlertTriangle

                            size={34}

                            color="#EF4444"

                        />

                    </div>

                </div>

                {/* Title */}

                <h2

                    className="mt-6 text-center text-2xl font-semibold"

                    style={{

                        color: theme.text

                    }}

                >

                    Delete Task

                </h2>

                {/* Message */}

                <p

                    className="mt-3 text-center"

                    style={{

                        color: theme.secondary

                    }}

                >

                    Are you sure you want to delete

                    <br />

                    <span

                        className="font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {task.title}

                    </span>

                    ?

                </p>

                <p

                    className="mt-2 text-center text-sm"

                    style={{

                        color: "#F59E0B"

                    }}

                >

                    Tasks containing subtasks cannot be deleted.

                </p>

                {/* Buttons */}

                <div className="mt-8 flex gap-3">

                    <button

                        onClick={onClose}

                        className="flex-1 rounded-xl py-3 transition"

                        style={{

                            border:
                                "1px solid rgba(255,255,255,.08)",

                            color:
                                theme.secondary

                        }}

                    >

                        Cancel

                    </button>

                    <button

                        onClick={handleDelete}

                        disabled={loading}

                        className="flex-1 rounded-xl py-3 text-white transition"

                        style={{

                            background:
                                "#DC2626"

                        }}

                    >

                        {

                            loading

                                ?

                                "Deleting..."

                                :

                                "Delete"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default DeleteTaskDialog;