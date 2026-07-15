import React, { useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { useTeamLeadProjectDetails } from "../../hooks/useTeamLeadProjectDetails";
import TeamLeadTaskBoard from "../../components/teamLead/TeamLeadTaskBoard";
import TeamLeadSubTaskBoard from "../../components/teamLead/TeamLeadSubTaskBoard";
import TeamLeadWorkItemBoard from "../../components/teamLead/TeamLeadWorkItemBoard";
import { ProgressCard } from "@/components/owner/dashboard/ProgressCard";
import { 
  FolderKanban, 
  ArrowLeft,
  Activity, 
  Users,
  AlertCircle,
  Building2,
  CalendarDays,
  Target,
  ChevronRight
} from "lucide-react";

const TeamLeadProjectDetailsPage = () => {
  const { slug, projectId } = useParams();
  const { 
    data, 
    loading, 
    error,
    aiLoading,
    aiSuggestions,
    handleGenerateAISubTasks,
    handleGenerateAIWorkItems,
    clearAiSuggestions,
    handleCreateSubTask,
    handleUpdateSubTask,
    handleCreateWorkItem,
    handleUpdateWorkItem
  } = useTeamLeadProjectDetails(projectId);

  // Drilldown states
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedSubTask, setSelectedSubTask] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-purple-400 flex flex-col items-center">
          <Activity className="w-10 h-10 animate-pulse mb-4" />
          <span className="text-sm font-medium">Booting Command Center...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-red-400 bg-red-500/10 p-6 rounded-2xl flex flex-col items-center border border-red-500/20">
          <AlertCircle className="w-8 h-8 mb-2" />
          <span>{error || "Failed to load project."}</span>
        </div>
      </div>
    );
  }

  const { overview, teamInfo, tasks, members, analytics } = data;

  // Sync drilled down task state automatically if data updates
  const currentTask = selectedTask ? tasks.find(t => t.id === selectedTask.id) : null;
  const currentSubTask = selectedSubTask && currentTask ? currentTask.subtasks.find(s => s.id === selectedSubTask.id) : null;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Navigation */}
      <Link 
        to={`/workspace/${slug}/team-lead/projects`}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-[#13111C]/50 px-4 py-2 rounded-xl border border-[#2D2B45] hover:border-[#7C3AED]/50"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Global Portfolio
      </Link>

      {/* Premium Glass Header Card */}
      <div className="bg-[#13111C]/80 backdrop-blur-2xl p-8 rounded-3xl border border-[#2D2B45] shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-[#7C3AED]/30 transition-colors">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#7C3AED]/20 blur-[120px] rounded-full pointer-events-none group-hover:bg-[#7C3AED]/30 transition-all duration-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{overview.name}</h1>
            </div>
            <p className="text-gray-400 font-medium text-base max-w-3xl mb-6">
              {overview.description || "No description provided."}
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#7C3AED]/10 text-[#A78BFA] border border-[#7C3AED]/20">
                {overview.status}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CalendarDays className="w-4 h-4 text-orange-400" />
                <span className="font-medium text-gray-300">{overview.dueDate ? new Date(overview.dueDate).toLocaleDateString() : 'No Deadline'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-gray-300">{overview.manager}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FolderKanban className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-gray-300">{tasks.length} Tasks</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Building2 className="w-4 h-4 text-pink-400" />
                <span className="font-medium text-gray-300">{teamInfo.length} Teams</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-[#08070F]/50 p-6 rounded-2xl border border-[#2D2B45]">
            <div className="text-right">
              <span className="text-sm font-medium text-gray-400 block mb-1">Overall Progress</span>
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {overview.progress}%
              </span>
            </div>
            <div className="w-20 h-20 rounded-full border-[6px] border-[#2D2B45] relative flex items-center justify-center shadow-inner">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="40" cy="40" r="34" 
                  fill="transparent" 
                  strokeWidth="6" 
                  className="stroke-[#7C3AED] transition-all duration-1000 ease-out" 
                  strokeDasharray="213.6" 
                  strokeDashoffset={213.6 - (213.6 * overview.progress) / 100} 
                  strokeLinecap="round"
                />
              </svg>
              <Activity className="w-7 h-7 text-[#A78BFA]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Overview & Teams (~30%) */}
        <div className="xl:col-span-4 space-y-6">
          
          <div className="bg-[#13111C]/80 backdrop-blur-xl p-7 rounded-3xl border border-[#2D2B45] shadow-lg">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#A78BFA]" /> Project Overview
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                <span className="text-gray-400 font-medium">Department</span>
                <span className="text-white font-semibold truncate max-w-[150px]">{overview.department}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                <span className="text-gray-400 font-medium">Manager</span>
                <span className="text-white font-semibold truncate max-w-[150px]">{overview.manager}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#2D2B45]">
                <span className="text-gray-400 font-medium">Due Date</span>
                <span className="text-white font-semibold">{overview.dueDate ? new Date(overview.dueDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 font-medium">Completion</span>
                <span className="text-[#A78BFA] font-bold">{overview.progress}%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#13111C]/80 backdrop-blur-xl p-7 rounded-3xl border border-[#2D2B45] shadow-lg">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Assigned Teams
            </h3>
            <div className="space-y-3">
              {teamInfo.map(team => (
                <div key={team.id} className="p-4 rounded-2xl bg-[#08070F] border border-[#2D2B45] hover:border-[#7C3AED]/30 transition-colors group">
                  <h4 className="text-white font-semibold text-sm mb-3 group-hover:text-[#A78BFA] transition-colors">{team.name}</h4>
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {team.members}</span>
                    <span className="flex items-center gap-1"><FolderKanban className="w-3.5 h-3.5"/> {team.totalTasks} tasks</span>
                  </div>
                  <div className="w-full bg-[#13111C] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-[#7C3AED] rounded-full transition-all duration-1000" style={{ width: `${team.totalTasks > 0 ? (team.completedTasks / team.totalTasks) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#13111C]/80 backdrop-blur-xl p-7 rounded-3xl border border-[#2D2B45] shadow-lg">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-fuchsia-400" /> AI Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
                <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Delayed Tasks</h4>
                <p className="text-sm text-gray-300 font-medium">0 tasks are currently past their due date.</p>
              </div>
              <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                <h4 className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">Risk Analysis</h4>
                <p className="text-sm text-gray-300 font-medium">Project timeline is stable. Progress matches expected velocity.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#7C3AED]/5 border border-[#7C3AED]/20">
                <h4 className="text-[#A78BFA] text-xs font-bold uppercase tracking-wider mb-1">Suggestions</h4>
                <p className="text-sm text-gray-300 font-medium">Review the {analytics.inReview} tasks currently waiting in the review queue to unblock teams.</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Kanban Board (~70%) */}
        <div className="xl:col-span-8">
          
          {/* Breadcrumbs for Drilldown */}
          {(selectedTask || selectedSubTask) && (
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-[#13111C]/80 backdrop-blur-xl px-5 py-4 rounded-2xl border border-[#2D2B45] mb-6 overflow-x-auto whitespace-nowrap shadow-lg">
              <button onClick={() => { setSelectedTask(null); setSelectedSubTask(null); }} className="hover:text-white font-medium transition-colors flex items-center gap-2">
                <FolderKanban className="w-4 h-4"/> Active Task Board
              </button>
              {selectedTask && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                  <button onClick={() => setSelectedSubTask(null)} className={`hover:text-white font-medium transition-colors ${!selectedSubTask ? 'text-[#A78BFA]' : ''}`}>
                    {currentTask?.title}
                  </button>
                </>
              )}
              {selectedSubTask && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                  <span className="text-blue-400 font-medium truncate max-w-[200px]">{currentSubTask?.title}</span>
                </>
              )}
            </div>
          )}

          <div className="bg-[#13111C]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#2D2B45] shadow-lg min-h-[600px]">
            {!selectedTask && (
              <>
                <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
                  <Activity className="w-6 h-6 text-[#7C3AED]"/> Active Task Board
                </h2>
                <TeamLeadTaskBoard 
                  tasks={tasks} 
                  onTaskClick={(task) => setSelectedTask(task)}
                />
              </>
            )}

            {selectedTask && !selectedSubTask && (
              <TeamLeadSubTaskBoard 
                task={currentTask} 
                members={members}
                onCreateSubTask={handleCreateSubTask}
                onUpdateSubTask={handleUpdateSubTask}
                onGenerateAI={handleGenerateAISubTasks}
                aiLoading={aiLoading.subtasks}
                aiSuggestions={aiSuggestions}
                clearAiSuggestions={clearAiSuggestions}
                onWorkItemClick={(subTask) => setSelectedSubTask(subTask)}
              />
            )}

            {selectedTask && selectedSubTask && (
              <TeamLeadWorkItemBoard 
                subTask={currentSubTask}
                onCreateWorkItem={handleCreateWorkItem}
                onUpdateWorkItem={handleUpdateWorkItem}
                onGenerateAI={handleGenerateAIWorkItems}
                aiLoading={aiLoading.workitems}
                aiSuggestions={aiSuggestions}
                clearAiSuggestions={clearAiSuggestions}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamLeadProjectDetailsPage;
