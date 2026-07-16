import { useState, useEffect } from 'react';
import teamLeadAnalyticsService from '../services/teamLeadAnalytics.service';

export const useTeamLeadAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await teamLeadAnalyticsService.getAnalytics();
            if (response.success) {
                setAnalyticsData(response.data);
            } else {
                setAnalyticsData(null);
            }
        } catch (err) {
            console.error("Failed to fetch team lead analytics", err);
            setError(err.response?.data?.message || "Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return {
        analyticsData,
        loading,
        error,
        refetch: fetchAnalytics
    };
};
