import React, { useState } from 'react';
import { Sparkles, Plus, Loader2, CheckCircle, Clock } from 'lucide-react';

const TeamLeadWorkItemBoard = ({ 
  subTask, 
  onCreateWorkItem, 
  onUpdateWorkItem,
  onGenerateAI,
  aiLoading,
  aiSuggestions,
  clearAiSuggestions
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', estimatedHours: '' });

  if (!subTask) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateWorkItem(subTask.id, formData);
    setShowAddForm(false);
    setFormData({ title: '', description: '', estimatedHours: '' });
  };

  const handleApproveAI = async (suggestion) => {
    await onCreateWorkItem(subTask.id, {
      title: suggestion.title,
      description: suggestion.description,
      estimatedHours: suggestion.estimatedHours
    });
  };

  return (
    <div className="bg-[#0D0D12]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            Work Items for "{subTask.title}"
          </h2>
          <p className="text-sm text-gray-400 mt-1">Granular hour estimation and micro-tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onGenerateAI(subTask.id)}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 text-blue-300 rounded-xl border border-blue-500/30 transition-all font-medium text-sm disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate with AI
          </button>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Add Manual
          </button>
        </div>
      </div>

      {/* AI Suggestions Review Flow */}
      {aiSuggestions && aiSuggestions.type === 'workitems' && aiSuggestions.subTaskId === subTask.id && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold text-blue-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Generated Work Items
            </h3>
            <button onClick={clearAiSuggestions} className="text-xs text-gray-400 hover:text-white">Dismiss</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiSuggestions.data.map((sg, idx) => (
              <div key={idx} className="p-4 bg-black/40 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">{sg.title}</h4>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{sg.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-blue-400/70 bg-blue-500/10 px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {sg.estimatedHours}h
                  </span>
                  <button 
                    onClick={() => handleApproveAI(sg)}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Work Item Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
            />
            <input 
              required type="number" min="1" placeholder="Estimated Hours" value={formData.estimatedHours} onChange={e => setFormData({...formData, estimatedHours: e.target.value})}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <textarea 
            placeholder="Description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 h-20 resize-none"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors">Save Work Item</button>
          </div>
        </form>
      )}

      {/* Work Item List */}
      <div className="space-y-3">
        {(!subTask.workItems || subTask.workItems.length === 0) ? (
          <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl text-sm">
            No Work Items logged. Create one manually or use AI.
          </div>
        ) : (
          subTask.workItems.map(wi => (
            <div key={wi.id} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between group transition-all">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onUpdateWorkItem(wi.id, { status: wi.status === 'done' ? 'todo' : 'done' })}
                  className="flex-shrink-0"
                >
                  {wi.status === 'done' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-500 group-hover:border-blue-400 transition-colors" />
                  )}
                </button>
                <div>
                  <h4 className={`text-sm font-medium transition-colors ${wi.status === 'done' ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {wi.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{wi.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <span className="bg-white/5 px-2 py-1 rounded">Est: {wi.estimatedHours || 0}h</span>
                  <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">Act: {wi.actualHours || 0}h</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamLeadWorkItemBoard;
