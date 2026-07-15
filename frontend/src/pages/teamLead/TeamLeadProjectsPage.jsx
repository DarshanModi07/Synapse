import { useTeamLeadProjects } from "../../hooks/useTeamLeadProjects";
import { Link, useParams } from "react-router-dom";
import { 
  FolderKanban, 
  Activity, 
  CalendarDays, 
  ListTodo, 
  CheckCircle,
  Building2,
  Users,
  AlertCircle
} from "lucide-react";

const TeamLeadProjectsPage = () => {
  const { slug } = useParams();
  const { projects, loading, error } = useTeamLeadProjects();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-purple-400 flex flex-col items-center">
          <Activity className="w-10 h-10 animate-pulse mb-4" />
          <span className="text-sm font-medium">Loading Projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-red-400 bg-red-500/10 p-6 rounded-2xl flex flex-col items-center border border-red-500/20">
          <AlertCircle className="w-8 h-8 mb-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <FolderKanban className="w-8 h-8 text-blue-400" />
          Global Projects Portfolio
        </h1>
        <p className="text-gray-400 font-medium text-lg">
          Managing {projects.length} unified project{projects.length !== 1 ? 's' : ''} across your teams
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full p-12 text-center text-gray-500 bg-[#0D0D12]/80 backdrop-blur-xl rounded-3xl border border-white/10">
            <FolderKanban className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-50" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No Projects Assigned</h3>
            <p>Your teams are not currently assigned to any active projects.</p>
          </div>
        ) : (
          projects.map(project => (
            <Link 
              to={`/workspace/${slug}/team-lead/projects/${project.id}`} 
              key={project.id}
              className="group block p-6 rounded-3xl bg-[#0D0D12]/80 backdrop-blur-xl border border-white/10 transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3),0_0_30px_rgba(59,130,246,0.1)]"
            >
              
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-white truncate flex-1 pr-4">{project.name}</h2>
                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                  {project.status.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="truncate">{project.teamName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Building2 className="w-4 h-4 text-fuchsia-400" />
                  <span className="truncate">{project.departmentName}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <Activity className="w-3 h-3 text-green-400" /> Progress
                  </span>
                  <strong className="text-white">{project.progress}%</strong>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" 
                    style={{ width: `${project.progress}%` }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Tasks Completion</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-white">
                      {project.completedTasks} <span className="text-gray-500 font-normal">/ {project.totalTasks}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block mb-1">Due Date</span>
                  <div className="flex items-center gap-2">
                    <CalendarDays className={`w-4 h-4 ${new Date(project.dueDate) < new Date() ? 'text-red-400' : 'text-orange-400'}`} />
                    <span className={`text-sm font-semibold ${new Date(project.dueDate) < new Date() ? 'text-red-400' : 'text-white'}`}>
                      {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Unset'}
                    </span>
                  </div>
                </div>

              </div>

            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamLeadProjectsPage;
