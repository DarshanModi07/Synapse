import api from '@/api/axios';

export const getEmployeeDashboard = async () => {
    const response = await api.get('/employee/dashboard');
    return response.data;
};

export const getEmployeeTasks = async () => {
    const response = await api.get('/employee/tasks');
    return response.data;
};

export const getEmployeeAnalytics = async () => {
    const response = await api.get('/employee/analytics');
    return response.data;
};

export const updateEmployeeItemStatus = async (type, itemId, status, progress, actualHours) => {
    const response = await api.put(`/employee/${type}/${itemId}/status`, {
        status,
        progress,
        actualHours
    });
    return response.data;
};
