import api from "@/api/axios";

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const editProfile = async (data) => {
  const response = await api.put(
    "/users/profile",
    data
  );

  return response.data;
};

export const uploadAvatar = async (formData) => {
  const response = await api.patch(
    "/users/avatar",
    formData
  );

  return response.data;
};