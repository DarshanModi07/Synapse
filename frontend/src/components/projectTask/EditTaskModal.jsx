import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { theme } from "@/lib/theme";

const EditTaskModal = ({
    open,
    task,
    loading,
    onClose,
    onUpdate
}) => {

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [priority, setPriority] = useState("medium");

    const [status, setStatus] = useState("todo");

    const [dueDate, setDueDate] = useState("");

    useEffect(() => {

        if (!task) return;

        setTitle(task.title || "");

        setDescription(task.description || "");

        setPriority(task.priority || "medium");

        setStatus(task.status || "todo");

        setDueDate(
            task.dueDate
                ? task.dueDate.substring(0, 10)
                : ""
        );

    }, [task]);

    if (!open || !task) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await onUpdate(

                task.id,

                {

                    title,

                    description,

                    priority,

                    status,

                    dueDate

                }

            );

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

                            Edit Task

                        </h2>

                        <p
                            style={{
                                color: theme.secondary
                            }}
                        >

                            Update task information

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

                            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"

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

                            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"

                        />

                    </div>

                    <div className="grid grid-cols-3 gap-5">

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

                        <div>

                            <label
                                className="mb-2 block text-sm"
                                style={{
                                    color: theme.secondary
                                }}
                            >

                                Status

                            </label>

                            <select

                                value={status}

                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }

                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"

                            >

                                <option value="todo">Todo</option>

                                <option value="in_progress">
                                    In Progress
                                </option>

                                <option value="in_review">
                                    In Review
                                </option>

                                <option value="done">
                                    Done
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>

                            </select>

                        </div>

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

                                    ? "Updating..."

                                    : "Update Task"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default EditTaskModal;