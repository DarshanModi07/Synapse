import { useState, useEffect } from 'react';
import { getEmployeeDashboard } from '../services/employee.service';

export const useEmployeeDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const res = await getEmployeeDashboard();
            if (res.success) {
                setDashboardData(res.data);
            } else {
                setError(res.message || "Failed to fetch dashboard data.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error fetching dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return { dashboardData, loading, error, refetch: fetchDashboard };
};
