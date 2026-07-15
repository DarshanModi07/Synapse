import React, { useState } from 'react';
import { Sparkles, Plus, PlayCircle, Loader2, CheckCircle, Clock3 } from 'lucide-react';

const TeamLeadSubTaskBoard = ({ 
  task, 
  members, 
  onCreateSubTask, 
  onUpdateSubTask,
  onGenerateAI,
  aiLoading,
  aiSuggestions,
  clearAiSuggestions,
  onWorkItemClick
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', assignedToId: '' });

  if (!task) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateSubTask(task.id, formData);
    setShowAddForm(false);
    setFormData({ title: '', description: '', priority: 'medium', assignedToId: '' });
  };

  const handleApproveAI = async (suggestion) => {
    await onCreateSubTask(task.id, {
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
      assignedToId: formData.assignedToId // Prompt manually or let them map later
    });
    // Normally we'd pop this out of the suggestions array
  };

  const getStatusColor = (status) => {
    if (status === 'done') return "bg-green-500/10 text-green-400 border-green-500/20";
    if (status === 'in_progress') return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (status === 'in_review') return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  return (
    <div className="bg-[#0D0D12]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            SubTasks for "{task.title}"
          </h2>
          <p className="text-sm text-gray-400 mt-1">Manage granular assignments and generate plans using AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onGenerateAI(task.id)}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 hover:from-purple-600/30 hover:to-fuchsia-600/30 text-purple-300 rounded-xl border border-purple-500/30 transition-all font-medium text-sm disabled:opacity-50"
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
      {aiSuggestions && aiSuggestions.type === 'subtasks' && aiSuggestions.taskId === task.id && (
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Generated Plan
            </h3>
            <button onClick={clearAiSuggestions} className="text-xs text-gray-400 hover:text-white">Dismiss</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiSuggestions.data.map((sg, idx) => (
              <div key={idx} className="p-4 bg-black/40 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-white">{sg.title}</h4>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${sg.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                    {sg.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{sg.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-purple-400/70 bg-purple-500/10 px-2 py-1 rounded">Est: {sg.estimatedHours}h</span>
                  <button 
                    onClick={() => handleApproveAI(sg)}
                    className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
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
              required type="text" placeholder="SubTask Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
            />
            <select 
              value={formData.assignedToId} onChange={e => setFormData({...formData, assignedToId: e.target.value})}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50"
            >
              <option value="">Unassigned</option>
              {members.filter(m => m.teamName === task.teamName).map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <textarea 
            placeholder="Description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 h-20 resize-none"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors">Save SubTask</button>
          </div>
        </form>
      )}

      {/* SubTask List */}
      <div className="space-y-3">
        {(!task.subtasks || task.subtasks.length === 0) ? (
          <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl text-sm">
            No SubTasks found. Create one manually or use AI to generate a plan.
          </div>
        ) : (
          task.subtasks.map(sub => (
            <div key={sub.id} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between group transition-all">
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => onUpdateSubTask(sub.id, { status: sub.status === 'done' ? 'in_progress' : 'done' })}
                  className="mt-1 flex-shrink-0"
                >
                  {sub.status === 'done' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-500 group-hover:border-blue-400 transition-colors" />
                  )}
                </button>
                <div>
                  <h4 className={`text-sm font-medium mb-1 transition-colors ${sub.status === 'done' ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {sub.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                    <span className={`px-2 py-0.5 rounded border ${getStatusColor(sub.status)}`}>{sub.status.replace("_", " ")}</span>
                    {sub.assignedTo && (
                      <span className="flex items-center gap-1.5">
                        <img src={sub.assignedTo.avatar} alt="avatar" className="w-4 h-4 rounded-full bg-white/20" />
                        {sub.assignedTo.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><Clock3 className="w-3 h-3" /> {sub.workItems?.length || 0} Work Items</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onWorkItemClick(sub)}
                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors opacity-0 group-hover:opacity-100"
              >
                Track Work <PlayCircle className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamLeadSubTaskBoard;
