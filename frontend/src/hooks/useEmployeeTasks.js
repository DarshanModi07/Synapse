import { useState, useEffect } from 'react';
import { getEmployeeTasks, updateEmployeeItemStatus } from '../services/employee.service';

export const useEmployeeTasks = () => {
    const [tasksData, setTasksData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await getEmployeeTasks();
            if (res.success) {
                setTasksData(res.data);
            } else {
                setError(res.message || "Failed to fetch tasks.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error fetching tasks.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (type, itemId, status, progress, actualHours) => {
        try {
            const res = await updateEmployeeItemStatus(type, itemId, status, progress, actualHours);
            if (res.success) {
                await fetchTasks();
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error updating status", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return { tasksData, loading, error, refetch: fetchTasks, updateStatus };
};
