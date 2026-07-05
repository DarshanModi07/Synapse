import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { theme } from "@/lib/theme";

const EditProjectModal = ({
    open,
    loading,
    project,
    onClose,
    onSave
}) => {

    const [form, setForm] = useState({

        name: "",

        description: "",

        status: "planning",

        startDate: "",

        dueDate: ""

    });

    const [errors, setErrors] =
        useState({});

    useEffect(() => {

        if (project) {

            setForm({

                name:
                    project.name || "",

                description:
                    project.description || "",

                status:
                    project.status || "planning",

                startDate:
                    project.startDate
                        ? project.startDate.substring(0, 10)
                        : "",

                dueDate:
                    project.dueDate
                        ? project.dueDate.substring(0, 10)
                        : ""

            });

        }

    }, [project]);

    if (!open || !project) return null;

        const handleChange = (e) => {

        const {

            name,

            value

        } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };

    const validate = () => {

        const temp = {};

        if (!form.name.trim()) {

            temp.name =
                "Project name is required";

        }

        if (

            form.startDate &&

            form.dueDate &&

            new Date(form.startDate) >

            new Date(form.dueDate)

        ) {

            temp.dueDate =
                "Due date must be after start date";

        }

        setErrors(temp);

        return Object.keys(temp).length === 0;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            await onSave(

                project.id,

                form

            );

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
                        "1px solid rgba(167,139,250,.12)"

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

                            Edit Project

                        </h2>

                        <p

                            className="mt-1"

                            style={{
                                color: theme.secondary
                            }}

                        >

                            Update project information.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="rounded-xl p-2 transition hover:bg-white/5"

                    >

                        <X

                            size={22}

                            color={theme.secondary}

                        />

                    </button>

                </div>

                <form

                    onSubmit={handleSubmit}

                    className="space-y-6"

                >

                    {/* Project Name */}

                    <div>

                        <label

                            className="mb-2 block text-sm"

                            style={{
                                color: theme.secondary
                            }}

                        >

                            Project Name

                        </label>

                        <input

                            type="text"

                            name="name"

                            value={form.name}

                            onChange={handleChange}

                            className="w-full rounded-2xl px-4 py-3 outline-none"

                            style={{

                                background:
                                    "rgba(255,255,255,.04)",

                                border:
                                    "1px solid rgba(255,255,255,.08)",

                                color:
                                    theme.text

                            }}

                        />

                        {

                            errors.name && (

                                <p className="mt-2 text-sm text-red-400">

                                    {errors.name}

                                </p>

                            )

                        }

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

                            name="description"

                            value={form.description}

                            onChange={handleChange}

                            className="w-full resize-none rounded-2xl px-4 py-3 outline-none"

                            style={{

                                background:
                                    "rgba(255,255,255,.04)",

                                border:
                                    "1px solid rgba(255,255,255,.08)",

                                color:
                                    theme.text

                            }}

                        />

                    </div>

                    {/* Status */}

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

                            name="status"

                            value={form.status}

                            onChange={handleChange}

                            className="w-full rounded-2xl px-4 py-3 outline-none"

                            style={{

                                background:
                                    "rgba(255,255,255,.04)",

                                border:
                                    "1px solid rgba(255,255,255,.08)",

                                color:
                                    theme.text

                            }}

                        >

                            <option value="planning">
                                Planning
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="on_hold">
                                On Hold
                            </option>

                        </select>

                    </div>

                    <div className="grid grid-cols-2 gap-5">

                                            {/* Start Date */}

                        <div>

                            <label

                                className="mb-2 block text-sm"

                                style={{
                                    color: theme.secondary
                                }}

                            >

                                Start Date

                            </label>

                            <input

                                type="date"

                                name="startDate"

                                value={form.startDate}

                                onChange={handleChange}

                                className="w-full rounded-2xl px-4 py-3 outline-none"

                                style={{

                                    background:
                                        "rgba(255,255,255,.04)",

                                    border:
                                        "1px solid rgba(255,255,255,.08)",

                                    color:
                                        theme.text

                                }}

                            />

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

                                name="dueDate"

                                value={form.dueDate}

                                onChange={handleChange}

                                className="w-full rounded-2xl px-4 py-3 outline-none"

                                style={{

                                    background:
                                        "rgba(255,255,255,.04)",

                                    border:
                                        "1px solid rgba(255,255,255,.08)",

                                    color:
                                        theme.text

                                }}

                            />

                            {

                                errors.dueDate && (

                                    <p className="mt-2 text-sm text-red-400">

                                        {errors.dueDate}

                                    </p>

                                )

                            }

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="flex justify-end gap-4 pt-4">

                        <button

                            type="button"

                            onClick={onClose}

                            disabled={loading}

                            className="rounded-2xl px-6 py-3 transition"

                            style={{

                                background:
                                    "rgba(255,255,255,.06)",

                                border:
                                    "1px solid rgba(255,255,255,.08)",

                                color:
                                    theme.secondary

                            }}

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            disabled={loading}

                            className="rounded-2xl px-8 py-3 text-white transition"

                            style={{

                                background:
                                    theme.primary

                            }}

                        >

                            {

                                loading

                                    ?

                                    "Saving..."

                                    :

                                    "Save Changes"

                            }

                        </button>

                    </div>

                </form>

            </div>

                </div>

    );

};

export default EditProjectModal;
