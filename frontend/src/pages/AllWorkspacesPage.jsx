import { theme } from "@/lib/theme";
import { WorkspaceNavbar } from "@/components/AllWorkspaces/WorkspaceNavbar";
import { WelcomeSection } from "@/components/AllWorkspaces/WelcomeSection";
import { WorkspaceGrid } from "@/components/AllWorkspaces/WorkspaceGrid";
import { CreateWorkspaceButton } from "@/components/AllWorkspaces/CreateWorkspaceButton";

import { useWorkspaces } from "@/hooks/useWorkspaces";

const AllWorkspacesPage = () => {
  const {
    workspaces,
    loading,
    error,
    refresh,
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
        refetch={refresh}
      />
    </div>
  );
};

export default AllWorkspacesPage;