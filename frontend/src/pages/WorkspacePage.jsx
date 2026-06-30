import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import { getWorkspace } from "@/services/workspace.service";
import { useWorkspace } from "@/context/WorkspaceContext";

const WorkspacePage = () => {
  const { slug } = useParams();

  const {
    workspace,
    setWorkspace,
  } = useWorkspace();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        // Prevent unnecessary API call
        if (workspace?.slug === slug) {
          setLoading(false);
          return;
        }

        const response = await getWorkspace(slug);

        setWorkspace(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Workspace not found
      </div>
    );
  }

  const role = workspace.memberRole?.sysRole;

  switch (role) {
    case "owner":
      return <Outlet />;

    case "manager":
      return <Outlet />;

    case "team_lead":
      return <Outlet />;

    case "employee":
      return <Outlet />;

    default:
      return (
        <div className="flex min-h-screen items-center justify-center text-red-500">
          Unauthorized
        </div>
      );
  }
};

export default WorkspacePage;