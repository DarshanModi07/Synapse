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
        const previousData = tasksData;

        if (type === 'workitem') {
            setTasksData(prev => {
                if (!prev || !prev.subTasks) return prev;
                const newData = { ...prev };
                newData.subTasks = (newData.subTasks || []).map(st => {
                    const hasWorkItem = (st.workItems || []).find(wi => wi.id === itemId);
                    if (!hasWorkItem) return st;

                    const updatedWorkItems = (st.workItems || []).map(wi => {
                        if (wi.id === itemId) {
                            return { 
                                ...wi, 
                                ...(status !== undefined && { status }), 
                                ...(actualHours !== undefined && { actualHours: Number(actualHours) }) 
                            };
                        }
                        return wi;
                    });

                    const total = updatedWorkItems.length;
                    const completed = updatedWorkItems.filter(wi => wi.status === 'done').length;
                    const newProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
                    
                    let newSubTaskStatus = st.status;
                    if (newProgress === 100) {
                        newSubTaskStatus = 'in_review';
                    } else if (newProgress > 0 && newProgress < 100 && st.status === 'todo') {
                        newSubTaskStatus = 'in_progress';
                    } else if (newProgress < 100 && st.status === 'in_review') {
                        newSubTaskStatus = 'in_progress';
                    }

                    return {
                        ...st,
                        workItems: updatedWorkItems,
                        progress: newProgress,
                        status: newSubTaskStatus
                    };
                });
                return newData;
            });
        }

        try {
            const res = await updateEmployeeItemStatus(type, itemId, status, progress, actualHours);
            if (res.success) {
                return true;
            } else {
                setTasksData(previousData);
                return false;
            }
        } catch (err) {
            console.error("Error updating status", err);
            setTasksData(previousData);
            throw err;
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return { tasksData, loading, error, refetch: fetchTasks, updateStatus };
};
