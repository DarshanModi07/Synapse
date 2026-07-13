import { useState, useEffect, useCallback } from "react";
import { getAllManagerWorkspaceProjects } from "@/services/manager.service";

export const useManagerWorkspaceProjects = (workspaceId) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        if (!workspaceId) {
            setProjects([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await getAllManagerWorkspaceProjects(workspaceId);
            setProjects(response.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching manager projects:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load projects."
            );
        } finally {
            setLoading(false);
        }
    }, [workspaceId]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        loading,
        error,
        refresh: fetchProjects
    };
};
