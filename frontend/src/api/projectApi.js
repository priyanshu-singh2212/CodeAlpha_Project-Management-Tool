import api from "./axios";

export const addMemberToProject = (projectId, memberId) => {
  const token = sessionStorage.getItem("token");

  return api.put(
    `/projects/${projectId}/add-member`,
    {
      memberId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const removeMemberFromProject = (projectId, memberId) => {
  const token = sessionStorage.getItem("token");

  return api.put(
    `/projects/${projectId}/remove-member`,
    { memberId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getProjectById = (projectId) => {
  const token = sessionStorage.getItem("token");

  return api.get(`/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};