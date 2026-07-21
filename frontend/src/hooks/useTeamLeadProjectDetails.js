import { useState, useEffect, useCallback } from "react";
import teamLeadProjectService from "../services/teamLeadProject.service";

export const useTeamLeadProjectDetails = (projectId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI Loading States
  const [aiLoading, setAiLoading] = useState({ subtasks: false, workitems: false });
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await teamLeadProjectService.getProjectDetails(projectId);
      setData(res || null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load project details");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) fetchDetails();
  }, [fetchDetails, projectId]);

  // Generators
  const handleGenerateAISubTasks = async (taskId) => {
    try {
      setAiLoading({ ...aiLoading, subtasks: true });
      const res = await teamLeadProjectService.generateSubTasksAI(taskId);
      setAiSuggestions({ type: 'subtasks', taskId, data: res.subtasks });
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI Subtasks");
    } finally {
      setAiLoading({ ...aiLoading, subtasks: false });
    }
  };

  const handleGenerateAIWorkItems = async (subTaskId) => {
    try {
      setAiLoading({ ...aiLoading, workitems: true });
      const res = await teamLeadProjectService.generateWorkItemsAI(subTaskId);
      setAiSuggestions({ type: 'workitems', subTaskId, data: res.workItems });
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI Work Items");
    } finally {
      setAiLoading({ ...aiLoading, workitems: false });
    }
  };

  const clearAiSuggestions = () => setAiSuggestions(null);

  const removeAiSuggestion = (title) => {
    setAiSuggestions(prev => {
      if (!prev || !prev.data) return prev;
      return { ...prev, data: prev.data.filter(s => s.title !== title) };
    });
  };

  const handleCreateSubTask = async (taskId, payload) => {
    try {
      const newSubTask = await teamLeadProjectService.createSubTask(taskId, payload);
      setData(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        newData.projectTeams = (newData.projectTeams || []).map(pt => ({
          ...pt,
          tasks: (pt.tasks || []).map(t => {
            if (t.id === taskId) {
              return { ...t, subtasks: [...(t.subtasks || []), newSubTask] };
            }
            return t;
          })
        }));
        return newData;
      });
      return newSubTask;
    } catch (err) {
      console.error("Failed to create SubTask", err);
      throw err;
    }
  };
  
  const handleUpdateSubTask = async (subTaskId, updates) => {
    try {
      const updatedSubTask = await teamLeadProjectService.updateSubTask(subTaskId, updates);

      setData(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        newData.projectTeams = (newData.projectTeams || []).map(pt => ({
          ...pt,
          tasks: (pt.tasks || []).map(t => ({
            ...t,
            subtasks: (t.subtasks || []).map(st => st.id === subTaskId ? { ...st, ...updatedSubTask } : st)
          }))
        }));
        return newData;
      });
      return updatedSubTask;
    } catch (err) {
      console.error("Failed to update SubTask", err);
      throw err;
    }
  };

  const handleDeleteSubTask = async (subTaskId) => {
    try {
      const response = await teamLeadProjectService.deleteSubTask(subTaskId);

      // We can use response.deletedId if returned, otherwise fallback to subTaskId
      const idToRemove = response?.deletedId || subTaskId;

      setData(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        newData.projectTeams = (newData.projectTeams || []).map(pt => ({
          ...pt,
          tasks: (pt.tasks || []).map(t => ({
            ...t,
            subtasks: (t.subtasks || []).filter(st => st.id !== idToRemove)
          }))
        }));
        return newData;
      });
      return true;
    } catch (err) {
      console.error("Failed to delete SubTask", err);
      throw err;
    }
  };

  const handleApproveSubTask = async (subTaskId) => {
    try {
      const updatedSubTask = await teamLeadProjectService.approveSubTask(subTaskId);
      setData(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        newData.projectTeams = (newData.projectTeams || []).map(pt => ({
          ...pt,
          tasks: (pt.tasks || []).map(t => ({
            ...t,
            subtasks: (t.subtasks || []).map(st => st.id === subTaskId ? updatedSubTask : st)
          }))
        }));
        return newData;
      });
      return updatedSubTask;
    } catch (err) {
      console.error("Failed to approve SubTask", err);
      throw err;
    }
  };

  const handleRejectSubTask = async (subTaskId, reviewComments) => {
    try {
      const updatedSubTask = await teamLeadProjectService.rejectSubTask(subTaskId, { reviewComments });
      setData(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        newData.projectTeams = (newData.projectTeams || []).map(pt => ({
          ...pt,
          tasks: (pt.tasks || []).map(t => ({
            ...t,
            subtasks: (t.subtasks || []).map(st => st.id === subTaskId ? updatedSubTask : st)
          }))
        }));
        return newData;
      });
      return updatedSubTask;
    } catch (err) {
      console.error("Failed to reject SubTask", err);
      throw err;
    }
  };

  const handleCreateWorkItem = async (subTaskId, payload) => {
    try {
      const newWorkItem = await teamLeadProjectService.createWorkItem(subTaskId, payload);
      setData(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        newData.projectTeams = (newData.projectTeams || []).map(pt => ({
          ...pt,
          tasks: (pt.tasks || []).map(t => ({
            ...t,
            subtasks: (t.subtasks || []).map(st => {
              if (st.id === subTaskId) {
                return { ...st, workItems: [...(st.workItems || []), newWorkItem] };
              }
              return st;
            })
          }))
        }));
        return newData;
      });
      return newWorkItem;
    } catch (err) {
      console.error("Failed to create Work Item", err);
      throw err;
    }
  };

  const handleBulkCreateWorkItems = async (subTaskId, payload) => {
    try {
      const createdWorkItems = await teamLeadProjectService.createBulkWorkItems(subTaskId, { workItems: payload });
      setData(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        newData.projectTeams = (newData.projectTeams || []).map(pt => ({
          ...pt,
          tasks: (pt.tasks || []).map(t => ({
            ...t,
            subtasks: (t.subtasks || []).map(st => {
              if (st.id === subTaskId) {
                return { ...st, workItems: [...(st.workItems || []), ...createdWorkItems] };
              }
              return st;
            })
          }))
        }));
        return newData;
      });
      return createdWorkItems;
    } catch (err) {
      console.error("Failed to bulk create WorkItems", err);
      throw err;
    }
  };
  
  const handleUpdateWorkItem = async (workItemId, payload) => {
    try {
      const updatedWorkItem = await teamLeadProjectService.updateWorkItem(workItemId, payload);
      setData(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        newData.projectTeams = (newData.projectTeams || []).map(pt => ({
          ...pt,
          tasks: (pt.tasks || []).map(t => ({
            ...t,
            subtasks: (t.subtasks || []).map(st => ({
              ...st,
              workItems: (st.workItems || []).map(wi => wi.id === workItemId ? updatedWorkItem : wi)
            }))
          }))
        }));
        return newData;
      });
      return updatedWorkItem;
    } catch (err) {
      console.error("Failed to update Work Item", err);
      throw err;
    }
  };

  const handleDeleteWorkItem = async (workItemId) => {
    try {
      await teamLeadProjectService.deleteWorkItem(workItemId);
      setData(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        newData.projectTeams = (newData.projectTeams || []).map(pt => ({
          ...pt,
          tasks: (pt.tasks || []).map(t => ({
            ...t,
            subtasks: (t.subtasks || []).map(st => ({
              ...st,
              workItems: (st.workItems || []).filter(wi => wi.id !== workItemId)
            }))
          }))
        }));
        return newData;
      });
      return true;
    } catch (err) {
      console.error("Failed to delete Work Item", err);
      throw err;
    }
  };

  return { 
    data, 
    loading, 
    error,
    refresh: fetchDetails,
    aiLoading,
    aiSuggestions,
    handleGenerateAISubTasks,
    handleGenerateAIWorkItems,
    clearAiSuggestions,
    removeAiSuggestion,
    handleCreateSubTask,
    handleUpdateSubTask,
    handleDeleteSubTask,
    handleApproveSubTask,
    handleRejectSubTask,
    handleCreateWorkItem,
    handleBulkCreateWorkItems,
    handleUpdateWorkItem,
    handleDeleteWorkItem
  };
};
