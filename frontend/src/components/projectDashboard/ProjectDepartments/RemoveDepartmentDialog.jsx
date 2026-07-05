import { useState } from "react";

import {
    removeDepartment
} from "@/services/projectDashboard.service";

import { theme } from "@/lib/theme";

const RemoveDepartmentDialog = ({

    open,

    projectId,

    department,

    onClose,

    onSuccess

}) => {

    const [loading, setLoading] =
        useState(false);

    if (!open || !department)
        return null;

    const handleRemove = async () => {

        try {

            setLoading(true);

            await removeDepartment(

                projectId,

                department.id

            );

            onSuccess();

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

            <div

                className="w-full max-w-md rounded-3xl p-8"

                style={{

                    background: theme.card,

                    border:
                        "1px solid rgba(255,255,255,.08)"

                }}

            >

                <h2

                    className="text-2xl font-bold"

                    style={{

                        color: theme.text

                    }}

                >

                    Remove Department

                </h2>

                <p

                    className="mt-4 leading-7"

                    style={{

                        color: theme.secondary

                    }}

                >

                    Are you sure you want to remove

                    <span

                        className="font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {" "}

                        {department.name}

                    </span>

                    {" "}from this project?

                </p>

                <div className="mt-8 flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="rounded-xl px-5 py-3"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Cancel

                    </button>

                    <button

                        disabled={loading}

                        onClick={handleRemove}

                        className="rounded-xl px-6 py-3"

                        style={{

                            background: "#EF4444",

                            color: "#fff"

                        }}

                    >

                        {

                            loading

                                ? "Removing..."

                                : "Remove"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default RemoveDepartmentDialog;