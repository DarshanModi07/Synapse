import { useState, useEffect } from "react";
import { getManagerDepartments } from "@/services/manager.service";

export const useManagerDepartments = (workspaceId) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        if (!workspaceId) return;
        setLoading(true);
        const res = await getManagerDepartments(workspaceId);
        setDepartments(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [workspaceId]);

  return { departments, loading, setDepartments };
};
