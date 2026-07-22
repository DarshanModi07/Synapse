import React, { useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { useTeamLeadProjectDetails } from "../../hooks/useTeamLeadProjectDetails";
import TeamLeadTaskBoard from "../../components/teamLead/TeamLeadTaskBoard";
import TeamLeadSubTaskBoard from "../../components/teamLead/TeamLeadSubTaskBoard";
import TeamLeadWorkItemBoard from "../../components/teamLead/TeamLeadWorkItemBoard";
import { ProgressCard } from "@/components/owner/dashboard/ProgressCard";
import ErrorBoundary from "../../components/common/ErrorBoundary";
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
    removeAiSuggestion,
    handleCreateSubTask,
    handleUpdateSubTask,
    handleApproveSubTask,
    handleRejectSubTask,
    handleDeleteSubTask,
    handleCreateWorkItem,
    handleBulkCreateWorkItems,
    handleUpdateWorkItem,
    handleDeleteWorkItem
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
        <div className="text-red-400 bg-red-500/10 p-6 rounded-2xl flex flex-col items-center border border-red-500/20 shadow-sm">
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
    <div className="space-y-6 pb-20 max-w-[1400px] mx-auto mt-4">
      
      {/* Navigation */}
      <Link 
        to={`/workspace/${slug}/team-lead/projects`}
        className="inline-flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#F9FAFB] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Global Portfolio
      </Link>

      {/* Project Header */}
      <div className="bg-[#13111C] p-6 rounded-[14px] shadow-sm border border-[#2D2B45] flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#F9FAFB] mb-1 flex items-center gap-3">
            <Target className="w-6 h-6 text-[#6B7280]" />
            {overview.name}
          </h1>
          <p className="text-[#6B7280] text-[13px] max-w-2xl mt-2">
            {overview.description || "No description provided."}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[11px] text-[#6B7280] uppercase tracking-wider block mb-1 font-medium">Progress</span>
          <span className="text-[28px] font-bold text-emerald-400">{overview.progress}%</span>
        </div>
      </div>

      {/* Project Details Card */}
      <div className="bg-[#13111C] p-6 rounded-[14px] shadow-sm border border-[#2D2B45]">
        <h3 className="text-[14px] font-bold text-[#F9FAFB] mb-5">Project Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div>
            <span className="text-[11px] text-[#6B7280] block mb-1">Department</span>
            <span className="text-[13px] text-[#F9FAFB] font-medium flex items-center gap-2"><Building2 className="w-4 h-4 text-fuchsia-400" /> {overview.department}</span>
          </div>
          <div>
            <span className="text-[11px] text-[#6B7280] block mb-1">Manager</span>
            <span className="text-[13px] text-[#F9FAFB] font-medium">{overview.manager}</span>
          </div>
          <div>
            <span className="text-[11px] text-[#6B7280] block mb-1">Due Date</span>
            <span className={`text-[13px] font-medium flex items-center gap-2 ${new Date(overview.dueDate) < new Date() ? 'text-red-500' : 'text-[#F9FAFB]'}`}>
              <CalendarDays className={`w-4 h-4 ${new Date(overview.dueDate) < new Date() ? 'text-red-500' : 'text-blue-400'}`} />
              {overview.dueDate ? new Date(overview.dueDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-[#6B7280] block mb-1">Status</span>
            <span className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">{overview.status}</span>
          </div>
          <div>
            <span className="text-[11px] text-[#6B7280] block mb-1">Teams / Tasks</span>
            <span className="text-[13px] text-[#F9FAFB] font-medium flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-purple-400" />
              {teamInfo.length} Teams / {tasks.length} Tasks
            </span>
          </div>
        </div>
      </div>

      {/* Assigned Teams Section */}
      <div className="bg-[#13111C] p-6 rounded-[14px] shadow-sm border border-[#2D2B45]">
        <h3 className="text-[14px] font-bold text-[#F9FAFB] mb-5">Assigned Teams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teamInfo.map(team => (
            <div key={team.id} className="p-5 rounded-[10px] bg-[#08070F] border border-[#2D2B45] hover:border-blue-500/30 transition-colors">
              <h4 className="text-[#F9FAFB] font-semibold text-[13px] mb-3">{team.name}</h4>
              <div className="flex justify-between text-[11px] text-[#6B7280] mb-3 font-medium">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> {team.members} Members</span>
                <span className="flex items-center gap-1.5"><FolderKanban className="w-3.5 h-3.5"/> {team.totalTasks} Tasks</span>
              </div>
              <div className="w-full bg-[#13111C] h-1.5 rounded-full overflow-hidden border border-[#2D2B45]">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${team.totalTasks > 0 ? (team.completedTasks / team.totalTasks) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breadcrumbs for Drilldown */}
      {(selectedTask || selectedSubTask) && (
        <div className="flex items-center gap-2 text-[13px] text-[#6B7280] bg-[#13111C] px-5 py-3 rounded-[10px] shadow-sm border border-[#2D2B45] overflow-x-auto whitespace-nowrap">
          <button onClick={() => { setSelectedTask(null); setSelectedSubTask(null); }} className="hover:text-[#F9FAFB] font-medium transition-colors flex items-center gap-2">
            <FolderKanban className="w-4 h-4"/> Task Board
          </button>
          {selectedTask && (
            <>
              <ChevronRight className="w-4 h-4 text-[#2D2B45]" />
              <button onClick={() => setSelectedSubTask(null)} className={`hover:text-[#F9FAFB] font-medium transition-colors ${!selectedSubTask ? 'text-purple-400' : ''}`}>
                {currentTask?.title}
              </button>
            </>
          )}
          {selectedSubTask && (
            <>
              <ChevronRight className="w-4 h-4 text-[#2D2B45]" />
              <span className="text-blue-400 font-medium truncate max-w-[200px]">{currentSubTask?.title}</span>
            </>
          )}
        </div>
      )}

      {/* Task Board */}
      <div className="bg-[#13111C] p-6 rounded-[14px] shadow-sm border border-[#2D2B45] min-h-[500px]">
        {!selectedTask && (
          <TeamLeadTaskBoard 
            tasks={tasks} 
            onTaskClick={(task) => setSelectedTask(task)}
          />
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
            removeAiSuggestion={removeAiSuggestion}
            onApproveSubTask={handleApproveSubTask}
            onRejectSubTask={handleRejectSubTask}
            onDeleteSubTask={handleDeleteSubTask}
            onWorkItemClick={(subTask) => setSelectedSubTask(subTask)}
          />
        )}

        {selectedTask && selectedSubTask && (
          <TeamLeadWorkItemBoard 
            subTask={currentSubTask}
            onCreateWorkItem={handleCreateWorkItem}
            onBulkCreateWorkItems={handleBulkCreateWorkItems}
            onUpdateWorkItem={handleUpdateWorkItem}
            onDeleteWorkItem={handleDeleteWorkItem}
            onGenerateAI={handleGenerateAIWorkItems}
            aiLoading={aiLoading.workitems}
            aiSuggestions={aiSuggestions}
            clearAiSuggestions={clearAiSuggestions}
            removeAiSuggestion={removeAiSuggestion}
          />
        )}
      </div>

      {/* AI Insights Section */}
      {!selectedTask && (
        <div className="bg-[#13111C] p-6 rounded-[14px] shadow-sm border border-[#2D2B45]">
          <h3 className="text-[14px] font-bold text-[#F9FAFB] mb-5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#6B7280]" /> AI Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-[10px] bg-[#08070F] border border-[#2D2B45] hover:border-red-500/30 transition-colors">
              <h4 className="text-[#6B7280] text-[13px] font-bold mb-2">Delayed Tasks</h4>
              <p className="text-[12px] text-[#6B7280]">0 tasks are currently past their due date.</p>
            </div>
            <div className="p-5 rounded-[10px] bg-[#08070F] border border-[#2D2B45] hover:border-emerald-500/30 transition-colors">
              <h4 className="text-[#6B7280] text-[13px] font-bold mb-2">Risk Analysis</h4>
              <p className="text-[12px] text-[#6B7280]">Project timeline is stable. Progress matches expected velocity.</p>
            </div>
            <div className="p-5 rounded-[10px] bg-[#08070F] border border-[#2D2B45] hover:border-purple-500/30 transition-colors">
              <h4 className="text-[#6B7280] text-[13px] font-bold mb-2">Recommendations</h4>
              <p className="text-[12px] text-[#6B7280]">Review the {analytics.inReview} tasks currently waiting in the review queue to unblock teams.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TeamLeadProjectDetailsPageWithBoundary = () => (
  <ErrorBoundary>
    <TeamLeadProjectDetailsPage />
  </ErrorBoundary>
);

export default TeamLeadProjectDetailsPageWithBoundary;
