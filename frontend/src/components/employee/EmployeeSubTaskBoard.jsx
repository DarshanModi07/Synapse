import React from 'react';
import { ListTodo, CheckSquare, Square } from 'lucide-react';

const EmployeeSubTaskBoard = ({ subTasks, updateStatus }) => {
    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-blue-400" /> My Active Assignments
            </h2>
            
            {(!subTasks || subTasks.length === 0) ? (
                <div className="text-center py-10 border border-dashed border-[#2D2B45] rounded-xl">
                    <p className="text-gray-400 font-semibold mb-1">No active assignments.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {subTasks.map(st => {
                        const isOverdue = st.dueDate && new Date(st.dueDate) < new Date() && new Date(st.dueDate).getDate() !== new Date().getDate();
                        return (
                            <div key={st.id} className="bg-[#08070F] border border-[#2D2B45] rounded-xl p-5 hover:border-blue-500/30 transition-colors relative overflow-hidden">
                                {isOverdue && <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="pl-2">
                                        <h3 className="text-base font-semibold text-white mb-2">{st.title}</h3>
                                        {st.description && <p className="text-xs text-gray-400 mb-3 max-w-2xl line-clamp-2">{st.description}</p>}
                                        <div className="flex gap-4 text-[11px] text-gray-400 font-medium">
                                            <p>Project: <span className="text-gray-300">{st.project}</span></p>
                                            <p>Team: <span className="text-gray-300">{st.team}</span></p>
                                            <p>Due: <span className={`font-semibold ${isOverdue ? 'text-red-400' : 'text-gray-300'}`}>
                                                {st.dueDate ? new Date(st.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'N/A'}
                                            </span></p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                            st.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            st.status === 'in_review' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                            st.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                            {st.status.replace('_', ' ')}
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400 font-medium">Progress:</span>
                                            <span className="text-sm font-bold text-white">{st.progress || 0}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Work Items Section */}
                                <div className="mt-4 pl-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Work Items</h4>
                                    {(!st.workItems || st.workItems.length === 0) ? (
                                        <p className="text-xs text-gray-600 italic">No work items found.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {st.workItems.map(wi => (
                                                <div key={wi.id} className="flex items-center justify-between bg-[#13111C] p-3 rounded-lg border border-[#2D2B45] group hover:border-emerald-500/30 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            onClick={() => updateStatus('workitem', wi.id, wi.status === 'done' ? 'todo' : 'done')}
                                                            className="text-gray-400 hover:text-emerald-400 transition-colors focus:outline-none"
                                                        >
                                                            {wi.status === 'done' ? (
                                                                <CheckSquare className="w-5 h-5 text-emerald-500" />
                                                            ) : (
                                                                <Square className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                        <span className={`text-sm font-medium ${wi.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                                            {wi.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs font-medium">
                                                        <div className="flex items-center gap-1.5 text-gray-400">
                                                            <span>Est: <span className="text-gray-300">{wi.estimatedHours}h</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            <span>Actual:</span>
                                                            <input 
                                                                type="number"
                                                                className="w-12 bg-[#2D2B45] text-white rounded px-1.5 py-0.5 outline-none border border-transparent focus:border-emerald-500 text-center"
                                                                defaultValue={wi.actualHours || ''}
                                                                placeholder="0"
                                                                onBlur={(e) => updateStatus('workitem', wi.id, undefined, undefined, e.target.value)}
                                                            />
                                                            <span>h</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EmployeeSubTaskBoard;
