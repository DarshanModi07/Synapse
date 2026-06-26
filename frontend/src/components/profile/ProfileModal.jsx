import { X, UserPen, Camera } from "lucide-react";
import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";

export const ProfileModal = ({
  open,
  onClose,
}) => {
  const { profile } = useAuth();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div
        className="w-full max-w-md rounded-2xl border p-8"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border,
        }}
      >

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            My Profile
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-white/5"
          >
            <X size={20} />
          </button>

        </div>

        {/* Avatar */}

        <div className="mb-8 flex flex-col items-center">

          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt="avatar"
              className="mb-4 h-28 w-28 rounded-full object-cover"
            />
          ) : (
            <div
              className="mb-4 flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold"
              style={{
                backgroundColor: theme.primary,
              }}
            >
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <h3 className="text-xl font-semibold">
            {profile?.name}
          </h3>

          <p
            style={{
              color: theme.secondary,
            }}
          >
            {profile?.email}
          </p>

        </div>

        {/* Information */}

        <div className="space-y-5">

          <div className="flex justify-between">

            <span
              style={{
                color: theme.secondary,
              }}
            >
              Status
            </span>

            <span
              className={
                profile?.isActive
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {profile?.isActive
                ? "Active"
                : "Inactive"}
            </span>

          </div>

          <div className="flex justify-between">

            <span
              style={{
                color: theme.secondary,
              }}
            >
              Joined
            </span>

            <span>
              {new Date(
                profile?.createdAt
              ).toLocaleDateString()}
            </span>

          </div>

        </div>

        {/* Divider */}

        <div
          className="my-8 border-t"
          style={{
            borderColor: theme.border,
          }}
        />

        {/* Actions */}

        <div className="space-y-3">

          <button
            className="flex w-full items-center gap-3 rounded-xl border p-3 transition hover:bg-white/5"
            style={{
              borderColor: theme.border,
            }}
          >
            <UserPen size={18} />

            Edit Profile
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl border p-3 transition hover:bg-white/5"
            style={{
              borderColor: theme.border,
            }}
          >
            <Camera size={18} />

            Upload Avatar
          </button>

        </div>

      </div>

    </div>
  );
};