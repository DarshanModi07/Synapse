import React, { useState } from 'react';
import { Search, CheckCircle } from 'lucide-react';

const TeamLeadTaskBoard = ({ tasks, onTaskClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) && t.status !== 'done'
  );

  const completedTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto mt-4">
      
      <div className="flex justify-between items-center bg-[#13111C] p-5 rounded-[14px] shadow-sm border border-[#2D2B45]">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search active tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#08070F] border border-[#2D2B45] rounded-[10px] py-2 pl-10 pr-4 text-[13px] text-[#F9FAFB] focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="text-[13px] text-[#6B7280] flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> 
          Completed Archive: <strong className="text-[#F9FAFB]">{completedTasks.length}</strong>
        </div>
      </div>

      <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] shadow-sm overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-[#6B7280] text-[13px] bg-[#08070F]">No active tasks found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2D2B45] bg-[#08070F]">
                  <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Task</th>
                  <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Priority</th>
                  <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Team</th>
                  <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Due Date</th>
                  <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Creator</th>
                  <th className="p-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Subtasks</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, idx) => (
                  <tr 
                    key={task.id} 
                    onClick={() => onTaskClick(task)}
                    className="border-b border-[#2D2B45] hover:bg-[#1a1825] cursor-pointer transition-colors bg-[#13111C] group"
                  >
                    <td className="p-4 text-[13px] text-[#F9FAFB] font-medium max-w-[250px] truncate group-hover:text-purple-400 transition-colors">{task.title}</td>
                    <td className="p-4 text-[13px] capitalize font-medium text-[#6B7280]">
                       {task.priority}
                    </td>
                    <td className="p-4 text-[13px] capitalize font-medium text-[#6B7280]">
                       {task.status.replace("_", " ")}
                    </td>
                    <td className="p-4 text-[13px] text-[#6B7280]">{task.teamName}</td>
                    <td className="p-4 text-[13px] text-[#6B7280]">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '--'}</td>
                    <td className="p-4 text-[13px] text-[#6B7280]">{task.createdBy?.name || "System"}</td>
                    <td className="p-4 text-[13px] text-[#F9FAFB] text-right font-semibold">{task.subtasks?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default TeamLeadTaskBoard;
