import TeamCard from "./TeamCard";

import { Users } from "lucide-react";

import { theme } from "@/lib/theme";

const TeamGrid = ({
  teams,
  loading,
  onOpen,
  onEdit,
  onDelete,
}) => {

  if (loading) {
    return (
      <div className="mt-10 flex items-center justify-center py-20">

        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
          style={{
            borderColor: "rgba(167,139,250,.25)",
            borderTopColor: theme.primary,
          }}
        />

      </div>
    );
  }

  if (!teams.length) {
    return (
      <div
        className="mt-10 flex flex-col items-center justify-center rounded-3xl py-24"
        style={{
          background: "rgba(255,255,255,.03)",
          border: "1px solid rgba(255,255,255,.06)",
        }}
      >

        <Users
          size={60}
          color={theme.primaryLight}
        />

        <h2
          className="mt-6 text-2xl font-semibold"
          style={{
            color: theme.text,
          }}
        >
          No Teams Found
        </h2>

        <p
          className="mt-3 max-w-md text-center"
          style={{
            color: theme.secondary,
          }}
        >
          Create your first team or generate
          teams using AI.
        </p>

      </div>
    );
  }

  return (

    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {teams.map((team) => (

        <TeamCard

          key={team.id}

          team={team}

          onOpen={onOpen}

          onEdit={onEdit}

          onDelete={onDelete}

        />

      ))}

    </div>

  );

};

export default TeamGrid;