import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    getProjectTeamDashboard
} from "@/services/projectTeamDashboard.service";

export const useProjectTeamDashboard = (
    projectTeamId
) => {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    /*
    =====================================================
    FETCH DASHBOARD
    =====================================================
    */

    const fetchDashboard =
        useCallback(async () => {

            if (!projectTeamId) return;

            try {

                setLoading(true);

                const response =
                    await getProjectTeamDashboard(
                        projectTeamId
                    );

                setDashboard(
                    response
                );

                setError(null);

            }
            catch (err) {

                console.error(err);

                setError(err);

            }
            finally {

                setLoading(false);

            }

        }, [projectTeamId]);

    /*
    =====================================================
    EFFECT
    =====================================================
    */

    useEffect(() => {

        fetchDashboard();

    }, [fetchDashboard]);

    return {

        dashboard,

        loading,

        error,

        refresh:
            fetchDashboard

    };

};