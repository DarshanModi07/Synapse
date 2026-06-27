import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";

export const DangerZone = () => {
  const navigate = useNavigate();

  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();

    navigate("/");
  };

  return (
    <section>

      <p
        className="mt-1 text-sm"
        style={{
          color: theme.secondary,
        }}
      >
        Actions performed here affect your current session.
      </p>

      <div
        className="mt-8 rounded-2xl border p-6"
        style={{
          borderColor: "rgba(239,68,68,0.25)",
          backgroundColor: "rgba(239,68,68,0.04)",
        }}
      >
        <div className="flex items-center justify-between">

          <div>

            <h3 className="font-semibold">
              Logout
            </h3>

            <p
              className="mt-1 text-sm"
              style={{
                color: theme.secondary,
              }}
            >
              Sign out from your current device.
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />

            Logout
          </button>

        </div>
      </div>

    </section>
  );
};