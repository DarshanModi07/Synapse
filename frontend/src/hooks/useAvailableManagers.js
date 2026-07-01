import { useEffect, useState } from "react";
import { getAvailableManagers } from "@/services/department.service";

export const useAvailableManagers = (
  departmentId,
  open
) => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !departmentId) return;

    const fetchManagers = async () => {
      try {
        setLoading(true);

        const response =
          await getAvailableManagers(
            departmentId
          );

        setManagers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [departmentId, open]);

  return {
    managers,
    loading,
  };
};