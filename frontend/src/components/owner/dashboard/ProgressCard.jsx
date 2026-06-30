import { theme } from "@/lib/theme";
import {
  CircleCheckBig,
  Clock3,
  SearchCheck,
} from "lucide-react";

export const ProgressCard = ({ progress }) => {
  const overall = progress?.overallProgress || 0;

  const circumference = 2 * Math.PI * 62;

  const offset =
    circumference -
    (overall / 100) * circumference;

  const stats = [
    {
      label: "Completed",
      value: progress?.done ?? 0,
      icon: CircleCheckBig,
      color: "#22C55E",
    },
    {
      label: "In Progress",
      value: progress?.inProgress ?? 0,
      icon: Clock3,
      color: "#F59E0B",
    },
    {
      label: "In Review",
      value: progress?.inReview ?? 0,
      icon: SearchCheck,
      color: "#3B82F6",
    },
  ];

  return (
    <div
      className="rounded-3xl p-7"
      style={{
        background: "rgba(13,13,18,.58)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 12px 32px rgba(0,0,0,.30),0 0 32px rgba(124,58,237,.05)",
      }}
    >
      {/* Header */}

      <div className="mb-8">
        <h2
          className="text-xl font-semibold"
          style={{
            color: theme.text,
          }}
        >
          Workspace Progress
        </h2>

        <p
          className="mt-1 text-sm"
          style={{
            color: theme.secondary,
          }}
        >
          Overall completion of all work items
        </p>
      </div>

      {/* Progress Circle */}

      <div className="mb-10 flex justify-center">
        <div className="relative h-40 w-40">

          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 150 150"
          >
            <circle
              cx="75"
              cy="75"
              r="62"
              stroke="rgba(255,255,255,.08)"
              strokeWidth="10"
              fill="none"
            />

            <circle
              cx="75"
              cy="75"
              r="62"
              stroke={theme.primary}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset .6s ease",
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1
              className="text-4xl font-bold"
              style={{
                color: theme.text,
              }}
            >
              {overall}%
            </h1>

            <p
              className="text-sm"
              style={{
                color: theme.secondary,
              }}
            >
              Completed
            </p>
          </div>
        </div>
      </div>

      {/* Status Cards */}

      <div className="space-y-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl px-5 py-4"
            style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.04)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  background: `${item.color}20`,
                  color: item.color,
                }}
              >
                <item.icon size={20} />
              </div>

              <span
                className="font-medium"
                style={{
                  color: theme.text,
                }}
              >
                {item.label}
              </span>
            </div>

            <span
              className="text-xl font-bold"
              style={{
                color: item.color,
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};