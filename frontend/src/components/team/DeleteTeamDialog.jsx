import { AlertTriangle } from "lucide-react";

import { theme } from "@/lib/theme";

const DeleteTeamDialog = ({
  open,
  onClose,
  onDelete,
  team,
  loading,
}) => {

  if (!open || !team) return null;

  const handleDelete = async () => {

    try {

      await onDelete(team.id);

    }
    catch (err) {

      console.error(err);

    }

  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: "#13111C",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >

        <div className="flex justify-center">

          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: "rgba(255,0,0,.08)",
            }}
          >

            <AlertTriangle
              size={42}
              color="#FF6B6B"
            />

          </div>

        </div>

        <h2
          className="mt-6 text-center text-3xl font-bold"
          style={{
            color: theme.text,
          }}
        >
          Delete Team
        </h2>

        <p
          className="mt-4 text-center leading-7"
          style={{
            color: theme.secondary,
          }}
        >
          Are you sure you want to delete

          <span
            className="mx-1 font-semibold"
            style={{
              color: theme.text,
            }}
          >
            {team.name}
          </span>

          ?

          <br />

          This action can be reverted later if
          soft delete is enabled.
        </p>

        <div className="mt-10 flex gap-4">

          <button

            onClick={onClose}

            disabled={loading}

            className="flex-1 rounded-xl py-3 transition-all duration-300 hover:scale-[1.02]"

            style={{
              background:
                "rgba(255,255,255,.05)",
              border:
                "1px solid rgba(255,255,255,.08)",
              color: theme.text,
            }}

          >

            Cancel

          </button>

          <button

            onClick={handleDelete}

            disabled={loading}

            className="flex-1 rounded-xl py-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"

            style={{
              background:
                "linear-gradient(135deg,#EF4444,#DC2626)",
              color: "#fff",
            }}

          >

            {loading
              ? "Deleting..."
              : "Delete"}

          </button>

        </div>

      </div>

    </div>

  );

};

export default DeleteTeamDialog;