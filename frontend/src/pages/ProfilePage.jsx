import { theme } from "@/lib/theme";

import { WorkspaceNavbar } from "@/components/workspace/WorkspaceNavbar";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { AccountInfo } from "@/components/profile/AccountInfo";
import { DangerZone } from "@/components/profile/DangerZone";

export default function ProfilePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <WorkspaceNavbar />

      <main className="mx-auto mt-10 max-w-5xl px-6 pb-20">

        <ProfileHeader />

        <div
          className="mt-8 rounded-3xl border p-8"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
          }}
        >

          {/* Avatar */}

          <AvatarUploader />

          <div
            className="my-8"
            style={{
              borderTop: `1px solid ${theme.border}`,
            }}
          />

          {/* Edit */}

          <EditProfileForm />

          <div
            className="my-8"
            style={{
              borderTop: `1px solid ${theme.border}`,
            }}
          />

          {/* Account */}

          <AccountInfo />

          <div
            className="my-8"
            style={{
              borderTop: `1px solid ${theme.border}`,
            }}
          />

          {/* Logout */}

          <DangerZone />

        </div>

      </main>

    </div>
  );
}