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
        useState({
            departments: [],
            tasks: [],
            teams: [],
            members: []
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchDashboard = useCallback(async () => {
        if (!projectId) {
            return;
        }

        try {
            setLoading(true);

            const response = await getProjectDashboard(projectId);

            setDashboard(response?.data?.data || response?.data || response);

            setError(null);
        } catch (err) {

            console.error("Dashboard Error:", err);

            setError(err);

        } finally {
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