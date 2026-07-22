import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ListTodo } from 'lucide-react';

const EmployeeRecentAssignments = ({ assignments }) => {
    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm p-5 hover:border-purple-500/30 transition-colors">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-[14px] font-bold text-[#F9FAFB]">Recent Assignments</h2>
                    <p className="text-[12px] text-[#6B7280]">Fresh work added to your queue</p>
                </div>
                <div className="p-2 bg-indigo-500/10 rounded-full">
                    <ListTodo size={18} className="text-indigo-400" />
                </div>
            </div>

            {(!assignments || assignments.length === 0) ? (
                <div className="text-center py-6 text-[#6B7280] text-[13px] bg-[#08070F] rounded-[10px] border border-[#2D2B45]">
                    No recent assignments.
                </div>
            ) : (
                <div className="border border-[#2D2B45] rounded-[10px] overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-[#2D2B45]">
                            {assignments.map((st, idx) => (
                                <tr key={st.id} className="hover:bg-[#1a1825] transition-colors bg-[#13111C]">
                                    <td className="p-3 text-[13px] text-[#F9FAFB] font-medium w-full">
                                        {st.title}
                                    </td>
                                    <td className="p-3 text-[12px] text-[#6B7280] whitespace-nowrap">
                                        By {st.assignedBy}
                                    </td>
                                    <td className="p-3 text-[12px] text-[#6B7280] whitespace-nowrap">
                                        {st.team}
                                    </td>
                                    <td className="p-3 text-[12px] text-[#6B7280] whitespace-nowrap text-right">
                                        {formatDistanceToNow(new Date(st.time), { addSuffix: true })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeeRecentAssignments;
