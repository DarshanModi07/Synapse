import api from "@/api/axios";

export const getNotifications = async (
  page = 1,
  limit = 20
) => {
  const response = await api.get(
    `/notification/allNotifications?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get(
    "/notification/unreadCount"
  );

  return response.data;
};

export const markNotificationRead =
  async (notificationId) => {
    const response = await api.patch(
      `/notification/${notificationId}/read`
    );

    return response.data;
  };

export const markAllNotificationsRead =
  async () => {
    const response = await api.patch(
      "/notification/read-all"
    );

    return response.data;
  };