import { useCallback, useEffect, useState } from "react";
import { getPendingInvites, acceptWorkspaceInvite, rejectWorkspaceInvite } from "@/services/workspaceMember.service";
import { useAuth } from "@/context/AuthContext";

export const useWorkspaceInvites = () => {
    const { profile } = useAuth();
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInvites = useCallback(async () => {
        if (!profile) {
            setInvites([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await getPendingInvites();
            setInvites(response.data || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch invites.");
        } finally {
            setLoading(false);
        }
    }, [profile]);

    useEffect(() => {
        fetchInvites();
    }, [fetchInvites]);

    const accept = async (token) => {
        try {
            await acceptWorkspaceInvite(token);
            await fetchInvites();
            window.location.reload(); // Hard reload on accept to initialize new workspace
        } catch (err) {
            alert(err.response?.data?.message || "Failed to accept invite");
        }
    };

    const reject = async (token) => {
        try {
            await rejectWorkspaceInvite(token);
            await fetchInvites();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to reject invite");
        }
    };

    return {
        invites,
        loading,
        error,
        fetchInvites,
        accept,
        reject
    };
};
