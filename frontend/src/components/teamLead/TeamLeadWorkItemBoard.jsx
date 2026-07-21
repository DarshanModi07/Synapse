import React, { useState } from 'react';
import { Sparkles, Plus, Loader2, CheckCircle, Clock, Pencil, Trash } from 'lucide-react';

const TeamLeadWorkItemBoard = ({ 
  subTask, 
  onCreateWorkItem, 
  onBulkCreateWorkItems,
  onUpdateWorkItem,
  onDeleteWorkItem,
  onGenerateAI,
  aiLoading,
  aiSuggestions,
  clearAiSuggestions,
  removeAiSuggestion
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', estimatedHours: '' });
  const [selectedSuggestions, setSelectedSuggestions] = useState(new Set());
  
  // Edit State
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', estimatedHours: '' });

  if (!subTask) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateWorkItem(subTask.id, formData);
    setShowAddForm(false);
    setFormData({ title: '', description: '', estimatedHours: '' });
  };

  const openEdit = (wi) => {
    setEditingItem(wi.id);
    setEditFormData({ 
      title: wi.title, 
      description: wi.description || '', 
      estimatedHours: wi.estimatedHours || '' 
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onUpdateWorkItem(editingItem, {
      title: editFormData.title,
      description: editFormData.description,
      estimatedHours: editFormData.estimatedHours
    });
    setEditingItem(null);
  };

  const toggleSuggestion = (title) => {
    const next = new Set(selectedSuggestions);
    if (next.has(title)) next.delete(title);
    else next.add(title);
    setSelectedSuggestions(next);
  };

  const handleBulkApproveAI = async () => {
    try {
      if (selectedSuggestions.size === 0) return;
      const itemsToCreate = (aiSuggestions?.data || []).filter(sg => selectedSuggestions.has(sg.title));
      await onBulkCreateWorkItems(subTask.id, itemsToCreate);
      clearAiSuggestions();
      setSelectedSuggestions(new Set());
    } catch (err) {
      console.error("Bulk create error:", err);
    }
  };

  return (
    <div className="bg-[#13111C] p-6 rounded-[14px] shadow-sm border border-[#2D2B45] space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b border-[#2D2B45] pb-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#F9FAFB] flex items-center gap-2">
            Work Items for "{subTask.title}"
          </h2>
          <p className="text-[13px] text-[#6B7280] mt-1">Granular hour estimation and micro-tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          {subTask.status !== 'done' && (
            <>
              <button 
                onClick={() => onGenerateAI(subTask.id)}
                disabled={aiLoading}
                className="flex items-center gap-2 px-4 py-2 bg-[#08070F] hover:bg-blue-500/10 text-blue-400 rounded-[8px] border border-[#2D2B45] hover:border-blue-500/50 transition-all font-medium text-[13px] disabled:opacity-50"
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
            </>
          )}
        </div>
      </div>

      {/* AI Suggestions Review Flow */}
      {aiSuggestions && aiSuggestions.type === 'workitems' && aiSuggestions.subTaskId === subTask.id && (
        <div className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-5 mb-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-[14px] font-semibold text-blue-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Generated Work Items
            </h3>
            <button onClick={clearAiSuggestions} className="text-[12px] text-[#6B7280] hover:text-[#F9FAFB]">Dismiss</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(aiSuggestions?.data || []).map((sg, idx) => {
              const isSelected = selectedSuggestions.has(sg.title);
              return (
                <div 
                  key={idx} 
                  onClick={() => toggleSuggestion(sg.title)}
                  className={`p-4 rounded-[8px] border transition-all flex flex-col justify-between cursor-pointer ${isSelected ? 'bg-[#1a1825] border-blue-500/50' : 'bg-[#13111C] border-[#2D2B45] hover:border-blue-500/30'}`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-[13px] font-medium text-[#F9FAFB] pr-2">{sg.title}</h4>
                      <div className={`flex-shrink-0 w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-[#6B7280]'}`}>
                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <p className="text-[12px] text-[#6B7280] mb-3 line-clamp-2">{sg.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto border-t border-[#2D2B45] pt-3">
                    <span className="text-[11px] text-[#6B7280] flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {sg.estimatedHours}h
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleBulkApproveAI}
              disabled={selectedSuggestions.size === 0}
              className="text-[13px] bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-[6px] transition-colors font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Create Selected Work Items
            </button>
          </div>
        </div>
      )}

      {/* Manual Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-5 space-y-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Work Item Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="bg-[#13111C] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <input 
              required type="number" min="1" placeholder="Estimated Hours" value={formData.estimatedHours} onChange={e => setFormData({...formData, estimatedHours: e.target.value})}
              className="bg-[#13111C] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <textarea 
            placeholder="Description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-[#13111C] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-blue-500/50 h-24 resize-none transition-colors"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#F9FAFB]">Cancel</button>
            <button type="submit" className="px-4 py-2 text-[13px] font-medium bg-[#F9FAFB] text-[#08070F] rounded-[6px] transition-colors hover:bg-white/90">Save Work Item</button>
          </div>
        </form>
      )}

      {/* Work Item List */}
      <div className="space-y-3">
        {(!subTask.workItems || subTask.workItems.length === 0) ? (
          <div className="p-8 text-center text-[#6B7280] border border-dashed border-[#2D2B45] rounded-[10px] text-[13px] bg-[#08070F]/50">
            No Work Items logged. Create one manually or use AI.
          </div>
        ) : (
          <div className="border border-[#2D2B45] rounded-[10px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                  <thead>
                      <tr className="bg-[#08070F] border-b border-[#2D2B45]">
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider w-10 text-center">Status</th>
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Work Item</th>
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Est. Hours</th>
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Act. Hours</th>
                          <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D2B45]">
                      {(subTask.workItems || []).map((wi, idx) => (
                          <React.Fragment key={wi.id}>
                              <tr className="hover:bg-[#1a1825] transition-colors bg-[#13111C] group">
                                  <td className="p-4 text-center">
                                  <button 
                                      onClick={() => onUpdateWorkItem(wi.id, { status: wi.status === 'done' ? 'in_progress' : 'done' })}
                                      className="flex justify-center w-full focus:outline-none hover:opacity-80 transition-opacity"
                                  >
                                      {wi.status === 'done' ? (
                                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                                      ) : (
                                          <div className="w-4 h-4 rounded-[4px] border border-[#6B7280] hover:border-emerald-500 transition-colors" />
                                      )}
                                  </button>
                              </td>
                              <td className="p-4">
                                  <h4 className={`text-[13px] font-medium transition-colors ${wi.status === 'done' ? 'text-[#6B7280] line-through' : 'text-[#F9FAFB] group-hover:text-blue-400'}`}>
                                      {wi.title}
                                  </h4>
                                  <p className="text-[11px] text-[#6B7280] mt-0.5 line-clamp-1 max-w-sm">{wi.description}</p>
                              </td>
                              <td className="p-4 text-[13px] text-[#6B7280] text-right font-medium">
                                  {wi.estimatedHours || 0}h
                              </td>
                              <td className="p-4 text-[13px] text-blue-400 text-right font-medium">
                                  {wi.actualHours || 0}h
                              </td>
                              <td className="p-4 text-right">
                                  {subTask.status !== 'done' && (
                                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button 
                                              onClick={() => openEdit(wi)}
                                              className="p-1.5 text-[#6B7280] hover:text-blue-400 hover:bg-blue-400/10 rounded-[6px] transition-colors" 
                                              title="Edit"
                                          >
                                              <Pencil className="w-4 h-4" />
                                          </button>
                                          <button onClick={() => onDeleteWorkItem(wi.id)} className="p-1.5 text-[#6B7280] hover:text-red-400 hover:bg-red-400/10 rounded-[6px] transition-colors" title="Delete">
                                              <Trash className="w-4 h-4" />
                                          </button>
                                      </div>
                                  )}
                              </td>
                          </tr>
                          
                          {/* Edit Form Row */}
                          {editingItem === wi.id && (
                            <tr>
                              <td colSpan="5" className="p-4 bg-[#08070F] border-b border-[#2D2B45]">
                                <form onSubmit={handleSaveEdit} className="space-y-4 max-w-2xl">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                      required type="text" placeholder="Work Item Title" 
                                      value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})}
                                      className="bg-[#13111C] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-blue-500/50"
                                    />
                                    <input 
                                      type="number" placeholder="Estimated Hours" 
                                      value={editFormData.estimatedHours} onChange={e => setEditFormData({...editFormData, estimatedHours: e.target.value})}
                                      className="bg-[#13111C] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-blue-500/50"
                                    />
                                  </div>
                                  <textarea 
                                    placeholder="Description..." 
                                    value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})}
                                    className="w-full bg-[#13111C] border border-[#2D2B45] rounded-[6px] px-3 py-2 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-blue-500/50 h-24 resize-none"
                                  />
                                  <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#F9FAFB]">Cancel</button>
                                    <button type="submit" className="px-4 py-2 text-[13px] font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-[6px] transition-colors">Save Changes</button>
                                  </div>
                                </form>
                              </td>
                            </tr>
                          )}
                          </React.Fragment>
                      ))}
                  </tbody>
              </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamLeadWorkItemBoard;
