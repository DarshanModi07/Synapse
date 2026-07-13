import { useState, useEffect } from "react";
import { getManagerDepartmentDashboard } from "@/services/manager.service";

export const useManagerDepartmentDashboard = (departmentId) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!departmentId) return;
        setLoading(true);
        const res = await getManagerDepartmentDashboard(departmentId);
        setDashboard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [departmentId]);

  return { dashboard, loading, setDashboard };
};
