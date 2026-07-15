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
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      
      {/* Navigation */}
      <Link 
        to={`/workspace/${slug}/team-lead/projects`}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Global Portfolio
      </Link>

      {/* Project Header */}
      <div className="bg-[#13111C] p-6 rounded-2xl border border-[#2D2B45] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Target className="w-6 h-6 text-purple-500" />
            {overview.name}
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl mt-2">
            {overview.description || "No description provided."}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Progress</span>
          <span className="text-3xl font-bold text-white">{overview.progress}%</span>
        </div>
      </div>

      {/* Project Details Card */}
      <div className="bg-[#13111C] p-6 rounded-2xl border border-[#2D2B45]">
        <h3 className="text-base font-bold text-white mb-4">Project Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <span className="text-xs text-gray-500 block mb-1">Department</span>
            <span className="text-sm text-white font-medium">{overview.department}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block mb-1">Manager</span>
            <span className="text-sm text-white font-medium">{overview.manager}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block mb-1">Due Date</span>
            <span className="text-sm text-white font-medium">{overview.dueDate ? new Date(overview.dueDate).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block mb-1">Status</span>
            <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">{overview.status}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block mb-1">Teams / Tasks</span>
            <span className="text-sm text-white font-medium">{teamInfo.length} Teams / {tasks.length} Tasks</span>
          </div>
        </div>
      </div>

      {/* Assigned Teams Section */}
      <div className="bg-[#13111C] p-6 rounded-2xl border border-[#2D2B45]">
        <h3 className="text-base font-bold text-white mb-4">Assigned Teams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teamInfo.map(team => (
            <div key={team.id} className="p-4 rounded-xl bg-[#08070F] border border-[#2D2B45]">
              <h4 className="text-white font-semibold text-sm mb-3">{team.name}</h4>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {team.members} Members</span>
                <span className="flex items-center gap-1"><FolderKanban className="w-3.5 h-3.5"/> {team.totalTasks} Tasks</span>
              </div>
              <div className="w-full bg-[#13111C] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${team.totalTasks > 0 ? (team.completedTasks / team.totalTasks) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breadcrumbs for Drilldown */}
      {(selectedTask || selectedSubTask) && (
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-[#13111C] px-5 py-3 rounded-xl border border-[#2D2B45] overflow-x-auto whitespace-nowrap">
          <button onClick={() => { setSelectedTask(null); setSelectedSubTask(null); }} className="hover:text-white font-medium transition-colors flex items-center gap-2">
            <FolderKanban className="w-4 h-4"/> Task Board
          </button>
          {selectedTask && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <button onClick={() => setSelectedSubTask(null)} className={`hover:text-white font-medium transition-colors ${!selectedSubTask ? 'text-purple-400' : ''}`}>
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

      {/* Task Board */}
      <div className="bg-[#13111C] p-6 rounded-2xl border border-[#2D2B45] min-h-[500px]">
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

      {/* AI Insights Section */}
      {!selectedTask && (
        <div className="bg-[#13111C] p-6 rounded-2xl border border-[#2D2B45]">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-fuchsia-400" /> AI Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <h4 className="text-red-400 text-sm font-semibold mb-2">Delayed Tasks</h4>
              <p className="text-xs text-gray-400">0 tasks are currently past their due date.</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
              <h4 className="text-orange-400 text-sm font-semibold mb-2">Risk Analysis</h4>
              <p className="text-xs text-gray-400">Project timeline is stable. Progress matches expected velocity.</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
              <h4 className="text-purple-400 text-sm font-semibold mb-2">Recommendations</h4>
              <p className="text-xs text-gray-400">Review the {analytics.inReview} tasks currently waiting in the review queue to unblock teams.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLeadProjectDetailsPage;
