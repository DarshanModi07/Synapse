import React, { useState } from 'react';
import { CheckSquare, Square, ChevronDown, ChevronRight } from 'lucide-react';

const EmployeeSubTaskBoard = ({ subTasks, updateStatus }) => {
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#2D2B45] flex justify-between items-center">
                <div>
                    <h2 className="text-[14px] font-bold text-[#F9FAFB]">My Subtasks</h2>
                    <p className="text-[12px] text-[#6B7280]">Expand to view and complete work items</p>
                </div>
            </div>
            
            {(!subTasks || subTasks.length === 0) ? (
                <div className="p-6 text-center text-[#6B7280] text-[13px]">
                    No active assignments.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#2D2B45] bg-[#08070F]">
                                <th className="p-3 text-[12px] font-semibold text-[#6B7280] w-8"></th>
                                <th className="p-3 text-[12px] font-semibold text-[#6B7280]">Title</th>
                                <th className="p-3 text-[12px] font-semibold text-[#6B7280]">Project / Team</th>
                                <th className="p-3 text-[12px] font-semibold text-[#6B7280]">Due Date</th>
                                <th className="p-3 text-[12px] font-semibold text-[#6B7280]">Status</th>
                                <th className="p-3 text-[12px] font-semibold text-[#6B7280]">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subTasks.map((st, idx) => {
                                const isExpanded = expanded[st.id];
                                const isOverdue = st.dueDate && new Date(st.dueDate) < new Date() && new Date(st.dueDate).getDate() !== new Date().getDate();
                                
                                return (
                                    <React.Fragment key={st.id}>
                                        <tr 
                                            className={`border-b border-[#2D2B45] hover:bg-white/5 cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-[#08070F]/50'}`}
                                            onClick={() => toggleExpand(st.id)}
                                        >
                                            <td className="p-3 text-[#6B7280]">
                                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </td>
                                            <td className="p-3 text-[13px] text-[#F9FAFB] font-medium">
                                                {st.title}
                                            </td>
                                            <td className="p-3 text-[13px] text-[#6B7280]">
                                                {st.project} / {st.team}
                                            </td>
                                            <td className={`p-3 text-[13px] ${isOverdue ? 'text-red-400' : 'text-[#6B7280]'}`}>
                                                {st.dueDate ? new Date(st.dueDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-[4px] text-[11px] font-medium border ${
                                                    st.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    st.status === 'in_review' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    st.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                }`}>
                                                    {st.status === 'in_review' ? 'Waiting for Review' : st.status === 'done' ? 'Completed' : st.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-3 text-[13px] text-[#F9FAFB] font-medium">
                                                {st.progress || 0}%
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-[#08070F] border-b border-[#2D2B45]">
                                                <td colSpan="6" className="p-0">
                                                    <div className="p-4 pl-12">
                                                        <h4 className="text-[12px] font-semibold text-[#6B7280] mb-3 uppercase tracking-wider">Work Items</h4>
                                                        {(!st.workItems || st.workItems.length === 0) ? (
                                                            <p className="text-[13px] text-[#6B7280]">No work items found.</p>
                                                        ) : (
                                                            <div className="space-y-2 max-w-4xl">
                                                                {st.workItems.map(wi => (
                                                                    <div key={wi.id} className="flex items-center justify-between p-2 rounded-[6px] border border-[#2D2B45] hover:border-[#4d4b65] bg-[#13111C]">
                                                                        <div className="flex items-center gap-3">
                                                                            <button 
                                                                                onClick={(e) => { e.stopPropagation(); updateStatus('workitem', wi.id, wi.status === 'done' ? 'todo' : 'done'); }}
                                                                                className="text-[#6B7280] hover:text-emerald-400 transition-colors focus:outline-none"
                                                                            >
                                                                                {wi.status === 'done' ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
                                                                            </button>
                                                                            <span className={`text-[13px] font-medium ${wi.status === 'done' ? 'text-[#6B7280] line-through' : 'text-[#F9FAFB]'}`}>
                                                                                {wi.title}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-4 text-[12px] text-[#6B7280]">
                                                                            <span>Est: {wi.estimatedHours || 0}h</span>
                                                                            <div className="flex items-center gap-2">
                                                                                <span>Actual:</span>
                                                                                <input 
                                                                                    type="number"
                                                                                    className="w-12 bg-[#2D2B45] text-[#F9FAFB] rounded-[4px] px-1 py-0.5 outline-none border border-transparent focus:border-emerald-500 text-center"
                                                                                    defaultValue={wi.actualHours || ''}
                                                                                    placeholder="0"
                                                                                    onClick={(e) => e.stopPropagation()}
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
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeeSubTaskBoard;
