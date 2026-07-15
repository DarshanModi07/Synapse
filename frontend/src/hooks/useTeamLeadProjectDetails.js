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

  const handleCreateSubTask = async (taskId, payload) => {
    await teamLeadProjectService.createSubTask(taskId, payload);
    fetchDetails(); // Refresh Command Center
  };
  
  const handleUpdateSubTask = async (subTaskId, payload) => {
    await teamLeadProjectService.updateSubTask(subTaskId, payload);
    fetchDetails();
  };

  const handleCreateWorkItem = async (subTaskId, payload) => {
    await teamLeadProjectService.createWorkItem(subTaskId, payload);
    fetchDetails();
  };
  
  const handleUpdateWorkItem = async (workItemId, payload) => {
    await teamLeadProjectService.updateWorkItem(workItemId, payload);
    fetchDetails();
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
    handleCreateSubTask,
    handleUpdateSubTask,
    handleCreateWorkItem,
    handleUpdateWorkItem
  };
};
