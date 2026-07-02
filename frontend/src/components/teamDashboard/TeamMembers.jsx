import {
  Crown,
  User,
  Mail,
  CalendarDays,
} from "lucide-react";

import { theme } from "@/lib/theme";

const TeamMembers = ({
  members = [],
}) => {

  return (

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

      <div className="mb-8 flex items-center justify-between">

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

        <div
          className="rounded-xl px-4 py-2"
          style={{
            background: "rgba(124,58,237,.12)",
            color: theme.primaryLight,
          }}
        >
          {members.length} Members
        </div>

      </div>

      {

        members.length === 0 ? (

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

              members.map((member) => (

                <div

                  key={member.id}

                  className="flex items-center justify-between rounded-2xl p-5 transition-all duration-300 hover:bg-white/5"

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
                          className="flex h-14 w-14 items-center justify-center rounded-full"
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

                    <div>

                      <h3
                        className="text-lg font-semibold"
                        style={{
                          color: theme.text,
                        }}
                      >
                        {member.name}
                      </h3>

                      <div
                        className="mt-2 flex items-center gap-2"
                        style={{
                          color: theme.secondary,
                        }}
                      >

                        <Mail size={15} />

                        {member.email}

                      </div>

                    </div>

                  </div>

                  {/* Right */}

                  <div className="text-right">

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

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  );

};

export default TeamMembers;