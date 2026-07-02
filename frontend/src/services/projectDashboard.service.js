import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Project Dashboard
|--------------------------------------------------------------------------
*/

export const getProjectDashboard = async (
    projectId
) => {

    const response = await api.get(
        `/project/${projectId}/dashboard`
    );

    return response.data;

};