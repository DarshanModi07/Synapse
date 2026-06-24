import { theme } from "@/lib/theme";
import { Check } from "lucide-react";
import { useState } from "react";

export const Register = () => {
const features = [
"Workspace Management",
"AI Planning",
"Project Analytics",
"Team Collaboration",
];

return (
<div
className="min-h-screen"
style={{
backgroundColor: theme.background,
color: theme.text,
}}
> <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6">
    {/* Left Side */}
    <div className="hidden flex-1 lg:block">
      <div className="max-w-xl">
        <div
          className="mb-6 inline-flex rounded-full px-4 py-2 text-sm"
          style={{
            backgroundColor: `${theme.primary}15`,
            color: theme.primary,
          }}
        >
          Welcome to Synapse
        </div>

        <h1 className="mb-6 text-6xl font-bold">
          Synapse
        </h1>

        <p
          className="mb-10 text-xl leading-relaxed"
          style={{
            color: theme.secondary,
          }}
        >
          Build intelligent workspaces.
          <br />
          Organize teams.
          <br />
          Track projects.
          <br />
          Unlock AI-powered execution.
        </p>

        <div className="space-y-4">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3"
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${theme.primary}20`,
                }}
              >
                <Check
                  size={14}
                  color={theme.primary}
                />
              </div>

              <span
                style={{
                  color: theme.secondary,
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right Side */}
    <div className="flex flex-1 justify-center">
      <div className="relative w-full max-w-md">
        
        {/* Glow */}
        <div
          className="absolute inset-0 blur-3xl"
          style={{
            background: `${theme.primary}20`,
          }}
        />

        {/* Card */}
        <div
          className="relative rounded-3xl border p-8"
          style={{
            background: "rgba(19,17,28,0.65)",
            borderColor: `${theme.primary}25`,
            backdropFilter: "blur(24px)",
          }}
        >
          <h2 className="mb-2 text-3xl font-bold">
            Create Account
          </h2>

          <p
            className="mb-8"
            style={{
              color: theme.secondary,
            }}
          >
            Start building with Synapse.
          </p>

          <form className="space-y-5">
            <div>
              <label
                className="mb-2 block text-sm"
                style={{
                  color: theme.secondary,
                }}
              >
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border px-4 py-3 outline-none"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm"
                style={{
                  color: theme.secondary,
                }}
              >
                Email
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border px-4 py-3 outline-none"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm"
                style={{
                  color: theme.secondary,
                }}
              >
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border px-4 py-3 outline-none"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl py-3 font-medium transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: theme.primary,
                color: theme.text,
              }}
            >
              Create Account
            </button>
          </form>

          <p
            className="mt-6 text-center text-sm"
            style={{
              color: theme.secondary,
            }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: theme.primary,
              }}
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

);
};
