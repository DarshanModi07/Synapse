import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";

export const AccountInfo = () => {
  const { profile } = useAuth();

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "-";

  return (
    <section>
      <h2 className="text-xl font-semibold">
        Account Information
      </h2>

      <p
        className="mt-1 text-sm"
        style={{
          color: theme.secondary,
        }}
      >
        Basic information about your account.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {/* Email */}

        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.surface,
          }}
        >
          <p
            className="text-sm"
            style={{
              color: theme.secondary,
            }}
          >
            Email Address
          </p>

          <h3 className="mt-2 text-lg font-medium">
            {profile?.email}
          </h3>
        </div>

        {/* Status */}

        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.surface,
          }}
        >
          <p
            className="text-sm"
            style={{
              color: theme.secondary,
            }}
          >
            Account Status
          </p>

          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />

            <span className="font-medium">
              {profile?.isActive
                ? "Active"
                : "Inactive"}
            </span>
          </div>
        </div>

        {/* Joined */}

        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.surface,
          }}
        >
          <p
            className="text-sm"
            style={{
              color: theme.secondary,
            }}
          >
            Member Since
          </p>

          <h3 className="mt-2 text-lg font-medium">
            {joinedDate}
          </h3>
        </div>

        {/* User ID */}



      </div>
    </section>
  );
};