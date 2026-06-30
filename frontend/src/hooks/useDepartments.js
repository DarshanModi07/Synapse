import { useCallback, useEffect, useState } from "react";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/services/department.service";

export const useDepartments = (workspaceId) => {
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [updating, setUpdating] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [pagination, setPagination] = useState(null);

  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(
    async (page = 1) => {
      if (!workspaceId) return;

      try {
        setLoading(true);

        const response = await getDepartments(
          workspaceId,
          page
        );

        setDepartments(response.data);

        setPagination(response.pagination);

        setError(null);
      } catch (err) {
        console.error(err);

        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId]
  );

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const addDepartment = async (name) => {
    try {
      setCreating(true);

      await createDepartment({
        workspaceId,
        name,
      });

      await fetchDepartments();
    } finally {
      setCreating(false);
    }
  };

  const editDepartment = async (
    departmentId,
    data
  ) => {
    try {
      setUpdating(true);

      await updateDepartment(
        departmentId,
        data
      );

      await fetchDepartments();
    } finally {
      setUpdating(false);
    }
  };

  const removeDepartment = async (
    departmentId
  ) => {
    try {
      setDeleting(true);

      await deleteDepartment(
        departmentId
      );

      await fetchDepartments();
    } finally {
      setDeleting(false);
    }
  };

  return {
    departments,

    pagination,

    loading,

    creating,

    updating,

    deleting,

    error,

    refresh: fetchDepartments,

    addDepartment,

    editDepartment,

    removeDepartment,
  };
};