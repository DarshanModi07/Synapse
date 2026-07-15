import { useState, useEffect } from "react";
import teamLeadProjectService from "../services/teamLeadProject.service";

export const useTeamLeadProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await teamLeadProjectService.getProjects();
        setProjects(data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};
