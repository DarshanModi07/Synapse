import { useState, useCallback, useEffect } from 'react';
import { getManagerWorkspaceMembers } from "@/services/manager.service";

export const useManagerMembers = (workspaceId) => {
    const [members, setMembers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMembers = useCallback(async () => {
        console.log("Workspace ID:", workspaceId);
        console.log("Loading:", loading);

        if (!workspaceId) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching manager members...");
            const response = await getManagerWorkspaceMembers(workspaceId);
            console.log("Response:", response);
            setMembers(response.data || []);
            setAnalytics(response.analytics || null);
            console.log("Members Count:", response.data?.length);
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
