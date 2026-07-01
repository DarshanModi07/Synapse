import api from "@/api/axios";

/*
|--------------------------------------------------------------------------
| Get All Departments
|--------------------------------------------------------------------------
*/

export const getDepartments = async (
  workspaceId,
  page = 1,
  limit = 20
) => {
  const response = await api.get(
    `/department/${workspaceId}/departments?page=${page}&limit=${limit}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Department Details
|--------------------------------------------------------------------------
*/

export const getDepartment = async (departmentId) => {
  const response = await api.get(
    `/department/details/${departmentId}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Department
|--------------------------------------------------------------------------
*/

export const createDepartment = async (data) => {
  const response = await api.post(
    "/department/createDepartment",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Department
|--------------------------------------------------------------------------
*/

export const updateDepartment = async (
  departmentId,
  data
) => {
  const response = await api.patch(
    `/department/${departmentId}/update`,
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Department
|--------------------------------------------------------------------------
*/

export const deleteDepartment = async (
  departmentId
) => {
  const response = await api.delete(
    `/department/${departmentId}/delete`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| AI Department Suggestions
|--------------------------------------------------------------------------
*/

export const suggestDepartments = async (
  workspaceId
) => {
  const response = await api.post(
    "/ai/suggest-departments",
    {
      workspaceId,
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Available Managers
|--------------------------------------------------------------------------
*/

export const getAvailableManagers = async (
  departmentId
) => {
  const response = await api.get(
    `/department/${departmentId}/available-managers`
  );

  return response.data;
};