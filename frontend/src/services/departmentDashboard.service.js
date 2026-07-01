import api from "@/api/axios";

export const getDepartmentDashboard = async (
    departmentId
) => {

    const response = await api.get(
        `/department/${departmentId}/dashboard`
    );

    return response.data;

};