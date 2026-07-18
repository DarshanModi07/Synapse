import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const EmployeeRecentAssignments = ({ assignments }) => {
    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" /> Recent Assignments
            </h2>

            {(!assignments || assignments.length === 0) ? (
                <div className="text-center py-8 border border-dashed border-[#2D2B45] rounded-xl">
                    <p className="text-gray-500 text-sm">No recent assignments.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {assignments.map(st => (
                        <div key={st.id} className="bg-[#08070F] border border-[#2D2B45] rounded-xl p-4 flex justify-between items-center hover:border-indigo-500/30 transition-colors">
                            <div>
                                <h3 className="font-semibold text-white">{st.title}</h3>
                                <p className="text-xs text-gray-400 mt-1">
                                    Assigned By: <span className="text-gray-300 mr-3">{st.assignedBy}</span>
                                    Team: <span className="text-gray-300">{st.team}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-medium">
                                    {formatDistanceToNow(new Date(st.time), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeRecentAssignments;
