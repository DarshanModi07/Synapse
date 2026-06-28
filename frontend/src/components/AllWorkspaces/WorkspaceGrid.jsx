import { WorkspaceCard } from "./WorkspaceCard";

export const WorkspaceGrid = ({
  workspaces,
  loading,
  error,
}) => {

  if (loading) {
    return (
      <section className="mx-auto mt-12 max-w-7xl px-6">
        <p className="text-zinc-400">
          Loading workspaces...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto mt-12 max-w-7xl px-6">
        <p className="text-red-500">
          {error}
        </p>
      </section>
    );
  }

  if (workspaces.length === 0) {
    return (
      <section className="mx-auto mt-12 max-w-7xl px-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No Workspaces Yet
          </h2>

          <p className="mt-3 text-zinc-400">
            Create your first workspace to start collaborating.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-12 max-w-7xl px-6">

      <div className="space-y-5">

        {workspaces.map((workspaceMember) => (
          <WorkspaceCard
            key={workspaceMember.workspace.id}
            workspaceMember={workspaceMember}
          />
        ))}

      </div>

    </section>
  );
};