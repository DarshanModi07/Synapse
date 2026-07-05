import { AlertTriangle } from "lucide-react";

import { theme } from "@/lib/theme";

const RemoveTeamDialog = ({
    open,
    team,
    loading,
    onClose,
    onRemove
}) => {

    if (!open || !team) return null;

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

                <div className="flex justify-center">

                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-full"
                        style={{
                            background:
                                "rgba(239,68,68,.12)"
                        }}
                    >

                        <AlertTriangle
                            size={32}
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
                    Remove Team
                </h2>

                <p
                    className="mt-3 text-center"
                    style={{
                        color: theme.secondary
                    }}
                >
                    Are you sure you want to remove
                    <br />

                    <span
                        className="font-semibold"
                        style={{
                            color: theme.text
                        }}
                    >
                        {team.name}
                    </span>

                    <br />

                    from this project?
                </p>

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

                        onClick={onRemove}

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

                                "Removing..."

                                :

                                "Remove"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default RemoveTeamDialog;