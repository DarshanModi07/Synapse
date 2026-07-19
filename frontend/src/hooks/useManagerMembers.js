import { useState, useCallback, useEffect } from 'react';
import { getManagerWorkspaceMembers } from "@/services/manager.service";

export const useManagerMembers = (workspaceId) => {
    const [members, setMembers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMembers = useCallback(async () => {
        if (!workspaceId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await getManagerWorkspaceMembers(workspaceId);
            setMembers(response.data || []);
            setAnalytics(response.analytics || null);
        } catch (err) {
            console.error("Error fetching manager members:", err);
            setError(err?.message || "Failed to load members");
        } finally {
            setLoading(false);
        }
    }, [workspaceId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    return {
        members,
        analytics,
        loading,
        error,
        refresh: fetchMembers
    };
};
