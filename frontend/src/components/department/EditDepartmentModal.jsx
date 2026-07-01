import { useEffect, useState } from "react";
import {
  X,
  Building2,
  Loader2,
  UserCog,
} from "lucide-react";

import { theme } from "@/lib/theme";
import { useAvailableManagers } from "@/hooks/useAvailableManagers";

const EditDepartmentModal = ({
  open,
  department,
  loading,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");

  const [managerId, setManagerId] =
    useState("");

  const {
    managers,
    loading: managersLoading,
  } = useAvailableManagers(
    department?.id,
    open
  );

  useEffect(() => {
    if (department) {
      setName(department.name);
    }
  }, [department]);

  useEffect(() => {
    if (!managers.length) return;

    const currentManager =
      managers.find(
        (manager) => manager.selected
      );

    if (currentManager) {
      setManagerId(currentManager.id);
    } else {
      setManagerId("");
    }
  }, [managers]);

  if (!open || !department) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    onSave(department.id, {
      name: name.trim(),
      managerId:
        managerId || null,
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div
        className="w-full max-w-lg rounded-3xl p-8"
        style={{
          background:
            "rgba(13,13,18,.96)",
          border:
            "1px solid rgba(167,139,250,.10)",
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
              Update department
              information and assign
              a manager.
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
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* Department Name */}

          <div>

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
                  setName(
                    e.target.value
                  )
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

          </div>

          {/* Manager */}

          <div>

            <label
              className="mb-3 block"
              style={{
                color: theme.secondary,
              }}
            >
              Department Manager
            </label>

            <div className="relative">

              <UserCog
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                color={theme.secondary}
              />

              <select
                value={managerId}
                onChange={(e) =>
                  setManagerId(
                    e.target.value
                  )
                }
                disabled={
                  managersLoading
                }
                className="h-14 w-full appearance-none rounded-2xl border pl-12 pr-4 outline-none"
                style={{
                    background: "rgba(255,255,255,.03)",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,.08)",
                }}
              >
                <option value="">
                  Select Manager
                </option>

                {managers.map(
                  (manager) => (
                    <option
                      key={manager.id}
                      value={
                        manager.id
                      }
                    >
                      {manager.name}
                      {" • "}
                      {
                        manager.currentRole
                      }
                    </option>
                  )
                )}
              </select>

            </div>

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-6 py-3"
              style={{
                background:
                  "rgba(255,255,255,.05)",
                color:
                  theme.secondary,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading
              }
              className="flex items-center gap-2 rounded-2xl px-6 py-3"
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

              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditDepartmentModal;