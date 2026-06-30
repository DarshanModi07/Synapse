import { Trash2, X, Loader2 } from "lucide-react";
import { theme } from "@/lib/theme";

const DeleteDepartmentDialog = ({
  open,
  department,
  loading,
  onClose,
  onDelete,
}) => {
  if (!open || !department) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: "rgba(13,13,18,.96)",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,.45)",
        }}
      >
        {/* Header */}

        <div className="flex items-center justify-between">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(255,0,0,.08)",
            }}
          >
            <Trash2
              size={26}
              color="#FF6B6B"
            />
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

        {/* Title */}

        <h2
          className="mt-6 text-2xl font-bold"
          style={{
            color: theme.text,
          }}
        >
          Delete Department
        </h2>

        <p
          className="mt-4 leading-7"
          style={{
            color: theme.secondary,
          }}
        >
          Are you sure you want to delete{" "}
          <span
            style={{
              color: theme.text,
              fontWeight: 600,
            }}
          >
            {department.name}
          </span>
          ?
        </p>

        <p
          className="mt-2 text-sm"
          style={{
            color: "#FF8A8A",
          }}
        >
          This action cannot be undone.
        </p>

        {/* Actions */}

        <div className="mt-8 flex justify-end gap-4">
          <button
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
            disabled={loading}
            onClick={() =>
              onDelete(department.id)
            }
            className="flex items-center gap-2 rounded-2xl px-6 py-3 transition disabled:opacity-70"
            style={{
              background:
                "linear-gradient(135deg,#E53935,#C62828)",
              color: "#fff",
            }}
          >
            {loading && (
              <Loader2
                size={18}
                className="animate-spin"
              />
            )}

            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDepartmentDialog;