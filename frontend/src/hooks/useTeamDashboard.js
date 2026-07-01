import {
    useEffect,
    useState,
} from "react";

import {
    getTeamDashboard,
} from "@/services/teamDashboard.service";

export const useTeamDashboard = (
    teamId
) => {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchDashboard =
            async () => {

                try {

                    const response =
                        await getTeamDashboard(
                            teamId
                        );

                    setDashboard(
                        response.data
                    );

                }
                catch (err) {

                    console.error(err);

                }
                finally {

                    setLoading(false);

                }

            };

        if (teamId) {
            fetchDashboard();
        }

    }, [teamId]);

    return {
        dashboard,
        loading
    };

};