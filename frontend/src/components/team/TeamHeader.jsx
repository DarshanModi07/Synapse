import { Users } from "lucide-react";
import { theme } from "@/lib/theme";

const TeamHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1
          className="text-4xl font-bold"
          style={{
            color: theme.text,
          }}
        >
          Teams
        </h1>

        <p
          className="mt-3 text-lg"
          style={{
            color: theme.secondary,
          }}
        >
          Manage every team across all departments in your workspace.
        </p>
      </div>

      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg,#7C3AED,#A78BFA)",
        }}
      >
        <Users
          size={30}
          color="#fff"
        />
      </div>
    </div>
  );
};

export default TeamHeader;