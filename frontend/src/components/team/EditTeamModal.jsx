import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { theme } from "@/lib/theme";

import {
  getAvailableLeaders,
} from "@/services/team.service";

const EditTeamModal = ({
  open,
  onClose,
  onSave,
  team,
  loading,
}) => {

  const [name, setName] =
    useState("");

  const [leaderId, setLeaderId] =
    useState("");

  const [leaders, setLeaders] =
    useState([]);

  const [fetchingLeaders, setFetchingLeaders] =
    useState(false);

  useEffect(() => {

    if (!open || !team) return;

    setName(team.name || "");

    setLeaderId(team.leader?.id || "");

  }, [open, team]);

  useEffect(() => {

    if (!open || !team) return;

    fetchLeaders();

  }, [open, team]);

  const fetchLeaders = async () => {

    try {

      setFetchingLeaders(true);

      const response =
        await getAvailableLeaders(
          team.department.id
        );

      setLeaders(response.data || []);

    }
    catch (err) {

      console.error(err);

    }
    finally {

      setFetchingLeaders(false);

    }

  };

  const reset = () => {

    setName("");

    setLeaderId("");

    setLeaders([]);

  };

  const handleClose = () => {

    reset();

    onClose();

  };

  const handleSubmit = async () => {

    if (!name.trim()) return;

    try {

      await onSave(

        team.id,

        {

          name: name.trim(),

          leaderId:
            leaderId || null,

        }

      );

      reset();

    }
    catch (err) {

      console.error(err);

    }

  };

  if (!open || !team) return null;

    return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div
        className="w-full max-w-xl rounded-3xl p-8"
        style={{
          background: "#13111C",
          border: "1px solid rgba(255,255,255,.08)",
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
              Edit Team
            </h2>

            <p
              className="mt-2"
              style={{
                color: theme.secondary,
              }}
            >
              Update team information.
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

          <input
            value={team.department?.name || ""}
            readOnly
            className="h-14 w-full rounded-xl px-4 outline-none"
            style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.08)",
              color: theme.secondary,
              cursor: "not-allowed",
            }}
          />

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
              setName(e.target.value)
            }
            placeholder="Frontend"
            className="h-14 w-full rounded-xl px-4 outline-none"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
              color: theme.text,
            }}
          />

        </div>

        {/* Team Leader */}

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

            disabled={fetchingLeaders}

            onChange={(e) =>
              setLeaderId(
                e.target.value
              )
            }

            className="h-14 w-full rounded-xl px-4 outline-none"

            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
              color: theme.text,
            }}

          >

            <option value="">
              No Leader
            </option>

            {leaders.map((leader) => (

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

            disabled={loading}

            className="rounded-xl px-6 py-3 transition-all duration-300 hover:scale-[1.02]"

            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
              color: theme.text,
            }}

          >

            Cancel

          </button>

          <button

            onClick={handleSubmit}

            disabled={
              loading ||
              !name.trim()
            }

            className="rounded-xl px-8 py-3 transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"

            style={{
              background:
                "linear-gradient(135deg,#7C3AED,#A78BFA)",
              color: "#fff",
              boxShadow:
                "0 10px 28px rgba(124,58,237,.30)",
            }}

          >

            {loading
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </div>

    </div>

  );

};

export default EditTeamModal;