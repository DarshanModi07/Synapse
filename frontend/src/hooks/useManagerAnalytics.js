import { useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

export const useManagerAnalytics = (workspaceId) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/manager/analytics");
            setAnalytics(response.data.data || response.data || null);
        } catch (err) {
            console.error("Analytics Error:", err);
            setError(err?.message || "Failed to load analytics");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        analytics,
        loading,
        error,
        refresh: fetchAnalytics
    };
};
