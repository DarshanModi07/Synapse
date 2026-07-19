import { useState } from "react";
import { Sparkles, Loader2, X, Plus, Trash2, Users, User, Activity } from "lucide-react";
import { generateManagerProjectTasksAI, approveManagerProjectTasks, getManagerTeamMembers } from "@/services/manager.service";

const AITaskPlanningModal = ({ projectId, project, teams = [], onClose, onRefresh }) => {
    const [step, setStep] = useState(1);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    // Our interactive plan state
    const [plan, setPlan] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    
    // Cache for team members fetched dynamically
    const [teamMembersByTeamId, setTeamMembersByTeamId] = useState({});

    const fetchTeamMembers = async (pTeamId) => {
        if (!pTeamId) return;
        setTeamMembersByTeamId(prev => {
            if (prev[pTeamId]) return prev;
            
            // Trigger fetch asynchronously
            getManagerTeamMembers(pTeamId).then(members => {
                setTeamMembersByTeamId(current => ({ ...current, [pTeamId]: members }));
            }).catch(err => {
                console.error("Failed to fetch team members for dropdown", err);
            });
            
            // Return optimistic empty array while fetching to prevent redundant calls
            return { ...prev, [pTeamId]: [] };
        });
    };

    const handleSelectTeam = (teamId) => {
        setSelectedTeamId(teamId);
        setStep(2);
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateManagerProjectTasksAI(projectId, { teamId: selectedTeamId });
            const aiPlan = data.data;

            let normalizedPlan = aiPlan;
            if (!normalizedPlan || typeof normalizedPlan !== 'object') {
                normalizedPlan = { milestones: [] };
            }

            if (!Array.isArray(normalizedPlan.milestones)) {
                if (normalizedPlan.milestones && typeof normalizedPlan.milestones === 'object') {
                    normalizedPlan.milestones = Object.values(normalizedPlan.milestones);
                } else {
                    normalizedPlan.milestones = [];
                }
            }

            normalizedPlan.milestones.forEach(m => {
                if (!m.id) m.id = crypto.randomUUID();
                if (!m.title) m.title = "Unnamed Milestone";
                
                if (!Array.isArray(m.tasks)) {
                    if (m.tasks && typeof m.tasks === 'object') {
                        m.tasks = Object.values(m.tasks);
                    } else {
                        m.tasks = [];
                    }
                }
                
                m.tasks.forEach(t => {
                    if (!t.id) t.id = crypto.randomUUID();
                    if (!t.title) t.title = "Unnamed Task";
                    if (!t.projectTeamId) t.projectTeamId = selectedTeamId;
                    
                    if (!Array.isArray(t.subtasks)) {
                        if (t.subtasks && typeof t.subtasks === 'object') {
                            t.subtasks = Object.values(t.subtasks);
                        } else {
                            t.subtasks = [];
                        }
                    }
                    
                    t.subtasks.forEach(st => {
                        if (!st.id) st.id = crypto.randomUUID();
                        if (!st.title) st.title = "Unnamed Subtask";
                        if (!st.assignedEmployeeId) st.assignedEmployeeId = "";
                    });
                });
            });

            setPlan(normalizedPlan);
            setStep(3);
            
            // Pre-fetch members for the initially assigned team
            if (selectedTeamId) {
                fetchTeamMembers(selectedTeamId);
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to generate plan");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setValidationErrors({});
        const errors = {};
        const tasksToApprove = plan.milestones.flatMap((m, mIndex) => {
            return m.tasks.map((t, tIndex) => {
                // Validation for Bug 4
                if (t.subtasks) {
                    t.subtasks.forEach((st, sIndex) => {
                        if (!st.assignedEmployeeId) {
                            errors[`${mIndex}-${tIndex}-${sIndex}`] = "Employee must be assigned.";
                        } else {
                            const availableMembers = teamMembersByTeamId[t.projectTeamId] || [];
                            if (!availableMembers.some(member => member.id === st.assignedEmployeeId)) {
                                errors[`${mIndex}-${tIndex}-${sIndex}`] = "Employee is not a member of the selected team.";
                            }
                        }
                    });
                }
                return {
                    title: t.title,
                    assignedTeamId: t.projectTeamId,
                    milestoneTitle: m.title,
                    description: t.description,
                    priority: t.priority,
                    estimatedHours: t.estimatedHours,
                    subtasks: t.subtasks?.map(st => ({
                        title: st.title,
                        assignedEmployeeId: st.assignedEmployeeId,
                        priority: st.priority,
                        estimatedHours: st.estimatedHours
                    })) || []
                };
            });
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setError("Please fix the assignment errors highlighted below.");
            return;
        }

        if (tasksToApprove.some(t => !t.assignedTeamId)) {
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
            setError(err?.response?.data?.message || "Failed to approve plan");
        } finally {
            setSaving(false);
        }
    };

    // --- State Mutations ---
    const addMilestone = () => {
        const newPlan = { ...plan };
        newPlan.milestones.push({
            id: crypto.randomUUID(),
            title: "New Milestone",
            tasks: []
        });
        setPlan(newPlan);
    };

    const updateMilestone = (mIndex, value) => {
        const newPlan = { ...plan };
        newPlan.milestones[mIndex].title = value;
        setPlan(newPlan);
    };

    const deleteMilestone = (mIndex) => {
        const newPlan = { ...plan };
        newPlan.milestones.splice(mIndex, 1);
        setPlan(newPlan);
    };

    const updateTask = (mIndex, tIndex, field, value) => {
        const newPlan = { ...plan };
        newPlan.milestones[mIndex].tasks[tIndex][field] = value;
        // Bug 2: Clear employee selection on team change
        if (field === "projectTeamId") {
            const t = newPlan.milestones[mIndex].tasks[tIndex];
            if (t.subtasks) {
                t.subtasks.forEach(st => st.assignedEmployeeId = "");
            }
            fetchTeamMembers(value);
        }
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
            id: crypto.randomUUID(),
            title: "New Task",
            description: "",
            estimatedHours: 0,
            priority: "medium",
            reasonForAssignment: "",
            projectTeamId: selectedTeamId,
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
            id: crypto.randomUUID(),
            title: "New Subtask",
            priority: "medium",
            estimatedHours: 0,
            assignedEmployeeId: ""
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
                            <h2 className="text-xl font-semibold text-white">AI Task Planner</h2>
                            <p className="text-sm text-zinc-400">
                                {step === 1 && "Select a team to generate context-aware tasks."}
                                {step === 2 && "Ready to generate your plan."}
                                {step === 3 && "Review, edit, and approve AI suggested tasks."}
                            </p>
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

                    {/* Step 1: Select Team */}
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Project Information */}
                            {project && (
                                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 mb-8">
                                    <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                                    {project.description && <p className="text-sm text-zinc-400 mb-4">{project.description}</p>}
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 rounded-lg text-zinc-300">
                                            Priority: <span className="capitalize text-white">{project.priority}</span>
                                        </span>
                                        {project.dueDate && (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 rounded-lg text-zinc-300">
                                                Deadline: <span className="text-white">{new Date(project.dueDate).toLocaleDateString()}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <h3 className="text-lg font-medium text-white px-1">Select Team to Generate Plan For</h3>
                            {teams.length === 0 ? (
                                <div className="text-center text-zinc-500 py-12">No teams assigned to this project yet. Please assign a team first.</div>
                            ) : (
                                <div className="grid gap-5 md:grid-cols-2">
                                    {teams.map(t => {
                                        const membersCount = t.members || 0;
                                        const activeTasks = t.tasks || 0;
                                        
                                        return (
                                            <div 
                                                key={t.projectTeamId}
                                                onClick={() => handleSelectTeam(t.projectTeamId)}
                                                className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-purple-500/50 hover:bg-zinc-900 transition"
                                            >
                                                <h3 className="text-lg font-semibold text-white mb-1">{t.name || "Unnamed Team"}</h3>
                                                <p className="text-sm text-zinc-400 mb-4">{t.department?.name}</p>
                                                
                                                <div className="flex flex-col gap-2 text-sm text-zinc-400">
                                                    <div className="flex items-center gap-2"><User size={14}/> <span>Lead: {t.leader?.name || "Unassigned"}</span></div>
                                                    <div className="flex items-center gap-2"><Users size={14}/> <span>{membersCount} Members</span></div>
                                                    <div className="flex items-center gap-2"><Activity size={14}/> <span>Current Workload: {activeTasks} Total Tasks</span></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Generate */}
                    {step === 2 && !loading && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Sparkles size={48} className="mb-4 text-purple-500/50" />
                            <h3 className="mb-2 text-lg font-medium text-white">Generate Plan for Team</h3>
                            <p className="mb-6 max-w-md text-zinc-400">
                                Our AI will analyze the project context and this team's current workload to suggest an optimal, structured set of milestones, tasks, and subtasks.
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

                    {/* Loading State */}
                    {step === 2 && loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 size={40} className="mb-4 animate-spin text-purple-500" />
                            <p className="text-zinc-400">Analyzing project and generating tasks...</p>
                        </div>
                    )}

                    {/* Step 3: Review Plan */}
                    {step === 3 && plan && (
                        <div className="space-y-8">
                            {plan.milestones?.map((milestone, i) => (
                                <div key={milestone.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 relative group/milestone">
                                    <button 
                                        onClick={() => deleteMilestone(i)}
                                        className="absolute top-5 right-5 text-zinc-500 hover:text-red-400 opacity-0 group-hover/milestone:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="mb-6 pr-8">
                                        <input 
                                            value={milestone.title}
                                            onChange={(e) => updateMilestone(i, e.target.value)}
                                            className="w-full bg-transparent text-xl font-semibold text-white outline-none border-b border-transparent focus:border-purple-500 pb-1"
                                            placeholder="Milestone Title"
                                        />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {milestone.tasks?.map((task, j) => (
                                            <div key={task.id} className="rounded-xl border border-zinc-800 bg-black/40 p-4 relative group/task">
                                                <button 
                                                    onClick={() => deleteTask(i, j)}
                                                    className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 opacity-0 group-hover/task:opacity-100 transition-opacity"
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
                                                            value={task.projectTeamId || ""}
                                                            onChange={(e) => updateTask(i, j, "projectTeamId", e.target.value)}
                                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:border-purple-500 outline-none p-1.5"
                                                        >
                                                            <option value="" disabled>Select Team</option>
                                                            {teams.map(t => (
                                                                <option key={t.projectTeamId} value={t.projectTeamId}>{t.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-4">
                                                    <div className="md:col-span-1">
                                                        <label className="text-xs text-zinc-500 mb-1 block">Est. Hours</label>
                                                        <input 
                                                            type="number"
                                                            value={task.estimatedHours || ""}
                                                            onChange={(e) => updateTask(i, j, "estimatedHours", parseFloat(e.target.value) || 0)}
                                                            className="w-full bg-transparent border-b border-zinc-700 text-sm text-zinc-300 focus:border-purple-500 outline-none pb-1"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <label className="text-xs text-zinc-500 mb-1 block">Reason for Assignment</label>
                                                        <input 
                                                            value={task.reasonForAssignment || ""}
                                                            onChange={(e) => updateTask(i, j, "reasonForAssignment", e.target.value)}
                                                            className="w-full bg-transparent border-b border-zinc-700 text-sm text-zinc-400 focus:border-purple-500 outline-none pb-1"
                                                            placeholder="Why this team?"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="text-xs text-zinc-500 mb-1 block">Description</label>
                                                    <input 
                                                        value={task.description || ""}
                                                        onChange={(e) => updateTask(i, j, "description", e.target.value)}
                                                        className="w-full bg-transparent border-b border-zinc-700 text-sm text-zinc-300 focus:border-purple-500 outline-none pb-1"
                                                        placeholder="Detailed description..."
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
                                                        {task.subtasks?.map((subtask, k) => {
                                                            const errorKey = `${i}-${j}-${k}`;
                                                            const hasError = validationErrors[errorKey];
                                                            return (
                                                                <div key={subtask.id} className="flex flex-col gap-1">
                                                                    <div className={`flex items-center gap-2 rounded px-2 py-1 ${hasError ? 'border border-red-500/50 bg-red-500/5' : ''}`}>
                                                                <input 
                                                                    value={subtask.title}
                                                                    onChange={(e) => updateSubtask(i, j, k, "title", e.target.value)}
                                                                    className="flex-1 bg-transparent border-b border-zinc-800 text-xs text-zinc-300 focus:border-purple-500 outline-none pb-1"
                                                                />
                                                                <input 
                                                                    type="number"
                                                                    value={subtask.estimatedHours || ""}
                                                                    onChange={(e) => updateSubtask(i, j, k, "estimatedHours", parseFloat(e.target.value) || 0)}
                                                                    className="w-16 bg-transparent border-b border-zinc-800 text-xs text-zinc-300 focus:border-purple-500 outline-none pb-1 text-center"
                                                                    placeholder="Hrs"
                                                                    title="Estimated Hours"
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
                                                                    <select 
                                                                        value={subtask.assignedEmployeeId || ""}
                                                                        onChange={(e) => updateSubtask(i, j, k, "assignedEmployeeId", e.target.value)}
                                                                        className={`bg-transparent text-xs outline-none w-28 truncate ${hasError ? 'text-red-400' : 'text-zinc-400'}`}
                                                                    >
                                                                        <option value="">Unassigned</option>
                                                                        {teamMembersByTeamId[task.projectTeamId] && teamMembersByTeamId[task.projectTeamId].map(member => (
                                                                        <option key={member.id} value={member.id}>
                                                                            {member.name} {member.isLeader ? "(Leader)" : `(${member.work_role})`}
                                                                        </option>
                                                                        ))}
                                                                    </select>
                                                                    <button 
                                                                        onClick={() => deleteSubtask(i, j, k)}
                                                                        className="text-zinc-600 hover:text-red-400"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                                {hasError && <span className="text-[10px] text-red-500 italic ml-2">{hasError}</span>}
                                                            </div>
                                                        );
                                                        })}
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
                                            <Plus size={16} /> Add Task
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={addMilestone}
                                className="w-full rounded-2xl border-2 border-dashed border-zinc-800 bg-transparent py-4 text-sm font-medium text-zinc-400 hover:border-purple-500/50 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add New Milestone
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 3 && plan && (
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
                                    "Approve & Assign Tasks"
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
