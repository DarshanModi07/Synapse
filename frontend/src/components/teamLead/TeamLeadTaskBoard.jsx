import React, { useState } from 'react';
import { Layers, CalendarDays, User, MoreVertical, Search, CheckCircle } from 'lucide-react';

const TeamLeadTaskBoard = ({ tasks, onTaskClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) && t.status !== 'done'
  );

  const completedTasks = tasks.filter(t => t.status === 'done');

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-500/10 border-gray-500/20 text-gray-400' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
    { id: 'in_review', title: 'In Review', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center bg-[#13111C] p-4 rounded-xl border border-[#2D2B45]">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search active tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#08070F] border border-[#2D2B45] rounded-xl py-2 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C3AED]/50"
          />
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-2 px-4 py-2 bg-[#08070F] rounded-xl border border-[#2D2B45]">
          <CheckCircle className="w-4 h-4 text-green-400" /> 
          Completed Archive: <strong className="text-white">{completedTasks.length}</strong> tasks
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4 items-start">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="min-w-[320px] bg-[#08070F] rounded-xl p-4 border border-[#2D2B45]">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wider ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="text-xs text-gray-500 font-bold bg-[#13111C] px-2 py-0.5 rounded border border-[#2D2B45]">{colTasks.length}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {colTasks.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-[#2D2B45] rounded-xl text-gray-600 text-sm font-medium">
                    No active tasks
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => onTaskClick(task)}
                      className="p-4 bg-[#13111C] hover:bg-[#1a1a24] rounded-xl border border-[#2D2B45] cursor-pointer transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <h4 className="text-white font-medium text-sm mb-3 line-clamp-2">{task.title}</h4>
                      
                      <div className="flex flex-col gap-2 mt-2 text-[11px]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Layers className="w-3.5 h-3.5 text-purple-400" />
                            <span className="truncate max-w-[100px]">{task.teamName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '--'}</span>
                          </div>
                        </div>

                        <div className="mt-2 pt-3 border-t border-[#2D2B45] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#08070F] flex items-center justify-center border border-[#2D2B45]">
                              <User className="w-3 h-3 text-gray-400" />
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium">{task.createdBy?.name || "System"}</span>
                          </div>
                          <span className="text-[10px] font-medium text-gray-400 bg-[#08070F] px-2 py-1 rounded border border-[#2D2B45]">
                            {task.subtasks?.length || 0} Subtasks
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Completed Archive Visuals */}
      {completedTasks.length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/10">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-green-400" /> Completed Archive
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 opacity-70">
            {completedTasks.map(task => (
              <div key={task.id} className="min-w-[250px] p-3 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500/50" />
                <div className="truncate">
                  <p className="text-sm text-gray-300 font-medium truncate">{task.title}</p>
                  <p className="text-[10px] text-gray-500">{task.teamName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLeadTaskBoard;
