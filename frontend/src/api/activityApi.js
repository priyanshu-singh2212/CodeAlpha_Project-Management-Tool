import api from "./axios";

export const getProjectActivity = (projectId) => {
  return api.get(`/activity/${projectId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};