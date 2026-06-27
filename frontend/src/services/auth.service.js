import api from "@/api/axios";


export const registerUser = async (data) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};


export const loginUser = async (data) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};


export const logout = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};

export const editProfile = async (
  data
) => {
  const response = await api.patch(
    "/users/profile",
    data
  );

  return response.data;
};