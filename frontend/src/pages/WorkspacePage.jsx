import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import { getWorkspace } from "@/services/workspace.service";
import { useWorkspace } from "@/context/WorkspaceContext";

const WorkspacePage = () => {
  const { slug } = useParams();

  const { setWorkspace, clearWorkspace } = useWorkspace();

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchWorkspace = async () => {
    try {
      const response = await getWorkspace(slug);
      setWorkspace(response.data);
    } catch (err) {
      console.error(err);
      clearWorkspace();
    } finally {
      setLoading(false);
    }
  };

  fetchWorkspace();
}, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Workspace...
      </div>
    );
  }

  return <Outlet />;
};

export default WorkspacePage;