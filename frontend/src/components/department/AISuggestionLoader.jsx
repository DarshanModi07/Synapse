import { Sparkles } from "lucide-react";
import { theme } from "@/lib/theme";

const AISuggestionLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 backdrop-blur-md">
      <div
        className="w-full max-w-3xl rounded-3xl p-8"
        style={{
          background: "rgba(13,13,18,.96)",
          border: "1px solid rgba(167,139,250,.12)",
          boxShadow: "0 20px 80px rgba(0,0,0,.45)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl animate-pulse"
            style={{
              background: "rgba(124,58,237,.15)",
            }}
          >
            <Sparkles
              size={26}
              color={theme.primary}
            />
          </div>

          <div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: theme.text }}
            >
              AI is planning your departments...
            </h2>

            <p
              className="mt-2"
              style={{ color: theme.secondary }}
            >
              Analyzing workspace and generating an organization structure.
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border p-6"
              style={{
                borderColor: "rgba(255,255,255,.06)",
                background: "rgba(255,255,255,.03)",
              }}
            >
              <div className="h-6 w-52 rounded bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <div className="mt-4 h-4 rounded bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <div className="mt-2 h-4 w-3/4 rounded bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISuggestionLoader;