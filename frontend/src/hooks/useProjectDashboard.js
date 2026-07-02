import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    getProjectDashboard
} from "@/services/projectDashboard.service";

export const useProjectDashboard = (
    projectId
) => {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchDashboard =
        useCallback(async () => {

            if (!projectId) {
                return;
            }

            try {

                setLoading(true);

                const response =
                    await getProjectDashboard(
                        projectId
                    );

                setDashboard(
                    response.data
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

        }, [projectId]);

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