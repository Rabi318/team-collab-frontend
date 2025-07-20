import React, { useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import toast from "react-hot-toast";

const CreateWorkspaceModal = ({ isOpen, onClose }) => {
  const { createWorkspace } = useWorkspace();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    await createWorkspace(name);
    setName("");
    setLoading(false);
    toast.success("Workspace created successfully");
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Workspace</h2>
        <input
          type="text"
          placeholder="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading || !name.trim()}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
