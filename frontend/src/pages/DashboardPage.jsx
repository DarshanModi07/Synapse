import { useWorkspace } from "@/context/WorkspaceContext";

import OwnerDashboardPage from "@/pages/owner/OwnerDashboardPage";
import ManagerDashboardPage from "@/pages/manager/ManagerDashboardPage";
import TeamLeadDashboardPage from "@/pages/teamLead/DashboardPage";
import EmployeeDashboardPage from "@/pages/employee/DashboardPage";

const DashboardPage = () => {

    const { workspace } = useWorkspace();

    const role = workspace?.memberRole?.sysRole;

    switch (role) {

        case "owner":
            return <OwnerDashboardPage />;

        case "manager":
            return <ManagerDashboardPage />;

        case "team_lead":
            return <TeamLeadDashboardPage />;

        case "employee":
            return <EmployeeDashboardPage />;

        default:
            return null;

    }

};

export default DashboardPage;