import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  //fetch workspace user is part of
  const fetchWorkspaces = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/workspaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkspaces(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch worksapaces", error);
      toast.error("Failed to load workspace.");
    } finally {
      setLoading(false);
    }
  };

  //Fetch a single worksapce by id
  const fetchWorkspaceById = async (workspaceId) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/workspaces/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentWorkspace(res.data.data);
    } catch (error) {
      console.log("Failed to fetch worksapaces", error);
    } finally {
      setLoading(false);
    }
  };

  //create a new workspace
  const createWorkspace = async (name) => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/workspaces`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newWorkspace = res.data.data;

      // Update state directly
      setWorkspaces((prev) => [...prev, newWorkspace]);

      return newWorkspace;
    } catch (error) {
      console.log(error);
    }
  };
  // Inside WorkspaceProvider component

  const updateMemberStatus = async (workspaceId, memberId, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/workspaces/${workspaceId}/status/${memberId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh workspace list
      await fetchWorkspaces();
    } catch (error) {
      console.error("Failed to update member status:", error);
    }
  };

  useEffect(() => {
    if (token) fetchWorkspaces();
  }, [token]);
  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        loading,
        setCurrentWorkspace,
        fetchWorkspaceById,
        fetchWorkspaces,
        createWorkspace,
        updateMemberStatus,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
