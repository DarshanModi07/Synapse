import { useEffect, useState } from "react";
import { X, Building2, Loader2 } from "lucide-react";

import { theme } from "@/lib/theme";

const CreateDepartmentModal = ({
  open,
  onClose,
  onCreate,
  loading,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    onCreate(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-3xl p-8"
        style={{
          background: "rgba(13,13,18,.95)",
          border: "1px solid rgba(167,139,250,.10)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,.45),0 0 40px rgba(124,58,237,.08)",
        }}
      >
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{
                color: theme.text,
              }}
            >
              Create Department
            </h2>

            <p
              className="mt-2"
              style={{
                color: theme.secondary,
              }}
            >
              Add a new department to your workspace.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-white/5"
          >
            <X
              size={20}
              color={theme.secondary}
            />
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <label
            className="mb-3 block text-sm font-medium"
            style={{
              color: theme.secondary,
            }}
          >
            Department Name
          </label>

          <div className="relative">
            <Building2
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              color={theme.secondary}
            />

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Engineering"
              className="h-14 w-full rounded-2xl border pl-12 pr-4 outline-none transition-all duration-300 focus:ring-2"
              style={{
                background: "rgba(255,255,255,.03)",
                borderColor: "rgba(255,255,255,.08)",
                color: theme.text,
              }}
            />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-6 py-3 transition"
              style={{
                background: "rgba(255,255,255,.05)",
                color: theme.secondary,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 rounded-2xl px-6 py-3 font-medium transition hover:scale-[1.02] disabled:opacity-70"
              style={{
                background:
                  "linear-gradient(135deg,#7C3AED,#A78BFA)",
                color: "#fff",
              }}
            >
              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              Create Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartmentModal;