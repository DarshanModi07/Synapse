import { Link, useParams } from "react-router-dom";
import { FolderKanban, Users, CheckSquare, Clock } from "lucide-react";

const TeamLeadProjectsPage = () => {
  const { slug } = useParams();

  // Mock data for Team Lead assigned projects
  const projects = [
    {
      id: "proj_1",
      name: "Q4 API Refactor",
      description: "Overhauling the backend authentication and standardizing endpoints.",
      progress: 45,
      dueDate: "2026-10-31",
      teamSize: 4,
      taskCount: 24,
      status: "In Progress"
    },
    {
      id: "proj_2",
      name: "Frontend V2",
      description: "Migration to React 19 and implementation of new glassmorphism design.",
      progress: 80,
      dueDate: "2026-08-15",
      teamSize: 6,
      taskCount: 42,
      status: "In Progress"
    },
    {
      id: "proj_3",
      name: "Database Migration",
      description: "Moving from Postgres 14 to Postgres 16 with minimal downtime.",
      progress: 10,
      dueDate: "2026-12-01",
      teamSize: 3,
      taskCount: 15,
      status: "Planning"
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Assigned Projects</h1>
        <p className="text-gray-400">Manage and monitor projects assigned to your teams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col rounded-3xl p-6 transition-all duration-300 hover:border-purple-500/50"
            style={{
              background: "rgba(13,13,18,.55)",
              border: "1px solid rgba(255,255,255,.05)",
              backdropFilter: "blur(20px)"
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 rounded-2xl">
                <FolderKanban className="w-6 h-6 text-purple-400" />
              </div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {project.status}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">
              {project.description}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4 mb-6">
              <div className="flex flex-col items-center">
                <Users className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-sm font-medium text-gray-200">{project.teamSize}</span>
              </div>
              <div className="flex flex-col items-center">
                <CheckSquare className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-sm font-medium text-gray-200">{project.taskCount}</span>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-xs font-medium text-gray-200">
                  {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            <Link
              to={`/workspace/${slug}/team-lead/projects/${project.id}`}
              className="w-full py-2.5 rounded-xl text-center text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              View Project
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamLeadProjectsPage;
