import { Search, Sparkles, Plus } from "lucide-react";
import { theme } from "@/lib/theme";

const DepartmentToolbar = ({
  search,
  setSearch,
  onAISuggest,
  onCreateDepartment,
}) => {
  return (
    <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}

      <div className="relative w-full max-w-lg">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          color={theme.secondary}
        />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search departments..."
          className="h-14 w-full rounded-2xl border pl-12 pr-4 outline-none transition-all duration-300 focus:ring-2"
          style={{
            background: "rgba(255,255,255,.03)",
            borderColor: "rgba(255,255,255,.08)",
            color: theme.text,
          }}
        />
      </div>

      {/* Buttons */}

      <div className="flex items-center gap-4">
        {/* AI Suggest */}

        <button
          onClick={onAISuggest}
          className="flex h-14 items-center gap-3 rounded-2xl px-6 font-medium transition-all duration-300 hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(135deg,#7C3AED,#A78BFA)",
            color: "#fff",
            boxShadow:
              "0 10px 28px rgba(124,58,237,.30)",
          }}
        >
          <Sparkles size={18} />

          AI Suggest
        </button>

        {/* Create */}

        <button
          onClick={onCreateDepartment}
          className="flex h-14 items-center gap-3 rounded-2xl px-6 font-medium transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.08)",
            color: theme.text,
          }}
        >
          <Plus size={18} />

          Create Department
        </button>
      </div>
    </div>
  );
};

export default DepartmentToolbar;