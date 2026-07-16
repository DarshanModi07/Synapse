import { useState, useEffect } from 'react';
import teamLeadMemberService from '../services/teamLeadMember.service';

export const useTeamLeadMemberDetails = (memberId) => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [workItems, setWorkItems] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDetails = async () => {
        if (!memberId) return;
        try {
            setLoading(true);
            const response = await teamLeadMemberService.getMemberDetails(memberId);
            if (response.success && response.data) {
                const { data } = response;
                setProfile(data.profile);
                setStats(data.stats);
                setTimeline(data.timeline || []);
                setTasks(data.tasks || []);
                setSubtasks(data.subtasks || []);
                setWorkItems(data.workItems || []);
                setAnalytics(data.analytics);
            }
        } catch (err) {
            console.error(`Failed to fetch details for member ${memberId}`, err);
            setError(err.response?.data?.message || "Failed to load member details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [memberId]);

    return {
        profile,
        stats,
        timeline,
        tasks,
        subtasks,
        workItems,
        analytics,
        loading,
        error,
        refetch: fetchDetails
    };
};
