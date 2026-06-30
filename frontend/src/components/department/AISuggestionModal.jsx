import { useEffect, useState } from "react";

import {
  Sparkles,
  Plus,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

import { theme } from "@/lib/theme";

const AISuggestionModal = ({
  open,
  loading,
  suggestions,
  onClose,
  onGenerate,
  onCreate,
}) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (open) {
      setDepartments(
        suggestions.map((item) => ({
          ...item,
          selected: true,
        }))
      );
    }
  }, [suggestions, open]);

  if (!open) return null;

  const updateName = (index, value) => {
    const copy = [...departments];

    copy[index].name = value;

    setDepartments(copy);
  };

  const toggleDepartment = (index) => {
    const copy = [...departments];

    copy[index].selected =
      !copy[index].selected;

    setDepartments(copy);
  };

  const removeDepartment = (index) => {
    setDepartments(
      departments.filter(
        (_, i) => i !== index
      )
    );
  };

  const addDepartment = () => {
    setDepartments([
      ...departments,
      {
        name: "",
        description: "",
        selected: true,
      },
    ]);
  };

  const selectedDepartments =
    departments.filter(
      (item) =>
        item.selected &&
        item.name.trim()
    );

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-3xl"
        style={{
          background: "rgba(13,13,18,.97)",
          border:
            "1px solid rgba(167,139,250,.10)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,.45)",
        }}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/5 p-7">
          <div>
            <h2
              className="flex items-center gap-3 text-2xl font-bold"
              style={{
                color: theme.text,
              }}
            >
              <Sparkles
                color={theme.primary}
                size={22}
              />

              AI Department Suggestions
            </h2>

            <p
              className="mt-2"
              style={{
                color: theme.secondary,
              }}
            >
              Review, edit and create AI generated
              departments.
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

        {/* Content */}

        <div className="flex-1 overflow-y-auto p-7 space-y-4">
          {departments.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border p-5"
              style={{
                borderColor:
                  "rgba(255,255,255,.08)",
                background:
                  "rgba(255,255,255,.02)",
              }}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() =>
                    toggleDepartment(index)
                  }
                  className="mt-3 h-5 w-5"
                />

                <div className="flex-1">
                  <input
                    value={item.name}
                    onChange={(e) =>
                      updateName(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="Department Name"
                    className="w-full rounded-xl border px-4 py-3 outline-none"
                    style={{
                      background:
                        "rgba(255,255,255,.03)",
                      borderColor:
                        "rgba(255,255,255,.06)",
                      color: theme.text,
                    }}
                  />

                  <textarea
                    value={item.description}
                    readOnly
                    rows={2}
                    className="mt-3 w-full resize-none rounded-xl border px-4 py-3"
                    style={{
                      background:
                        "rgba(255,255,255,.02)",
                      borderColor:
                        "rgba(255,255,255,.06)",
                      color: theme.secondary,
                    }}
                  />
                </div>

                <button
                  onClick={() =>
                    removeDepartment(index)
                  }
                  className="rounded-xl p-2 hover:bg-red-500/10"
                >
                  <Trash2
                    size={18}
                    color="#ff6b6b"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t border-white/5 p-7">
          <button
            onClick={addDepartment}
            className="flex items-center gap-2 rounded-2xl px-5 py-3"
            style={{
              background:
                "rgba(255,255,255,.05)",
              color: theme.text,
            }}
          >
            <Plus size={18} />

            Add Department
          </button>

          <div className="flex gap-4">
            <button
              onClick={onGenerate}
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl px-6 py-3"
              style={{
                background:
                  "rgba(124,58,237,.12)",
                color: theme.primaryLight,
              }}
            >
              {loading && (
                <Loader2
                  className="animate-spin"
                  size={18}
                />
              )}

              Generate Again
            </button>

            <button
              onClick={() =>
                onCreate(selectedDepartments)
              }
              className="rounded-2xl px-7 py-3 font-semibold"
              style={{
                background:
                  "linear-gradient(135deg,#7C3AED,#A78BFA)",
                color: "#fff",
              }}
            >
              Create (
              {selectedDepartments.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionModal;