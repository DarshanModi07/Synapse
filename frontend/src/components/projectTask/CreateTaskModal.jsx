import { useState } from "react";

import { X } from "lucide-react";

import { theme } from "@/lib/theme";

const CreateTaskModal = ({
    open,
    loading,
    onClose,
    onCreate
}) => {

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [priority, setPriority] =
        useState("medium");

    const [dueDate, setDueDate] =
        useState("");

    if (!open) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!title.trim()) return;

        try {

            await onCreate({

                title: title.trim(),

                description,

                priority,

                dueDate

            });

            setTitle("");

            setDescription("");

            setPriority("medium");

            setDueDate("");

            onClose();

        }

        catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

            <div

                className="w-full max-w-2xl rounded-3xl p-8"

                style={{

                    background: theme.card,

                    border:
                        "1px solid rgba(255,255,255,.08)"

                }}

            >

                {/* Header */}

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h2

                            className="text-2xl font-semibold"

                            style={{

                                color: theme.text

                            }}

                        >

                            Create Task

                        </h2>

                        <p

                            className="mt-1"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Create a new task for this team.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="rounded-xl p-2 hover:bg-white/5"

                    >

                        <X color={theme.secondary} />

                    </button>

                </div>

                <form

                    onSubmit={handleSubmit}

                    className="space-y-6"

                >

                    {/* Title */}

                    <div>

                        <label
                            className="mb-2 block text-sm"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Title

                        </label>

                        <input

                            value={title}

                            onChange={(e) =>
                                setTitle(e.target.value)
                            }

                            required

                            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"

                        />

                    </div>

                    {/* Description */}

                    <div>

                        <label
                            className="mb-2 block text-sm"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Description

                        </label>

                        <textarea

                            rows={5}

                            value={description}

                            onChange={(e) =>
                                setDescription(e.target.value)
                            }

                            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"

                        />

                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        {/* Priority */}

                        <div>

                            <label

                                className="mb-2 block text-sm"

                                style={{

                                    color: theme.secondary

                                }}

                            >

                                Priority

                            </label>

                            <select

                                value={priority}

                                onChange={(e) =>
                                    setPriority(e.target.value)
                                }

                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"

                            >

                                <option value="low">
                                    Low
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="high">
                                    High
                                </option>

                                <option value="urgent">
                                    Urgent
                                </option>

                            </select>

                        </div>

                        {/* Due Date */}

                        <div>

                            <label

                                className="mb-2 block text-sm"

                                style={{

                                    color: theme.secondary

                                }}

                            >

                                Due Date

                            </label>

                            <input

                                type="date"

                                value={dueDate}

                                onChange={(e) =>
                                    setDueDate(e.target.value)
                                }

                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"

                            />

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="flex justify-end gap-3">

                        <button

                            type="button"

                            onClick={onClose}

                            className="rounded-xl border border-zinc-700 px-6 py-3"

                            style={{

                                color: theme.secondary

                            }}

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            disabled={loading}

                            className="rounded-xl bg-violet-600 px-6 py-3 text-white hover:bg-violet-500"

                        >

                            {

                                loading

                                    ?

                                    "Creating..."

                                    :

                                    "Create Task"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default CreateTaskModal;