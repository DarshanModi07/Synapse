import { useState, useEffect } from 'react';
import teamLeadMemberService from '../services/teamLeadMember.service';

export const useTeamLeadMembers = () => {
    const [members, setMembers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [groupedTeams, setGroupedTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await teamLeadMemberService.getAllMembers();
            if (response.success && response.data) {
                setMembers(response.data.members || []);
                setAnalytics(response.data.analytics || null);
                setGroupedTeams(response.data.groupedTeams || []);
            }
        } catch (err) {
            console.error("Failed to fetch team lead members", err);
            setError(err.response?.data?.message || "Failed to load members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return {
        members,
        analytics,
        groupedTeams,
        loading,
        error,
        refetch: fetchMembers
    };
};
