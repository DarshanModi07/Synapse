import { Search } from "lucide-react";
import { theme } from "@/lib/theme";

const TeamLeadSubtaskFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
}) => {
  const statuses = [
    { value: "all", label: "All" },
    { value: "todo", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "in_review", label: "Under Review" },
    { value: "done", label: "Completed" },
    { value: "overdue", label: "Overdue" },
  ];

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search subtasks, tasks, or projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl bg-black/40 py-3 pl-12 pr-4 outline-none transition-all focus:ring-2 focus:ring-purple-500/50"
          style={{
            color: theme.text,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setStatusFilter(status.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              statusFilter === status.value
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                : "bg-black/40 text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            style={{
              border: statusFilter === status.value 
                ? "1px solid transparent" 
                : "1px solid rgba(255,255,255,0.1)"
            }}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamLeadSubtaskFilters;
