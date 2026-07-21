import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { theme } from "@/lib/theme";

const getStatusConfig = (status) => {
  switch (status) {
    case "done":
      return { color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Completed" };
    case "in_progress":
      return { color: "text-amber-400", bg: "bg-amber-400/10", label: "In Progress" };
    case "in_review":
      return { color: "text-purple-400", bg: "bg-purple-400/10", label: "Under Review" };
    case "todo":
    default:
      return { color: "text-gray-400", bg: "bg-gray-400/10", label: "Pending" };
  }
};

const getPriorityConfig = (priority) => {
  switch (priority) {
    case "urgent":
      return { color: "text-red-400", bg: "bg-red-400/10", label: "Urgent" };
    case "high":
      return { color: "text-orange-400", bg: "bg-orange-400/10", label: "High" };
    case "medium":
      return { color: "text-blue-400", bg: "bg-blue-400/10", label: "Medium" };
    case "low":
    default:
      return { color: "text-gray-400", bg: "bg-gray-400/10", label: "Low" };
  }
};

const TeamLeadSubtaskCard = ({ subtask, onClick }) => {
  const status = getStatusConfig(subtask.status);
  const priority = getPriorityConfig(subtask.priority);
  const isOverdue = subtask.dueDate && new Date(subtask.dueDate) < new Date() && subtask.status !== "done";

  return (
    <div 
      className="flex flex-col justify-between rounded-2xl border p-5 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
      style={{ background: theme.card, borderColor: "rgba(255,255,255,0.05)" }}
      onClick={() => onClick(subtask)}
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-4">
          <h4 className="font-semibold text-white line-clamp-2">{subtask.title}</h4>
          <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>
        
        <p className="mb-4 text-sm text-gray-500 line-clamp-2">{subtask.description || "No description"}</p>
        
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span>Project:</span>
            <span className="font-medium text-gray-300 truncate max-w-[150px]">{subtask.project?.name || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Task:</span>
            <span className="font-medium text-gray-300 truncate max-w-[150px]">{subtask.task?.title || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-gray-400">Progress</span>
            <span className="font-medium text-white">{subtask.progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div 
              className="h-full rounded-full bg-purple-500 transition-all duration-500" 
              style={{ width: `${subtask.progress}%` }} 
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priority.bg} ${priority.color}`}>
            {priority.label}
          </span>
          <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
            <Calendar size={14} />
            <span>{subtask.dueDate ? new Date(subtask.dueDate).toLocaleDateString() : "No Date"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLeadSubtaskCard;
