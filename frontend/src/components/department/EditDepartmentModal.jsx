import { useEffect, useState } from "react";
import { X, Building2, Loader2 } from "lucide-react";
import { theme } from "@/lib/theme";

const EditDepartmentModal = ({
  open,
  department,
  loading,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (department) {
      setName(department.name);
    }
  }, [department]);

  if (!open || !department) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    onSave(department.id, {
      name: name.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-3xl p-8"
        style={{
          background: "rgba(13,13,18,.96)",
          border: "1px solid rgba(167,139,250,.10)",
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
              Edit Department
            </h2>

            <p
              className="mt-2"
              style={{
                color: theme.secondary,
              }}
            >
              Update department information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-white/5"
          >
            <X
              size={20}
              color={theme.secondary}
            />
          </button>
        </div>

        {/* Form */}

        <form
          className="mt-8"
          onSubmit={handleSubmit}
        >
          <label
            className="mb-3 block"
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
              className="h-14 w-full rounded-2xl border pl-12 pr-4 outline-none"
              style={{
                background:
                  "rgba(255,255,255,.03)",
                borderColor:
                  "rgba(255,255,255,.08)",
                color: theme.text,
              }}
            />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-6 py-3"
              style={{
                background:
                  "rgba(255,255,255,.05)",
                color: theme.secondary,
              }}
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl px-6 py-3"
              style={{
                background:
                  "linear-gradient(135deg,#7C3AED,#A78BFA)",
                color: "#fff",
              }}
            >
              {loading && (
                <Loader2
                  className="animate-spin"
                  size={18}
                />
              )}

              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartmentModal;