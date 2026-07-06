import { useState } from "react";

import { X, Mail, Shield, Briefcase } from "lucide-react";

import { theme } from "@/lib/theme";

const InviteMemberModal = ({

    open,

    workspaceId,

    loading,

    onClose,

    onInvite

}) => {

    const [form, setForm] = useState({

        email: "",

        sys_role: "employee",

        work_role: ""

    });

    if (!open) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        await onInvite({

            workspaceId,

            ...form

        });

        setForm({

            email: "",

            sys_role: "employee",

            work_role: ""

        });

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div

                className="w-full max-w-lg rounded-3xl p-8"

                style={{

                    background: theme.card,

                    border: "1px solid rgba(167,139,250,.12)"

                }}

            >

                {/* Header */}

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h2

                            className="text-2xl font-bold"

                            style={{

                                color: theme.text

                            }}

                        >

                            Invite Member

                        </h2>

                        <p

                            className="mt-1"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Send an invitation to join this workspace.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="rounded-lg p-2 hover:bg-white/5"

                    >

                        <X color={theme.secondary} />

                    </button>

                </div>

                <form

                    onSubmit={handleSubmit}

                    className="space-y-6"

                >

                    {/* Email */}

                    <div>

                        <label

                            className="mb-2 flex items-center gap-2 text-sm"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            <Mail size={16} />

                            Email

                        </label>

                        <input

                            type="email"

                            required

                            value={form.email}

                            onChange={(e) =>

                                setForm({

                                    ...form,

                                    email: e.target.value

                                })

                            }

                            className="w-full rounded-xl border border-zinc-700 bg-transparent px-4 py-3 outline-none"

                            style={{

                                color: theme.text

                            }}

                        />

                    </div>

                    {/* System Role */}

                    <div>

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

                            value={form.sys_role}

                            onChange={(e) =>

                                setForm({

                                    ...form,

                                    sys_role: e.target.value

                                })

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

                    {/* Work Role */}

                    <div>

                        <label

                            className="mb-2 flex items-center gap-2 text-sm"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            <Briefcase size={16} />

                            Work Role

                        </label>

                        <input

                            type="text"

                            value={form.work_role}

                            onChange={(e) =>

                                setForm({

                                    ...form,

                                    work_role: e.target.value

                                })

                            }

                            placeholder="Frontend Developer"

                            className="w-full rounded-xl border border-zinc-700 bg-transparent px-4 py-3 outline-none"

                            style={{

                                color: theme.text

                            }}

                        />

                    </div>

                    {/* Buttons */}

                    <div className="flex justify-end gap-3">

                        <button

                            type="button"

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

                            className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-500"

                        >

                            {

                                loading

                                    ? "Sending..."

                                    : "Send Invite"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default InviteMemberModal;