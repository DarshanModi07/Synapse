import { useState } from "react";
import {
  Crown,
  User,
  Mail,
  CalendarDays,
  Plus,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import { theme } from "@/lib/theme";
import AddTeamMembersModal from "../team/AddTeamMembersModal";
import RemoveMemberDialog from "./RemoveMemberDialog";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { addTeamMembers, removeTeamMember } from "@/services/team.service";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const TeamMembers = ({
  members = [],
  teamId,
  workspaceId,
  canAddMembers,
  refresh,
  canRemoveMembers
}) => {
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { members: workspaceMembers } = useWorkspaceMembers(workspaceId);

  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      setRemoving(true);
      await removeTeamMember(teamId, memberToRemove.id);
      showToast("Team member removed successfully");
      setMemberToRemove(null);
      if (refresh) refresh();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove team member", 'error');
    } finally {
      setRemoving(false);
    }
  };


  const handleAddMembers = async (memberIds) => {
    try {
      setSubmitting(true);
      await addTeamMembers(teamId, memberIds);
      // Removed undefined showNotification
      setShowAddMembers(false);
      if (refresh) refresh();
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to add members");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
    <>
      {toastMessage && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-[8px] shadow-lg border flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 ${toastMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-[13px] font-medium">{toastMessage.message}</span>
        </div>
      )}

      <RemoveMemberDialog
        open={!!memberToRemove}
        member={memberToRemove}
        teamName="this team"
        loading={removing}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
      />

      <AddTeamMembersModal
        open={showAddMembers}
        workspaceMembers={workspaceMembers}
        teamMembers={members}
        loading={submitting}
        onClose={() => setShowAddMembers(false)}
        onAdd={handleAddMembers}
      />

    <div
      className="rounded-3xl p-8"
      style={{
        background: "rgba(13,13,18,.55)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >

      {/* Header */}

      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2
            className="text-3xl font-bold"
            style={{
              color: theme.text,
            }}
          >
            Team Members
          </h2>

          <p
            className="mt-2"
            style={{
              color: theme.secondary,
            }}
          >
            Members currently assigned to this team.
          </p>

        </div>

        <div className="flex w-full items-center gap-4 sm:w-auto">
          <div
            className="rounded-xl px-4 py-2 text-center flex-1 sm:flex-none sm:text-left"
            style={{
              background: "rgba(124,58,237,.12)",
              color: theme.primaryLight,
            }}
          >
            {(members || []).length} Members
          </div>

          {canAddMembers && (
            <button
              onClick={() => setShowAddMembers(true)}
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold transition-all hover:opacity-90"
              style={{
                background: theme.primary,
                color: "#fff",
              }}
            >
              <Plus size={18} />
              Add Members
            </button>
          )}
        </div>

      </div>

      {

        (members || []).length === 0 ? (

          <div
            className="py-16 text-center"
            style={{
              color: theme.secondary,
            }}
          >

            No members found.

          </div>

        ) : (

          <div className="space-y-4">

            {

              (members || []).map((member) => (

                <div

                  key={member.id}

                  className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl p-5 transition-all duration-300 hover:bg-white/5"

                  style={{
                    border:
                      "1px solid rgba(255,255,255,.05)",
                  }}

                >

                  {/* Left */}

                  <div className="flex items-center gap-4">

                    {

                      member.avatar

                        ?

                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />

                        :

                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-full shrink-0"
                          style={{
                            background:
                              "rgba(124,58,237,.18)",
                          }}
                        >

                          <User
                            size={24}
                            color="#fff"
                          />

                        </div>

                    }

                    <div className="min-w-0">

                      <h3
                        className="text-lg font-semibold truncate"
                        style={{
                          color: theme.text,
                        }}
                      >
                        {member.name}
                      </h3>

                      <div
                        className="mt-2 flex flex-wrap items-center gap-2"
                        style={{
                          color: theme.secondary,
                        }}
                      >

                        <Mail size={15} className="shrink-0" />

                        <span className="truncate">{member.email}</span>

                      </div>

                    </div>

                  </div>

                  {/* Right */}

                  <div className="flex w-full items-center justify-between sm:w-auto sm:justify-end gap-6">
                    <div className="text-left sm:text-right">

                    <div
                      className="flex items-center justify-end gap-2"
                    >

                      {

                        member.role === "team_lead"

                          ?

                          <Crown
                            size={18}
                            color="#FACC15"
                          />

                          :

                          <User
                            size={18}
                            color={theme.primaryLight}
                          />

                      }

                      <span
                        style={{
                          color: theme.text,
                        }}
                      >
                        {

                          member.role === "team_lead"

                            ? "Leader"

                            : "Member"

                        }
                      </span>

                    </div>

                    <div
                      className="mt-2 flex items-center justify-end gap-2 text-sm"
                      style={{
                        color: theme.secondary,
                      }}
                    >

                      <CalendarDays
                        size={14}
                      />

                      {

                        new Date(
                          member.joinedAt
                        ).toLocaleDateString()

                      }

                    </div>

                  </div>

                    {canRemoveMembers && (
                      <button
                        onClick={() => setMemberToRemove(member)}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20"
                        style={{ color: theme.secondary }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                </div>

              ))

            }

          </div>

        )

      }

    </div>

    </>
    </ErrorBoundary>
  );

};

export default TeamMembers;