import { useParams } from "react-router-dom";

import {
    useTeamDashboard,
} from "@/hooks/useTeamDashboard";

const TeamDashboardPage = () => {

    const { teamId } =
        useParams();

    const {
        dashboard,
        loading
    } =
        useTeamDashboard(teamId);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <pre
            className="text-white"
        >
            {JSON.stringify(
                dashboard,
                null,
                2
            )}
        </pre>
    );

};

export default TeamDashboardPage;