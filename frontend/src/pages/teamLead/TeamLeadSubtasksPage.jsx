import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { theme } from '@/lib/theme';
import teamLeadService from '@/services/teamLead.service';
import teamLeadProjectService from '@/services/teamLeadProject.service';

import TeamLeadOverviewCards from '@/components/teamLead/TeamLeadOverviewCards';
import TeamLeadSubtaskFilters from '@/components/teamLead/TeamLeadSubtaskFilters';
import TeamLeadSubtaskTable from '@/components/teamLead/TeamLeadSubtaskTable';
import TeamLeadSubtaskCard from '@/components/teamLead/TeamLeadSubtaskCard';
import TeamLeadDeadlineCard from '@/components/teamLead/TeamLeadDeadlineCard';
import TeamLeadWorkItemBoard from '@/components/teamLead/TeamLeadWorkItemBoard';

const TeamLeadSubtasksPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const clearAiSuggestions = () => setAiSuggestions(null);
  
  const removeAiSuggestion = (title) => {
    setAiSuggestions(prev => {
      if (!prev || !prev.data) return prev;
      return { ...prev, data: prev.data.filter(s => s.title !== title) };
    });
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await teamLeadService.getMySubtasks();
      setData(res);
    } catch (error) {
      showToast('Failed to fetch your subtasks.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSubtasks = useMemo(() => {
    if (!data?.subtasks) return [];
    
    return data.subtasks.filter((subtask) => {
      const matchesSearch = 
        subtask.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subtask.project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subtask.task?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || subtask.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  // Work Item Handlers
  const handleCreateWorkItem = async (subTaskId, workItemData) => {
    try {
      const newWorkItem = await teamLeadProjectService.createWorkItem(subTaskId, workItemData);
      
      setSelectedSubtask(prev => {
        if (!prev) return prev;
        const newWorkItems = [...(prev.workItems || []), newWorkItem];
        const total = newWorkItems.length;
        const completed = newWorkItems.filter(wi => wi.status === 'done').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : prev.progress;
        return {
          ...prev,
          workItemsCount: prev.workItemsCount + 1,
          workItems: newWorkItems,
          progress
        };
      });

      setData(prev => {
        if (!prev || !prev.subtasks) return prev;
        return {
          ...prev,
          subtasks: prev.subtasks.map(st => {
            if (st.id === subTaskId) {
              const newWorkItems = [...(st.workItems || []), newWorkItem];
              const total = newWorkItems.length;
              const completed = newWorkItems.filter(wi => wi.status === 'done').length;
              const progress = total > 0 ? Math.round((completed / total) * 100) : st.progress;
              return {
                ...st,
                workItemsCount: st.workItemsCount + 1,
                workItems: newWorkItems,
                progress
              };
            }
            return st;
          })
        };
      });

      showToast('Work item created successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create work item', 'error');
    }
  };

  const handleBulkCreateWorkItems = async (subTaskId, workItemsData) => {
    try {
      const createdWorkItems = await teamLeadProjectService.createBulkWorkItems(subTaskId, { workItems: workItemsData });
      
      setSelectedSubtask(prev => {
        if (!prev) return prev;
        const newWorkItems = [...(prev.workItems || []), ...createdWorkItems];
        const total = newWorkItems.length;
        const completed = newWorkItems.filter(wi => wi.status === 'done').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : prev.progress;
        return {
          ...prev,
          workItemsCount: prev.workItemsCount + createdWorkItems.length,
          workItems: newWorkItems,
          progress
        };
      });

      setData(prev => {
        if (!prev || !prev.subtasks) return prev;
        return {
          ...prev,
          subtasks: prev.subtasks.map(st => {
            if (st.id === subTaskId) {
              const newWorkItems = [...(st.workItems || []), ...createdWorkItems];
              const total = newWorkItems.length;
              const completed = newWorkItems.filter(wi => wi.status === 'done').length;
              const progress = total > 0 ? Math.round((completed / total) * 100) : st.progress;
              return {
                ...st,
                workItemsCount: st.workItemsCount + createdWorkItems.length,
                workItems: newWorkItems,
                progress
              };
            }
            return st;
          })
        };
      });

      showToast(`${createdWorkItems.length} work items created successfully`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to bulk create work items', 'error');
    }
  };

  const handleUpdateWorkItem = async (workItemId, updates) => {
    // 1. Snapshot previous state for rollback
    const prevSelectedSubtask = selectedSubtask;
    const prevData = data;

    let optimisticWorkItem = null;

    // 2. Optimistic Update
    setSelectedSubtask(prev => {
      if (!prev) return prev;
      const newWorkItems = (prev.workItems || []).map(wi => {
        if (wi.id === workItemId) {
          optimisticWorkItem = { ...wi, ...updates };
          return optimisticWorkItem;
        }
        return wi;
      });
      const total = newWorkItems.length;
      const completed = newWorkItems.filter(wi => wi.status === 'done').length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : prev.progress;
      
      let status = prev.status;
      if (progress === 100 && prev.status !== 'done') status = 'in_review';
      else if (progress > 0 && progress < 100 && prev.status === 'todo') status = 'in_progress';
      
      return { ...prev, workItems: newWorkItems, progress, status };
    });

    setData(prev => {
      if (!prev || !prev.subtasks) return prev;
      return {
        ...prev,
        subtasks: prev.subtasks.map(st => {
          const hasItem = (st.workItems || []).some(wi => wi.id === workItemId);
          if (!hasItem) return st;
          
          const newWorkItems = (st.workItems || []).map(wi => 
            wi.id === workItemId ? (optimisticWorkItem || { ...wi, ...updates }) : wi
          );
          const total = newWorkItems.length;
          const completed = newWorkItems.filter(wi => wi.status === 'done').length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : st.progress;
          
          let status = st.status;
          if (progress === 100 && st.status !== 'done') status = 'in_review';
          else if (progress > 0 && progress < 100 && st.status === 'todo') status = 'in_progress';
          
          return { ...st, workItems: newWorkItems, progress, status };
        })
      };
    });

    // 3. API Call
    try {
      await teamLeadProjectService.updateWorkItem(workItemId, updates);
      showToast('Work item updated');
    } catch (err) {
      // 4. Rollback on error
      setSelectedSubtask(prevSelectedSubtask);
      setData(prevData);
      showToast(err.response?.data?.message || 'Failed to update work item', 'error');
    }
  };

  const handleDeleteWorkItem = async (workItemId) => {
    try {
      await teamLeadProjectService.deleteWorkItem(workItemId);
      
      setSelectedSubtask(prev => {
        if (!prev) return prev;
        const newWorkItems = (prev.workItems || []).filter(wi => wi.id !== workItemId);
        const total = newWorkItems.length;
        const completed = newWorkItems.filter(wi => wi.status === 'done').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          ...prev,
          workItemsCount: Math.max(0, prev.workItemsCount - 1),
          workItems: newWorkItems,
          progress
        };
      });

      setData(prev => {
        if (!prev || !prev.subtasks) return prev;
        return {
          ...prev,
          subtasks: prev.subtasks.map(st => {
            const hasWorkItem = (st.workItems || []).some(wi => wi.id === workItemId);
            if (!hasWorkItem) return st;
            const newWorkItems = (st.workItems || []).filter(wi => wi.id !== workItemId);
            const total = newWorkItems.length;
            const completed = newWorkItems.filter(wi => wi.status === 'done').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            return {
              ...st,
              workItemsCount: Math.max(0, st.workItemsCount - 1),
              workItems: newWorkItems,
              progress
            };
          })
        };
      });

      showToast('Work item deleted');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete work item', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-purple-400 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-sm font-medium">Loading your subtasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 relative">
      {toastMessage && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-[8px] shadow-lg border flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 ${toastMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-[13px] font-medium">{toastMessage.message}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Subtasks</h1>
          <p className="text-gray-400">Manage and complete subtasks assigned directly to you.</p>
        </div>
      </div>

      <TeamLeadOverviewCards stats={data} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <TeamLeadSubtaskFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <TeamLeadSubtaskTable 
            subtasks={filteredSubtasks} 
            onSubtaskClick={(st) => setSelectedSubtask(st)}
          />

          {/* Grid fallback view for mobile */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {filteredSubtasks.map((st) => (
              <TeamLeadSubtaskCard 
                key={st.id} 
                subtask={st} 
                onClick={(s) => setSelectedSubtask(s)}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <TeamLeadDeadlineCard subtasks={data?.subtasks} />
        </div>
      </div>

      {/* Modal for Work Items */}
      {selectedSubtask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto premium-scrollbar rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl">
            <button
              onClick={() => setSelectedSubtask(null)}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="p-6 pt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedSubtask.title}</h2>
                <p className="text-gray-400 mt-2">{selectedSubtask.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Project</span>
                    <span className="text-gray-200 font-medium">{selectedSubtask.project?.name || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Task</span>
                    <span className="text-gray-200 font-medium">{selectedSubtask.task?.title || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Status</span>
                    <span className="text-purple-400 font-medium uppercase">{selectedSubtask.status.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              <TeamLeadWorkItemBoard 
                subTask={selectedSubtask}
                onCreateWorkItem={handleCreateWorkItem}
                onBulkCreateWorkItems={handleBulkCreateWorkItems}
                onUpdateWorkItem={handleUpdateWorkItem}
                onDeleteWorkItem={handleDeleteWorkItem}
                onGenerateAI={async (subTaskId) => {
                  try {
                    setAiLoading(true);
                    const res = await teamLeadProjectService.generateWorkItemsAI(subTaskId);
                    setAiSuggestions({ type: 'workitems', subTaskId, data: res.workItems });
                    showToast("AI Generation successful");
                  } catch(err) {
                    showToast("Failed to generate work items", "error");
                  } finally {
                    setAiLoading(false);
                  }
                }}
                aiLoading={aiLoading}
                aiSuggestions={aiSuggestions}
                clearAiSuggestions={clearAiSuggestions}
                removeAiSuggestion={removeAiSuggestion}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLeadSubtasksPage;
