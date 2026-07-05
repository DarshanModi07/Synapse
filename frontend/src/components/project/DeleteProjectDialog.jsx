import { AlertTriangle } from "lucide-react";

import { theme } from "@/lib/theme";

const DeleteProjectDialog = ({
    open,
    project,
    loading,
    onClose,
    onDelete
}) => {

    if (!open || !project) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

            <div

                className="w-full max-w-md rounded-3xl p-8"

                style={{

                    background: theme.card,

                    border:
                        "1px solid rgba(239,68,68,.15)"

                }}

            >

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

                <h2

                    className="mt-6 text-center text-2xl font-semibold"

                    style={{

                        color: theme.text

                    }}

                >

                    Delete Project

                </h2>

                <p

                    className="mt-3 text-center"

                    style={{

                        color: theme.secondary

                    }}

                >

                    You are about to permanently delete

                    <br />

                    <span

                        className="font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {project.name}

                    </span>

                    <br />

                    This action cannot be undone.

                </p>

                <div className="mt-8 flex gap-3">

                    <button

                        onClick={onClose}

                        disabled={loading}

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

                        onClick={() =>
                            onDelete(project.id)
                        }

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

export default DeleteProjectDialog;