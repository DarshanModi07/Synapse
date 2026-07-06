import { useEffect, useState } from "react";

import { Shield, X } from "lucide-react";

import { theme } from "@/lib/theme";

import { changeWorkspaceRole } from "@/services/workspaceMember.service";

const ChangeRoleModal = ({

    open,

    workspaceId,

    member,

    onClose,

    refresh

}) => {

    const [role, setRole] =
        useState("employee");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        if (member) {
            setRole(member.sys_role);
        }

    }, [member]);

    if (!open || !member) return null;

    const handleSubmit = async () => {

        try {

            setLoading(true);

            await changeWorkspaceRole(

                workspaceId,

                member.userId,

                role

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

                    border: "1px solid rgba(167,139,250,.12)"

                }}

            >

                {/* Header */}

                <div className="flex items-center justify-between">

                    <div>

                        <h2

                            className="text-2xl font-bold"

                            style={{

                                color: theme.text

                            }}

                        >

                            Change Role

                        </h2>

                        <p

                            className="mt-2"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Update workspace role.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="rounded-lg p-2 hover:bg-white/5"

                    >

                        <X color={theme.secondary} />

                    </button>

                </div>

                {/* Member */}

                <div className="mt-8">

                    <label

                        className="mb-2 flex items-center gap-2 text-sm"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        <Shield size={16} />

                        System Role

                    </label>

                    <select

                        value={role}

                        onChange={(e) =>

                            setRole(

                                e.target.value

                            )

                        }

                        className="w-full rounded-xl border border-zinc-700 bg-[#13111C] px-4 py-3 outline-none"

                        style={{

                            color: theme.text

                        }}

                    >

                        <option value="manager">

                            Manager

                        </option>

                        <option value="team_lead">

                            Team Lead

                        </option>

                        <option value="employee">

                            Employee

                        </option>

                    </select>

                </div>

                {/* Footer */}

                <div className="mt-8 flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="rounded-xl border border-zinc-700 px-5 py-3"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        Cancel

                    </button>

                    <button

                        disabled={loading}

                        onClick={handleSubmit}

                        className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500"

                    >

                        {

                            loading

                                ? "Updating..."

                                : "Update Role"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default ChangeRoleModal;