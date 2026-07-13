import { useState, useEffect } from "react";
import { Sparkles, Loader2, X, Plus, Trash2 } from "lucide-react";
import { generateManagerProjectTasksAI, approveManagerProjectTasks } from "@/services/manager.service";

const AITaskPlanningModal = ({ projectId, teams = [], onClose, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    // Our interactive plan state
    const [plan, setPlan] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateManagerProjectTasksAI(projectId);
            const aiPlan = data.data;

            // Map AI plan to include projectTeamId based on recommendedTeam matching or default to first team
            if (aiPlan?.milestones) {
                aiPlan.milestones.forEach(m => {
                    if (m.tasks) {
                        m.tasks.forEach(t => {
                            const match = teams.find(team => team.team.name.toLowerCase() === t.recommendedTeam?.toLowerCase());
                            t.projectTeamId = match ? match.id : (teams.length > 0 ? teams[0].id : "");
                            if (!t.subtasks) t.subtasks = [];
                        });
                    }
                });
            }
            setPlan(aiPlan);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate plan");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!plan) return;
        
        // Ensure all tasks have a projectTeamId assigned
        const tasksToApprove = plan.milestones.flatMap(m => m.tasks);
        if (tasksToApprove.some(t => !t.projectTeamId)) {
            setError("All tasks must be assigned to a team before approval.");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await approveManagerProjectTasks(projectId, { tasks: tasksToApprove });
            onRefresh();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to approve plan");
        } finally {
            setSaving(false);
        }
    };

    // Helper functions to mutate plan state
    const updateTask = (mIndex, tIndex, field, value) => {
        const newPlan = { ...plan };
        newPlan.milestones[mIndex].tasks[tIndex][field] = value;
        setPlan(newPlan);
    };

    const deleteTask = (mIndex, tIndex) => {
        const newPlan = { ...plan };
        newPlan.milestones[mIndex].tasks.splice(tIndex, 1);
        setPlan(newPlan);
    };

    const addTask = (mIndex) => {
        const newPlan = { ...plan };
        newPlan.milestones[mIndex].tasks.push({
            title: "New Task",
            description: "",
            priority: "medium",
            projectTeamId: teams.length > 0 ? teams[0].id : "",
            subtasks: []
        });
        setPlan(newPlan);
    };

    const updateSubtask = (mIndex, tIndex, sIndex, field, value) => {
        const newPlan = { ...plan };
        newPlan.milestones[mIndex].tasks[tIndex].subtasks[sIndex][field] = value;
        setPlan(newPlan);
    };

    const deleteSubtask = (mIndex, tIndex, sIndex) => {
        const newPlan = { ...plan };
        newPlan.milestones[mIndex].tasks[tIndex].subtasks.splice(sIndex, 1);
        setPlan(newPlan);
    };

    const addSubtask = (mIndex, tIndex) => {
        const newPlan = { ...plan };
        newPlan.milestones[mIndex].tasks[tIndex].subtasks.push({
            title: "New Subtask",
            priority: "medium"
        });
        setPlan(newPlan);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-[#0A0A0A] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">AI Task Plan</h2>
                            <p className="text-sm text-zinc-400">Review, edit, and approve AI suggested tasks.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 hover:bg-white/5">
                        <X size={20} className="text-zinc-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-400">
                            {error}
                        </div>
                    )}

                    {!plan && !loading && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Sparkles size={48} className="mb-4 text-purple-500/50" />
                            <h3 className="mb-2 text-lg font-medium text-white">Ready to generate your plan?</h3>
                            <p className="mb-6 max-w-md text-zinc-400">
                                Our AI will analyze your project details and teams to suggest a structured set of milestones, tasks, and subtasks.
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 transition-colors"
                            >
                                <Sparkles size={18} />
                                Generate Plan
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 size={40} className="mb-4 animate-spin text-purple-500" />
                            <p className="text-zinc-400">Analyzing project and generating tasks...</p>
                        </div>
                    )}

                    {plan && !loading && (
                        <div className="space-y-8">
                            {plan.milestones?.map((milestone, i) => (
                                <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
                                    <h3 className="mb-4 text-lg font-semibold text-white">
                                        {milestone.title}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {milestone.tasks?.map((task, j) => (
                                            <div key={j} className="rounded-xl border border-zinc-800 bg-black/40 p-4 relative group">
                                                <button 
                                                    onClick={() => deleteTask(i, j)}
                                                    className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4 pr-8">
                                                    <div className="lg:col-span-2">
                                                        <label className="text-xs text-zinc-500 mb-1 block">Title</label>
                                                        <input 
                                                            value={task.title}
                                                            onChange={(e) => updateTask(i, j, "title", e.target.value)}
                                                            className="w-full bg-transparent border-b border-zinc-700 text-sm text-white focus:border-purple-500 outline-none pb-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-zinc-500 mb-1 block">Priority</label>
                                                        <select 
                                                            value={task.priority}
                                                            onChange={(e) => updateTask(i, j, "priority", e.target.value)}
                                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:border-purple-500 outline-none p-1.5"
                                                        >
                                                            <option value="low">Low</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="high">High</option>
                                                            <option value="urgent">Urgent</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-zinc-500 mb-1 block">Assigned Team</label>
                                                        <select 
                                                            value={task.projectTeamId}
                                                            onChange={(e) => updateTask(i, j, "projectTeamId", e.target.value)}
                                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:border-purple-500 outline-none p-1.5"
                                                        >
                                                            <option value="" disabled>Select Team</option>
                                                            {teams.map(t => (
                                                                <option key={t.id} value={t.id}>{t.team.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="text-xs text-zinc-500 mb-1 block">Description</label>
                                                    <input 
                                                        value={task.description}
                                                        onChange={(e) => updateTask(i, j, "description", e.target.value)}
                                                        className="w-full bg-transparent border-b border-zinc-700 text-sm text-zinc-300 focus:border-purple-500 outline-none pb-1"
                                                    />
                                                </div>

                                                <div className="bg-zinc-900/50 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-medium text-zinc-400">Subtasks</span>
                                                        <button 
                                                            onClick={() => addSubtask(i, j)}
                                                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                                        >
                                                            <Plus size={12} /> Add
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {task.subtasks?.map((subtask, k) => (
                                                            <div key={k} className="flex items-center gap-2">
                                                                <input 
                                                                    value={subtask.title}
                                                                    onChange={(e) => updateSubtask(i, j, k, "title", e.target.value)}
                                                                    className="flex-1 bg-transparent border-b border-zinc-800 text-xs text-zinc-300 focus:border-purple-500 outline-none pb-1"
                                                                />
                                                                <select 
                                                                    value={subtask.priority}
                                                                    onChange={(e) => updateSubtask(i, j, k, "priority", e.target.value)}
                                                                    className="bg-transparent text-xs text-zinc-400 outline-none w-20"
                                                                >
                                                                    <option value="low">Low</option>
                                                                    <option value="medium">Medium</option>
                                                                    <option value="high">High</option>
                                                                </select>
                                                                <button 
                                                                    onClick={() => deleteSubtask(i, j, k)}
                                                                    className="text-zinc-600 hover:text-red-400"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {(!task.subtasks || task.subtasks.length === 0) && (
                                                            <div className="text-xs text-zinc-600 italic">No subtasks</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button 
                                            onClick={() => addTask(i)}
                                            className="w-full rounded-xl border border-dashed border-zinc-700 bg-transparent py-3 text-sm text-zinc-400 hover:border-purple-500 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} /> Add Custom Task
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {plan && !loading && (
                    <div className="flex items-center justify-between border-t border-zinc-800 bg-[#0A0A0A] p-6">
                        <div className="text-sm text-zinc-400">
                            Please review all assignments and priorities carefully before approving.
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                disabled={saving}
                                className="rounded-xl px-6 py-2.5 font-medium text-zinc-400 hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Approving...
                                    </>
                                ) : (
                                    "Approve & Create Tasks"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AITaskPlanningModal;
