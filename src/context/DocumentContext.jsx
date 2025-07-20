import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const DocumentContext = createContext();

export const useDocument = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
  const [content, setContent] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [versions, setVersions] = useState([]);
  const { token } = useAuth();
  const fetchCollaborators = async (documentId) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/documents/${documentId}/collaborators`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCollaborators(res.data.data);
    } catch (error) {
      console.log("Failed to fetch collab", error);
    }
  };
  return (
    <DocumentContext.Provider
      value={{
        content,
        setContent,
        collaborators,
        setCollaborators,
        versions,
        setVersions,
        fetchCollaborators,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
