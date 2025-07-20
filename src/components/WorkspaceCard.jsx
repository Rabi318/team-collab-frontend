import React from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const WorkspaceCard = ({ workspace }) => {
  const { updateMemberStatus } = useWorkspace();
  const { user } = useAuth();
  const navigate = useNavigate();
  // console.log("current user", user._id);

  const currentMember = workspace.members.find((m) => m.userId === user._id);

  const isInvited = currentMember?.status === "invited";
  const handleJoin = async (e) => {
    e.stopPropagation(); // prevent navigation
    try {
      await updateMemberStatus(workspace._id, user._id, "active");
      toast.success("Workspace Activated");
    } catch (error) {
      toast.error("Failed to join workspace");
    }
  };
  const handleCardClick = () => {
    if (!isInvited) {
      navigate(`/dashboard/workspaces/${workspace._id}`);
    }
  };
  return (
    <div
      onClick={handleCardClick}
      className="p-4 bg-white rounded shadow cursor-pointer hover:shadow-lg transition"
    >
      <h2 className="text-lg font-semibold">{workspace.name}</h2>
      <p className="text-gray-600 text-sm mt-1">
        Members: {workspace.members.length}
      </p>
      {isInvited && (
        <button
          onClick={handleJoin}
          className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Accept Invitation
        </button>
      )}
    </div>
  );
};

export default WorkspaceCard;
