import { theme } from "@/lib/theme";

export const ProfileHeader = () => {
  return (
    <div className="mb-8">

      <p
        className="text-sm font-medium uppercase tracking-widest"
        style={{
          color: theme.primary,
        }}
      >
        Settings
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Account Profile
      </h1>

      <p
        className="mt-3 max-w-2xl text-base"
        style={{
          color: theme.secondary,
        }}
      >
        Manage your personal information, profile picture
        and account settings.
      </p>

    </div>
  );
};