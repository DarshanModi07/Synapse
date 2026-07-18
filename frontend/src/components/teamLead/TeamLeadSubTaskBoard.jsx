import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, PlayCircle, Loader2, CheckCircle, Clock3, Pencil, Trash, XCircle, Ban, AlertCircle } from 'lucide-react';

const TeamLeadSubTaskBoard = ({ 
  task, 
  members, 
  onCreateSubTask, 
  onUpdateSubTask,
  onGenerateAI,
  aiLoading,
  aiSuggestions,
  removeAiSuggestion,
  onWorkItemClick,
  onApproveSubTask,
  onRejectSubTask,
  onDeleteSubTask
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', assignedToId: '' });
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [reviewComments, setReviewComments] = useState('');

  // Modals state
  const [editModalData, setEditModalData] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  if (!task) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateSubTask(task.id, formData);
    setShowAddForm(false);
    setFormData({ title: '', description: '', priority: 'medium', assignedToId: '' });
  };

  const handleApproveAI = async (suggestion) => {
    try {
      await onCreateSubTask(task.id, {
        title: suggestion.title,
        description: suggestion.description,
        priority: suggestion.priority,
        assignedToId: formData.assignedToId
      });
      if (removeAiSuggestion) {
        removeAiSuggestion(suggestion.title);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to approve AI suggestion.", "error");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("=== UI TRACE: EDIT SUBMIT ===");
    console.log({
      selectedSubTaskId: editModalData.id,
      currentSubTask: editModalData,
      allSubTasks: task.subtasks,
      matchVerified: editModalData.id === task.subtasks.find(st => st.id === editModalData.id)?.id
    });
    
    setIsSubmitting(true);
    try {
      await onUpdateSubTask(editModalData.id, editModalData);
      showToast("SubTask updated successfully.");
      setEditModalData(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update SubTask.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    console.log("=== UI TRACE: DELETE CONFIRM ===");
    console.log({
      selectedSubTaskId: deleteModalId,
      currentSubTask: task.subtasks.find(st => st.id === deleteModalId),
      allSubTasks: task.subtasks,
      matchVerified: deleteModalId === task.subtasks.find(st => st.id === deleteModalId)?.id
    });

    setIsSubmitting(true);
    try {
      await onDeleteSubTask(deleteModalId);
      showToast("SubTask deleted successfully.");
      setDeleteModalId(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete SubTask.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#13111C] p-6 rounded-[14px] shadow-sm border border-[#2D2B45] space-y-6 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-4 right-4 px-4 py-3 rounded-[8px] shadow-lg border flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-[13px] font-medium">{toast.message}</span>
        </div>
      )}
      
      {/* Header */}
      <div className="flex justify-between items-start border-b border-[#2D2B45] pb-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#F9FAFB] flex items-center gap-2">
            SubTasks for "{task.title}"
          </h2>
          <p className="text-[13px] text-[#6B7280] mt-1">Manage granular assignments and generate plans using AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onGenerateAI(task.id)}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#08070F] hover:bg-purple-500/10 text-purple-400 rounded-[8px] border border-[#2D2B45] hover:border-purple-500/50 transition-all font-medium text-[13px] disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate with AI
          </button>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#08070F] hover:bg-[#1a1825] text-[#F9FAFB] rounded-[8px] border border-[#2D2B45] transition-all font-medium text-[13px]"
          >
            <Plus className="w-4 h-4" /> Add Manual
          </button>
        </div>
      </div>

      {/* AI Suggestions Review Flow */}
      {aiSuggestions && aiSuggestions.type === 'subtasks' && aiSuggestions.taskId === task.id && (
        <div className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-5 mb-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-[14px] font-semibold text-purple-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Generated Plan
            </h3>
            <button onClick={() => removeAiSuggestion(null)} className="text-[12px] text-[#6B7280] hover:text-[#F9FAFB]">Dismiss</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(aiSuggestions?.data || []).map((sg, idx) => (
              <div key={idx} className="p-4 bg-[#08070F] border border-purple-500/20 rounded-[10px] relative overflow-hidden group transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[13px] font-medium text-[#F9FAFB]">{sg.title}</h4>
                  <span className="text-[11px] uppercase text-[#6B7280]">
                    {sg.priority}
                  </span>
                </div>
                <p className="text-[12px] text-[#6B7280] mb-3">{sg.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#6B7280]">Est: {sg.estimatedHours}h</span>
                  <button 
                    onClick={() => handleApproveAI(sg)}
                    className="text-[12px] bg-[#08070F] hover:bg-[#1a1825] text-[#F9FAFB] border border-[#2D2B45] px-3 py-1.5 rounded-[6px] transition-colors font-medium flex items-center gap-1 hover:border-emerald-500/30"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-5 space-y-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="SubTask Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="bg-[#13111C] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            <select 
              value={formData.assignedToId} onChange={e => setFormData({...formData, assignedToId: e.target.value})}
              className="bg-[#13111C] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#6B7280] focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="">Unassigned</option>
              {(members || []).filter(m => m.teamName === task.teamName).map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <textarea 
            placeholder="Description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-[#13111C] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-purple-500/50 h-24 resize-none transition-colors"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#F9FAFB]">Cancel</button>
            <button type="submit" className="px-4 py-2 text-[13px] font-medium bg-[#F9FAFB] text-[#08070F] rounded-[6px] transition-colors hover:bg-white/90">Save SubTask</button>
          </div>
        </form>
      )}

      {/* SubTask List */}
      <div className="space-y-3">
        {(!task.subtasks || task.subtasks.length === 0) ? (
          <div className="p-8 text-center text-[#6B7280] border border-dashed border-[#2D2B45] rounded-[10px] text-[13px] bg-[#08070F]/50">
            No SubTasks found. Create one manually or use AI to generate a plan.
          </div>
        ) : (
          <div className="border border-[#2D2B45] rounded-[10px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                  <thead>
                      <tr className="bg-[#08070F] border-b border-[#2D2B45]">
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider w-10 text-center">Status</th>
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Subtask</th>
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Assignee</th>
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Work Items</th>
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D2B45]">
                      {(task.subtasks || []).map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C] group">
                              <td className="p-4 text-center">
                                  <span className={`px-2 py-1 rounded-[4px] text-[11px] font-medium border ${
                                      sub.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                      sub.status === 'in_review' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                      sub.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                  }`}>
                                      {sub.status === 'in_review' ? 'Ready For Review' : sub.status === 'done' ? 'Completed' : sub.status.replace('_', ' ')}
                                  </span>
                              </td>
                              <td className={`p-4 text-[13px] font-medium max-w-[200px] truncate transition-colors ${sub.status === 'done' ? 'text-[#6B7280] line-through' : 'text-[#F9FAFB] group-hover:text-purple-400'}`}>
                                  {sub.title}
                              </td>
                              <td className="p-4 text-[13px] font-medium text-[#6B7280]">
                                  {sub.assignedTo ? sub.assignedTo.name : 'Unassigned'}
                              </td>
                              <td className="p-4 text-[13px] font-medium text-[#6B7280]">
                                  {sub.workItems?.length || 0} items
                              </td>
                              <td className="p-4 text-right flex flex-col items-end gap-2">
                                  {sub.status === 'in_review' && (
                                      <div className="flex items-center gap-2">
                                          <button 
                                              onClick={() => onApproveSubTask(sub.id)}
                                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-[6px] text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                                          >
                                              <CheckCircle className="w-3 h-3" /> Approve
                                          </button>
                                          <button 
                                              onClick={() => setShowRejectModal(sub.id)}
                                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-[6px] text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                                          >
                                              <XCircle className="w-3 h-3" /> Reject
                                          </button>
                                      </div>
                                  )}
                                  
                                  <div className="flex items-center gap-2">
                                      {(sub.status === 'todo' || sub.status === 'in_progress') && (
                                          <>
                                              <button onClick={() => setEditModalData(sub)} className="p-1.5 text-[#6B7280] hover:text-blue-400 hover:bg-blue-400/10 rounded-[6px] transition-colors" title="Edit">
                                                  <Pencil className="w-4 h-4" />
                                              </button>
                                              {sub.status === 'todo' && (
                                                  <button onClick={() => setDeleteModalId(sub.id)} className="p-1.5 text-[#6B7280] hover:text-red-400 hover:bg-red-400/10 rounded-[6px] transition-colors" title="Delete">
                                                      <Trash className="w-4 h-4" />
                                                  </button>
                                              )}
                                              {sub.status === 'in_progress' && (
                                                  <button 
                                                    onClick={async () => {
                                                        try {
                                                            await onUpdateSubTask(sub.id, { status: 'cancelled' });
                                                            showToast("SubTask cancelled.");
                                                        } catch(e) {
                                                            showToast("Failed to cancel SubTask.", "error");
                                                        }
                                                    }}
                                                    className="p-1.5 text-[#6B7280] hover:text-orange-400 hover:bg-orange-400/10 rounded-[6px] transition-colors" title="Cancel">
                                                      <Ban className="w-4 h-4" />
                                                  </button>
                                              )}
                                          </>
                                      )}
                                      
                                      <button 
                                          onClick={() => onWorkItemClick(sub)}
                                          className="px-3 py-1.5 bg-[#08070F] hover:bg-[#1a1825] text-[#F9FAFB] border border-[#2D2B45] rounded-[6px] text-[11px] font-medium transition-colors inline-flex items-center gap-1 hover:border-purple-500/50"
                                      >
                                          Track <PlayCircle className="w-3 h-3 text-purple-400" />
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        )}
      </div>

      {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] p-6 w-full max-w-md shadow-2xl">
                  <h3 className="text-[16px] font-semibold text-[#F9FAFB] mb-2">Reject SubTask</h3>
                  <p className="text-[13px] text-[#6B7280] mb-4">Provide review comments for the employee.</p>
                  <textarea 
                      className="w-full bg-[#08070F] border border-[#2D2B45] rounded-[8px] p-3 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-red-500/50 resize-none h-24 mb-4"
                      placeholder="Why is this being rejected?"
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                  />
                  <div className="flex justify-end gap-3">
                      <button 
                          onClick={() => { setShowRejectModal(null); setReviewComments(''); }}
                          className="px-4 py-2 text-[13px] text-[#6B7280] hover:text-[#F9FAFB] transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={() => {
                              onRejectSubTask(showRejectModal, reviewComments);
                              setShowRejectModal(null);
                              setReviewComments('');
                          }}
                          disabled={!reviewComments.trim()}
                          className="px-4 py-2 text-[13px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-[8px] transition-colors disabled:opacity-50"
                      >
                          Submit Rejection
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] p-6 w-full max-w-sm shadow-2xl">
                  <div className="flex items-center gap-3 text-red-400 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="text-[16px] font-semibold">Delete SubTask</h3>
                  </div>
                  <p className="text-[13px] text-[#6B7280] mb-6">Are you sure you want to delete this subtask? This action cannot be undone.</p>
                  
                  <div className="flex justify-end gap-3">
                      <button 
                          onClick={() => setDeleteModalId(null)}
                          disabled={isSubmitting}
                          className="px-4 py-2 text-[13px] text-[#6B7280] hover:text-[#F9FAFB] transition-colors disabled:opacity-50"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleDeleteConfirm}
                          disabled={isSubmitting}
                          className="px-4 py-2 text-[13px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-[8px] transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                          {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                          Confirm Delete
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Edit Modal */}
      {editModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] p-6 w-full max-w-lg shadow-2xl">
                  <h3 className="text-[16px] font-semibold text-[#F9FAFB] mb-4">Edit SubTask</h3>
                  
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input 
                              required type="text" placeholder="SubTask Title" value={editModalData.title} onChange={e => setEditModalData({...editModalData, title: e.target.value})}
                              className="bg-[#08070F] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-purple-500/50 transition-colors"
                          />
                          <select 
                              value={editModalData.assignedToId || ''} onChange={e => setEditModalData({...editModalData, assignedToId: e.target.value})}
                              className="bg-[#08070F] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#6B7280] focus:outline-none focus:border-purple-500/50 transition-colors"
                          >
                              <option value="">Unassigned</option>
                              {(members || []).filter(m => m.teamName === task.teamName).map(m => (
                                  <option key={m.id} value={m.id}>{m.name}</option>
                              ))}
                          </select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <select 
                              value={editModalData.priority} onChange={e => setEditModalData({...editModalData, priority: e.target.value})}
                              className="bg-[#08070F] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#6B7280] focus:outline-none focus:border-purple-500/50 transition-colors"
                          >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                          </select>
                          <input 
                              type="date" value={editModalData.dueDate ? editModalData.dueDate.split('T')[0] : ''} onChange={e => setEditModalData({...editModalData, dueDate: e.target.value})}
                              className="bg-[#08070F] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#6B7280] focus:outline-none focus:border-purple-500/50 transition-colors"
                          />
                      </div>

                      <textarea 
                          placeholder="Description..." value={editModalData.description} onChange={e => setEditModalData({...editModalData, description: e.target.value})}
                          className="w-full bg-[#08070F] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-purple-500/50 h-24 resize-none transition-colors"
                      />
                      
                      <div className="flex justify-end gap-3 mt-6 border-t border-[#2D2B45] pt-4">
                          <button 
                              type="button"
                              onClick={() => setEditModalData(null)}
                              disabled={isSubmitting}
                              className="px-4 py-2 text-[13px] text-[#6B7280] hover:text-[#F9FAFB] transition-colors disabled:opacity-50"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              disabled={isSubmitting}
                              className="px-4 py-2 text-[13px] font-medium bg-[#F9FAFB] text-[#08070F] hover:bg-white/90 rounded-[8px] transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                              {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                              Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default TeamLeadSubTaskBoard;
