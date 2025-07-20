import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const inviteUserToWorkspace = async (
  workspaceId,
  userId,
  role,
  token
) => {
  const res = await axios.post(
    `${API_BASE_URL}/workspaces/${workspaceId}/invite`,
    { userId, role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
};
