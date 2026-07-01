import api from "@/api/axios";

export const getTeamDashboard = async (
    teamId
) => {

    const response = await api.get(
        `/team/${teamId}/dashboard`
    );

    return response.data;

};