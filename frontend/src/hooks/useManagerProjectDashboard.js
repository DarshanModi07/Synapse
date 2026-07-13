import { useState, useEffect, useCallback } from "react";
import api from "@/api/axios";

export const useManagerProjectDashboard = (projectId) => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(
                `/manager/projects/${projectId}/dashboard`
            );
            setDashboard(response.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching manager project dashboard:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load project dashboard"
            );
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            fetchDashboard();
        }
    }, [fetchDashboard, projectId]);

    return {
        dashboard,
        loading,
        error,
        refresh: fetchDashboard
    };
};
