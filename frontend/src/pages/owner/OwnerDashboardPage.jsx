import { useOwnerDashboard } from "@/hooks/useOwnerDashboard";

import { WelcomeCard } from "@/components/owner/dashboard/WelcomeCard";
import { StatsCards } from "@/components/owner/dashboard/StatsCards";
import { ProgressCard } from "@/components/owner/dashboard/ProgressCard";
import { RecentProjects } from "@/components/owner/dashboard/RecentProjects";
import { QuickActions } from "@/components/owner/dashboard/QuickActions";

const DashboardPage = () => {
  const {
    workspace,
    overview,
    progress,
    recentProjects,
    loading,
    error,
  } = useOwnerDashboard();

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-7">

      <WelcomeCard
        workspace={workspace}
      />

      <StatsCards
        overview={overview}
      />

      <div className="grid grid-cols-12 gap-7">

        <div className="col-span-8">
          <RecentProjects
            projects={recentProjects}
          />
        </div>

        <div className="col-span-4">
          <ProgressCard
            progress={progress}
          />
        </div>

      </div>

      <QuickActions />

    </div>
  );
};

export default DashboardPage;