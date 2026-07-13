import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { theme } from "@/lib/theme";
import { getDepartments } from "@/services/department.service";
import { getAvailableLeaders } from "@/services/team.service";
import { getManagerDepartments, getManagerAvailableLeaders } from "@/services/manager.service";

const CreateTeamModal = ({
  open,
  onClose,
  onCreate,
  loading,
  workspaceId,
  managerMode,
}) => {

  const [departments, setDepartments] =
    useState([]);

  const [leaders, setLeaders] =
    useState([]);

  const [departmentId, setDepartmentId] =
    useState("");

  const [leaderId, setLeaderId] =
    useState("");

  const [name, setName] =
    useState("");

  const [fetchingDepartments, setFetchingDepartments] =
    useState(false);

  const [fetchingLeaders, setFetchingLeaders] =
    useState(false);

  useEffect(() => {

    if (!open || !workspaceId) return;

    fetchDepartments();

  }, [open, workspaceId]);

  useEffect(() => {

    if (!departmentId) {

      setLeaders([]);

      setLeaderId("");

      return;

    }

    fetchLeaders();

  }, [departmentId]);

  const fetchDepartments = async () => {
    try {
      setFetchingDepartments(true);
      const response = managerMode 
        ? await getManagerDepartments(workspaceId)
        : await getDepartments(workspaceId);
      setDepartments(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingDepartments(false);
    }
  };

  const fetchLeaders = async () => {
    try {
      setFetchingLeaders(true);
      const response = managerMode
        ? await getManagerAvailableLeaders(departmentId)
        : await getAvailableLeaders(departmentId);
      setLeaders(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingLeaders(false);
    }
  };

  const reset = () => {

    setDepartmentId("");

    setLeaderId("");

    setName("");

    setLeaders([]);

  };

  const handleClose = () => {

    reset();

    onClose();

  };

  const handleSubmit = async () => {

    if (!departmentId) return;

    if (!name.trim()) return;

    try {

      await onCreate({

        departmentId,

        leaderId:
          leaderId || null,

        name: name.trim(),

      });

      reset();

    }
    catch (err) {

      console.error(err);

    }

  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div
        className="w-full max-w-xl rounded-3xl p-8"
        style={{
          background: "#13111C",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2
              className="text-3xl font-bold"
              style={{
                color: theme.text,
              }}
            >
              Create Team
            </h2>

            <p
              className="mt-2"
              style={{
                color: theme.secondary,
              }}
            >
              Create a new team inside a
              department.
            </p>

          </div>

          <button
            onClick={handleClose}
          >
            <X
              size={24}
              color={theme.secondary}
            />
          </button>

        </div>

        {/* Department */}

        <div className="mb-6">

          <label
            className="mb-2 block"
            style={{
              color: theme.secondary,
            }}
          >
            Department
          </label>

          <select

            value={departmentId}

            onChange={(e) =>
              setDepartmentId(
                e.target.value
              )
            }

            disabled={
              fetchingDepartments
            }

            className="h-14 w-full rounded-xl px-4 outline-none"

            style={{
              background:
                "rgba(255,255,255,.05)",
              border:
                "1px solid rgba(255,255,255,.08)",
              color: theme.text,
            }}

          >

            <option value="">

              Select Department

            </option>

            {departments.map(dept => (

              <option
                key={dept.id}
                value={dept.id}
              >

                {dept.name}

              </option>

            ))}

          </select>

        </div>

        {/* Team Name */}

        <div className="mb-6">

          <label
            className="mb-2 block"
            style={{
              color: theme.secondary,
            }}
          >
            Team Name
          </label>

          <input

            value={name}

            onChange={(e) =>
              setName(
                e.target.value
              )
            }

            placeholder="Frontend"

            className="h-14 w-full rounded-xl px-4 outline-none"

            style={{
              background:
                "rgba(255,255,255,.05)",
              border:
                "1px solid rgba(255,255,255,.08)",
              color: theme.text,
            }}

          />

        </div>

        {/* Leader */}

        <div>

          <label
            className="mb-2 block"
            style={{
              color: theme.secondary,
            }}
          >
            Team Leader
          </label>

          <select

            value={leaderId}

            disabled={
              !departmentId ||
              fetchingLeaders
            }

            onChange={(e) =>
              setLeaderId(
                e.target.value
              )
            }

            className="h-14 w-full rounded-xl px-4 outline-none"

            style={{
              background:
                "rgba(255,255,255,.05)",
              border:
                "1px solid rgba(255,255,255,.08)",
              color: theme.text,
            }}

          >

            <option value="">

              No Leader

            </option>

            {leaders.map(leader => (

              <option
                key={leader.id}
                value={leader.id}
              >

                {leader.name}

              </option>

            ))}

          </select>

        </div>

        {/* Footer */}

        <div className="mt-10 flex justify-end gap-4">

          <button

            onClick={handleClose}

            className="rounded-xl px-6 py-3"

            style={{
              background:
                "rgba(255,255,255,.05)",
              color: theme.text,
            }}

          >

            Cancel

          </button>

          <button

            onClick={handleSubmit}

            disabled={loading}

            className="rounded-xl px-8 py-3"

            style={{
              background:
                "linear-gradient(135deg,#7C3AED,#A78BFA)",
              color: "#fff",
            }}

          >

            {loading
              ? "Creating..."
              : "Create Team"}

          </button>

        </div>

      </div>

    </div>

  );

};

export default CreateTeamModal;