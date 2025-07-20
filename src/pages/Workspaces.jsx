import React, { useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import CreateWorkspaceModal from "../components/CreateWorkspaceModal";
import WorkspaceCard from "../components/WorkspaceCard";
import { useAuth } from "../context/AuthContext";

const Workspaces = () => {
  const { workspaces, loading } = useWorkspace();
  const [showModal, setShowModal] = useState(false);
  const { user, token } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Workspaces</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Workspace
        </button>
      </div>

      {loading ? (
        <p>Loading workspaces...</p>
      ) : workspaces.length === 0 ? (
        <p>No workspaces yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace._id} workspace={workspace} />
          ))}
        </div>
      )}

      <CreateWorkspaceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Workspaces;
