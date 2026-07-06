import { useState } from "react";

import {
    AlertTriangle
} from "lucide-react";

import { theme } from "@/lib/theme";

import {
    removeWorkspaceMember
} from "@/services/workspaceMember.service";

const RemoveMemberDialog = ({

    open,

    workspaceId,

    member,

    onClose,

    refresh

}) => {

    const [loading, setLoading] =
        useState(false);

    if (!open || !member) return null;

    const handleRemove = async () => {

        try {

            setLoading(true);

            await removeWorkspaceMember(

                workspaceId,

                member.id

            );

            await refresh();

            onClose();

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div

                className="w-full max-w-md rounded-3xl p-8"

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

                    className="mt-6 text-center text-2xl font-bold"

                    style={{

                        color: theme.text

                    }}

                >

                    Remove Member

                </h2>

                <p

                    className="mt-4 text-center"

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

                        {member.name}

                    </span>

                    <br />

                    from this workspace?

                </p>

                {/* Buttons */}

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

                        onClick={handleRemove}

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

export default RemoveMemberDialog;