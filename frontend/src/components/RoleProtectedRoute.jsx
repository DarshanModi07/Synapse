import { Navigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";

const RoleProtectedRoute = ({ allowedRole, children }) => {
  const { workspace } = useWorkspace();
  const { slug } = useParams();

  if (!workspace) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-white">
        Loading Workspace...
      </div>
    );
  }

  const sysRole = workspace.memberRole?.sysRole;

  if (sysRole !== allowedRole) {
    const basePath = `/workspace/${slug}`;
    if (sysRole === "owner") return <Navigate to={basePath} replace />;
    if (sysRole === "manager") return <Navigate to={`${basePath}/manager`} replace />;
    if (sysRole === "team_lead") return <Navigate to={`${basePath}/team-lead`} replace />;
    if (sysRole === "employee") return <Navigate to={`${basePath}/employee`} replace />;
    
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
