import { useState } from "react";
import { X } from "lucide-react";
import { theme } from "@/lib/theme";

const CreateTaskModal = ({
    open,
    loading,
    teams,
    onClose,
    onCreate
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [selectedTeamId, setSelectedTeamId] = useState("");

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) return;
        if (teams && !selectedTeamId) return;

        try {
            await onCreate({
                title: title.trim(),
                description,
                priority,
                dueDate,
                ...(teams && { projectTeamId: selectedTeamId })
            });

            setTitle("");
            setDescription("");
            setPriority("medium");
            setDueDate("");
            setSelectedTeamId("");
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div
                className="w-full max-w-2xl rounded-3xl p-8"
                style={{
                    background: theme.card,
                    border: "1px solid rgba(255,255,255,.08)"
                }}
            >
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold" style={{ color: theme.text }}>
                            Create Task
                        </h2>
                        <p className="mt-1" style={{ color: theme.secondary }}>
                            Create a new task.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 hover:bg-white/5"
                    >
                        <X color={theme.secondary} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="mb-2 block text-sm" style={{ color: theme.secondary }}>
                            Title
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm" style={{ color: theme.secondary }}>
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Priority */}
                        <div>
                            <label className="mb-2 block text-sm" style={{ color: theme.secondary }}>
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        {/* Team Selection */}
                        {teams && teams.length > 0 && (
                            <div>
                                <label className="mb-2 block text-sm" style={{ color: theme.secondary }}>
                                    Assign to Team
                                </label>
                                <select
                                    value={selectedTeamId}
                                    onChange={(e) => setSelectedTeamId(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
                                >
                                    <option value="" disabled>Select a team</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>
                                            {team.team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Due Date */}
                        <div>
                            <label className="mb-2 block text-sm" style={{ color: theme.secondary }}>
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
                                style={{ colorScheme: "dark" }}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl px-6 py-3 font-medium hover:bg-white/5"
                            style={{ color: theme.secondary }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
