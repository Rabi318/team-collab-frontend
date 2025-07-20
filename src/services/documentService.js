import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchDocumentById = async (docId, token) => {
  const res = await axios.get(`${API_BASE_URL}/documents/${docId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const updateDocumentContent = async (docId, content, token) => {
  await axios.put(
    `${API_BASE_URL}/documents/${docId}`,
    { content },
    { headers: { authorization: `Bearer ${token}` } }
  );
};

export const createDocument = async (title, workspaceId, token) => {
  const res = await axios.post(
    `${API_BASE_URL}/documents`,
    { title, workspaceId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data;
};
