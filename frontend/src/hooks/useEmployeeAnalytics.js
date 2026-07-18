import { useState, useEffect } from 'react';
import { getEmployeeAnalytics } from '../services/employee.service';

export const useEmployeeAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await getEmployeeAnalytics();
            if (res.success) {
                setAnalyticsData(res.data);
            } else {
                setError(res.message || "Failed to fetch analytics.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error fetching analytics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return { analyticsData, loading, error, refetch: fetchAnalytics };
};
