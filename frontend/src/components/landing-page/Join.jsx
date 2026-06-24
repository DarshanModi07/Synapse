import { theme } from "@/lib/theme";

export const Join = () => {
  return (
    <section className="px-6 py-20">
  <div
    className="mx-auto max-w-5xl rounded-3xl border p-10 md:p-14"
    style={{
      backgroundColor: `${theme.card}`,
      borderColor: `${theme.border}`,
    }}
  >
    <h2 className="mb-6 text-4xl font-bold md:text-5xl">
      Start building with Synapse
    </h2>

    <p className="mb-10 max-w-3xl text-xl leading-relaxed text-zinc-400">
      Manage departments, teams, projects, and collaboration
      from a single workspace.
    </p>

    <div className="flex flex-col gap-4 sm:flex-row">
      <button
        className="rounded-2xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: theme.primary,
          color: theme.text,
        }}
      >
        Get Started
      </button>

      <button
        className="rounded-2xl px-6 py-3 transition-colors hover:bg-white/5"
        style={{
          color: theme.secondary,
        }}
      >
        Login
      </button>
    </div>
  </div>
</section>
  );
};