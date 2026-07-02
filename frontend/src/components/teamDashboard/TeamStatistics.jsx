import {
  Users,
  FolderKanban,
  CheckSquare,
  CircleCheckBig,
} from "lucide-react";

import { theme } from "@/lib/theme";

const TeamStatistics = ({
  statistics,
}) => {

  const cards = [

    {
      title: "Members",
      value: statistics.members ?? 0,
      icon: Users,
    },

    {
      title: "Projects",
      value: statistics.projects ?? 0,
      icon: FolderKanban,
    },

    {
      title: "Active Tasks",
      value: statistics.tasks ?? 0,
      icon: CheckSquare,
    },

    {
      title: "Completed Tasks",
      value: statistics.completedTasks ?? 0,
      icon: CircleCheckBig,
    },

  ];

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {

        cards.map((card) => {

          const Icon = card.icon;

          return (

            <div

              key={card.title}

              className="rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"

              style={{
                background: "rgba(13,13,18,.55)",
                border: "1px solid rgba(167,139,250,.10)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow:
                  "0 12px 30px rgba(0,0,0,.25),0 0 28px rgba(124,58,237,.05)",
              }}

            >

              <div className="flex items-center justify-between">

                <div>

                  <p
                    style={{
                      color: theme.secondary,
                    }}
                  >
                    {card.title}
                  </p>

                  <h2
                    className="mt-3 text-4xl font-bold"
                    style={{
                      color: theme.text,
                    }}
                  >
                    {card.value}
                  </h2>

                </div>

                <div

                  className="flex h-14 w-14 items-center justify-center rounded-2xl"

                  style={{
                    background:
                      "linear-gradient(135deg,#7C3AED,#A78BFA)",
                  }}

                >

                  <Icon
                    size={28}
                    color="#fff"
                  />

                </div>

              </div>

            </div>

          );

        })

      }

    </div>

  );

};

export default TeamStatistics;