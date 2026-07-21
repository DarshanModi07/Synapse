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
        <div className="text-[#6B7280] flex flex-col items-center">
          <Activity className="w-8 h-8 animate-pulse mb-4" />
          <span className="text-[13px] font-medium">Loading Projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-red-400 bg-red-500/10 p-6 rounded-[14px] flex flex-col items-center border border-red-500/20 shadow-sm">
          <AlertCircle className="w-8 h-8 mb-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-[1400px] mx-auto mt-4">
      
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-[#F9FAFB] mb-2 flex items-center gap-3">
          <FolderKanban className="w-8 h-8 text-[#6B7280]" />
          Global Projects Portfolio
        </h1>
        <p className="text-[#6B7280] text-[14px]">
          Managing {projects.length} unified project{projects.length !== 1 ? 's' : ''} across your teams
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full p-12 text-center text-[#6B7280] bg-[#13111C] rounded-[14px] border border-[#2D2B45] shadow-sm">
            <FolderKanban className="w-10 h-10 mx-auto mb-4 opacity-50" />
            <h3 className="text-[16px] font-medium text-[#F9FAFB] mb-2">No Projects Assigned</h3>
            <p className="text-[13px]">Your teams are not currently assigned to any active projects.</p>
          </div>
        ) : (
          projects.map(project => (
            <Link 
              to={`/workspace/${slug}/team-lead/projects/${project.id}`} 
              key={project.id}
              className="group block p-6 rounded-[14px] bg-[#13111C] border border-[#2D2B45] transition-all hover:bg-[#1a1825] hover:border-purple-500/30 hover:scale-[1.01] hover:shadow-lg shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <FolderKanban className="w-24 h-24 text-purple-400 -rotate-12 translate-x-6 -translate-y-4" />
              </div>
              
              <div className="flex justify-between items-start mb-5 relative z-10">
                <h2 className="text-[16px] font-bold text-[#F9FAFB] truncate flex-1 pr-4 group-hover:text-purple-400 transition-colors">{project.name}</h2>
                <span className="shrink-0 px-2.5 py-1 rounded-[6px] text-[11px] font-medium bg-[#08070F] text-[#6B7280] border border-[#2D2B45] capitalize">
                  {project.status.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-3 mb-6 relative z-10">
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280]">
                  <Users className="w-4 h-4 text-blue-400/80" />
                  <span className="truncate">{project.teamName}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280]">
                  <Building2 className="w-4 h-4 text-fuchsia-400/80" />
                  <span className="truncate">{project.departmentName}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6 relative z-10">
                <div className="flex justify-between items-center text-[12px] mb-2">
                  <span className="text-[#6B7280] font-medium flex items-center gap-1">
                    Progress
                  </span>
                  <strong className="text-emerald-400 text-[14px]">{project.progress}%</strong>
                </div>
                <div className="h-1.5 w-full bg-[#08070F] rounded-full overflow-hidden border border-[#2D2B45]">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${project.progress}%` }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-[#2D2B45] relative z-10">
                
                <div>
                  <span className="text-[11px] text-[#6B7280] block mb-1">Tasks</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[13px] font-bold text-[#F9FAFB]">
                      {project.completedTasks} <span className="text-[#6B7280] font-medium">/ {project.totalTasks}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#6B7280] block mb-1">Due Date</span>
                  <div className="flex items-center gap-2">
                    <CalendarDays className={`w-4 h-4 ${new Date(project.dueDate) < new Date() ? 'text-red-500' : 'text-[#6B7280]'}`} />
                    <span className={`text-[13px] font-bold ${new Date(project.dueDate) < new Date() ? 'text-red-500' : 'text-[#F9FAFB]'}`}>
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
