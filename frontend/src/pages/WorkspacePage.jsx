import { theme } from "@/lib/theme";

import { WorkspaceNavbar } from "@/components/workspace/WorkspaceNavbar";
import { WelcomeSection } from "@/components/workspace/WelcomeSection";
import { WorkspaceGrid } from "@/components/workspace/WorkspaceGrid";
import { CreateWorkspaceButton } from "@/components/workspace/CreateWorkspaceButton";

import { useWorkspaces } from "@/hooks/useWorkspaces";

const WorkspacePage = () => {
  const {
    workspaces,
    loading,
    error,
    refetch,
  } = useWorkspaces();

  return (
    <div
      className="min-h-screen pb-12"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <WorkspaceNavbar />

      <WelcomeSection />

      <WorkspaceGrid
        workspaces={workspaces}
        loading={loading}
        error={error}
      />

      <CreateWorkspaceButton
        refetch={refetch}
      />
    </div>
  );
};

export default WorkspacePage;