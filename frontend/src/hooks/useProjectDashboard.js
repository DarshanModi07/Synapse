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

    const fetchDashboard = useCallback(async () => {

    console.log("fetchDashboard called");
    console.log("projectId:", projectId);

    if (!projectId) {
        console.log("No projectId");
        return;
    }

    try {
        setLoading(true);

        console.log("Calling API...");

        const response = await getProjectDashboard(projectId);

        console.log("API Response:", response);

        setDashboard(response.data);

        setError(null);

    } catch (err) {

        console.error("Dashboard Error:", err);

        setError(err);

    } finally {

        console.log("Loading false");

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