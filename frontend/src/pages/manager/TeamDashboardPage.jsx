import { useParams } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";

import { useManagerTeamDashboard } from "@/hooks/useManagerTeamDashboard";

import TeamDashboardHeader from "@/components/teamDashboard/TeamDashboardHeader";
import TeamStatistics from "@/components/teamDashboard/TeamStatistics";
import TeamMembers from "@/components/teamDashboard/TeamMembers";
// import TeamTasks from "@/components/teamDashboard/TeamTasks";
import TeamProjects from "@/components/teamDashboard/TeamProjects";

import { theme } from "@/lib/theme";

const ManagerTeamDashboardPage = () => {

  const { teamId } = useParams();
  const { workspace } = useWorkspace();

  const {

    dashboard,

    loading,

    error,

    refresh,

  } = useManagerTeamDashboard(teamId);

  if (loading) {

    return (

      <div className="flex h-[80vh] items-center justify-center">

        <div
          className="h-14 w-14 animate-spin rounded-full border-4 border-t-transparent"
          style={{
            borderColor: "rgba(167,139,250,.25)",
            borderTopColor: theme.primary,
          }}
        />

      </div>

    );

  }

  if (error || !dashboard) {

    return (

      <div
        className="flex h-[80vh] items-center justify-center text-xl"
        style={{
          color: theme.text,
        }}
      >

        Failed to load Team Dashboard.

      </div>

    );

  }

  return (

    <main className="space-y-8">

      <TeamDashboardHeader

        team={dashboard.team}

        statistics={dashboard.statistics}

      />

      <TeamStatistics

        statistics={dashboard.statistics}

      />

      <TeamMembers
        members={dashboard.members}
        teamId={teamId}
        workspaceId={workspace?.id}
        canAddMembers={true}
        canRemoveMembers={true}
        refresh={refresh}
      />

      {/* <TeamTasks

          projectTeamId={dashboard.team.projectTeamId}

      /> */}

      <TeamProjects

        projects={dashboard.recentProjects || dashboard.projects}

      />

    </main>

  );

};

export default ManagerTeamDashboardPage;
