import React from "react";
import { Calendar, SquarePen, Trash2, Clock, Users, MapPin, ListTodo } from "lucide-react";

const priorityColor = {
    low: "text-green-400 bg-green-500/10 border-green-500/20",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    urgent: "text-red-400 bg-red-500/10 border-red-500/20"
};

const statusColor = {
    todo: "bg-zinc-800 text-zinc-300",
    in_progress: "bg-blue-500/20 text-blue-400",
    in_review: "bg-amber-500/20 text-amber-400",
    done: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400"
};

const TaskCard = ({ task, onEdit, onDelete }) => {
    // 1. Parse raw AI text safely
    let rawDescription = task.description || "";
    let estimatedHours = null;
    let milestoneTitle = null;

    // Check for "Milestone: XXX"
    const milestoneMatch = rawDescription.match(/Milestone:\s*(.+)/i);
    if (milestoneMatch) {
        milestoneTitle = milestoneMatch[1].trim();
        rawDescription = rawDescription.replace(milestoneMatch[0], "");
    }

    // Check for "Estimated Hours"
    const hoursMatch = rawDescription.match(/\*\*Estimated Hours\*\*.*?(?:([\d.]+)\s*hrs?|:\s*([\d.]+))/i);
    if (hoursMatch) {
        estimatedHours = hoursMatch[1] || hoursMatch[2];
        rawDescription = rawDescription.replace(hoursMatch[0], "");
    }

    // Check for "Assignment Reason"
    const reasonMatch = rawDescription.match(/\*\*Assignment Reason\*\*.*?(?:\n|$)/i);
    if (reasonMatch) {
        rawDescription = rawDescription.replace(reasonMatch[0], "");
    }

    // Clean up description
    const cleanDescription = rawDescription.trim() || "No description provided.";

    // 2. Extract Subtask data
    const subtasks = task.subtasks || [];
    const hasSubtasks = subtasks.length > 0;
    const completedSubtasks = subtasks.filter(st => st.status === "done").length;
    const progressPercent = hasSubtasks ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;
    
    // Create an ASCII-like progress bar
    const filledBars = Math.round(progressPercent / 10);
    const emptyBars = 10 - filledBars;
    const asciiProgress = "█".repeat(filledBars) + "░".repeat(emptyBars);

    return (
        <div 
            className="group flex flex-col h-[380px] rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
                background: "rgba(18, 18, 23, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.4)"
            }}
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 border border-transparent group-hover:border-purple-500/40 rounded-2xl transition-all duration-500 pointer-events-none" />
            
            {/* 1. Header (Title & Priority) */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-[22px] font-bold text-zinc-100 leading-tight line-clamp-2 flex-1">
                    {task.title}
                </h3>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${priorityColor[task.priority] || priorityColor.medium}`}>
                    {task.priority || "Medium"}
                </span>
            </div>

            {/* 2. Second Row (Milestone Pill & Status) */}
            <div className="flex items-center gap-2 mb-4 overflow-hidden">
                {milestoneTitle && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20 truncate max-w-[65%]">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{milestoneTitle}</span>
                    </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[task.status] || statusColor.todo}`}>
                    {task.status ? task.status.replace("_", " ") : "Todo"}
                </span>
            </div>

            {/* 3. Description (3 lines max) */}
            <p className="text-[14px] text-zinc-400 line-clamp-3 mb-5 leading-relaxed">
                {cleanDescription}
            </p>

            {/* 4. Metadata Details (Fixed height section to push footer down) */}
            <div className="flex-1 space-y-2.5">
                {/* Due Date */}
                {task.dueDate && (
                    <div className="flex items-center gap-2.5 text-[13px] text-zinc-500">
                        <Calendar size={14} className="text-zinc-600" />
                        <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                )}
                
                {/* Team / Department */}
                {task.projectTeam?.team?.name && (
                    <div className="flex items-center gap-2.5 text-[13px] text-zinc-500">
                        <Users size={14} className="text-zinc-600" />
                        <span className="truncate">{task.projectTeam.team.name}</span>
                    </div>
                )}

                {/* Estimated Hours */}
                {estimatedHours && (
                    <div className="flex items-center gap-2.5 text-[13px] text-zinc-500">
                        <Clock size={14} className="text-zinc-600" />
                        <span>{estimatedHours} Hours</span>
                    </div>
                )}
                
                {/* Subtask Count */}
                <div className="flex items-center gap-2.5 text-[13px] text-zinc-500">
                    <ListTodo size={14} className="text-zinc-600" />
                    <span>{hasSubtasks ? `✓ ${subtasks.length} Subtasks` : 'No Subtasks'}</span>
                </div>

                {/* Progress Bar (Only if subtasks exist) */}
                {hasSubtasks && (
                    <div className="pt-2">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mb-1">
                            <span className="tracking-widest text-purple-400/80">{asciiProgress}</span>
                            <span className="text-zinc-300 font-bold">{progressPercent}%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 5. Footer (Fixed at bottom) */}
            <div className="pt-4 mt-auto border-t border-zinc-800/50 flex gap-2">
                <button
                    onClick={() => onEdit(task)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800/40 hover:bg-zinc-700/60 text-zinc-300 text-sm font-medium transition-colors border border-transparent hover:border-zinc-600"
                >
                    <SquarePen size={14} /> Edit
                </button>
                <button
                    onClick={() => onDelete(task)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/15 text-red-400 text-sm font-medium transition-colors border border-transparent hover:border-red-500/20"
                >
                    <Trash2 size={14} /> Delete
                </button>
            </div>
        </div>
    );
};

export default TaskCard;