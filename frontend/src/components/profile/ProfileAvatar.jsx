import { theme } from "@/lib/theme";

export const ProfileAvatar = ({
  user,
  size = "h-20 w-20",
}) => {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${size} rounded-full object-cover border`}
        style={{
          borderColor: theme.border,
        }}
      />
    );
  }

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full text-2xl font-semibold border`}
      style={{
        backgroundColor: theme.primary,
        color: theme.text,
        borderColor: theme.border,
      }}
    >
      {user?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  );
};