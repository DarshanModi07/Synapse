import { MoreVertical, CheckCircle2, Clock, Calendar, AlertCircle } from "lucide-react";
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

const TeamLeadSubtaskTable = ({ subtasks, onSubtaskClick }) => {
  return (
    <div className="overflow-x-auto scrollbar-synapse rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.05)", background: theme.card }}>
      <table className="w-full whitespace-nowrap text-left text-sm">
        <thead className="border-b bg-black/20 text-gray-400" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <tr>
            <th className="px-6 py-4 font-medium">Subtask</th>
            <th className="px-6 py-4 font-medium">Project / Task</th>
            <th className="px-6 py-4 font-medium">Priority</th>
            <th className="px-6 py-4 font-medium">Due Date</th>
            <th className="px-6 py-4 font-medium">Progress</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {subtasks.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No subtasks found.
              </td>
            </tr>
          ) : (
            subtasks.map((subtask) => {
              const status = getStatusConfig(subtask.status);
              const priority = getPriorityConfig(subtask.priority);
              
              const isOverdue = subtask.dueDate && new Date(subtask.dueDate) < new Date() && subtask.status !== "done";

              return (
                <tr 
                  key={subtask.id} 
                  className="transition-colors hover:bg-white/5 cursor-pointer"
                  onClick={() => onSubtaskClick(subtask)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{subtask.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{subtask.description || "No description"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300">{subtask.project?.name || "No Project"}</div>
                    <div className="text-xs text-gray-500">{subtask.task?.title || "No Task"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priority.bg} ${priority.color}`}>
                      {priority.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                      <Calendar size={14} />
                      <span>{subtask.dueDate ? new Date(subtask.dueDate).toLocaleDateString() : "No Date"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <div 
                          className="h-full rounded-full bg-purple-500 transition-all duration-500" 
                          style={{ width: `${subtask.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-400">{subtask.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamLeadSubtaskTable;
