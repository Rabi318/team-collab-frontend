import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import { createDocument } from "../services/documentService";
import { useAuth } from "../context/AuthContext";
import { inviteUserToWorkspace } from "../services/workspaceService";
import axios from "axios";
import toast from "react-hot-toast";

const WorkspaceDetail = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { currentWorkspace, fetchWorkspaceById } = useWorkspace();

  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);

  //state for member management modal
  const [showMemberManagementModal, setShowMemberManagementModal] =
    useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMemberRole, setNewMemberRole] = useState("");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);

  useEffect(() => {
    fetchWorkspaceById(workspaceId);
  }, [workspaceId]);

  const handleCreateDocument = async () => {
    if (!title.trim()) {
      toast.error("Document title cannot be empty.");
      return;
    }
    setCreating(true);
    try {
      await createDocument(title, workspaceId, token);
      setTitle("");
      await fetchWorkspaceById(workspaceId); // Refresh to show new doc
      toast.success("Document created successfully!");
    } catch (err) {
      console.error("Failed to create document:", err);
      toast.error("Failed to create document.");
    } finally {
      setCreating(false);
    }
  };
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }
    try {
      setInviting(true);
      const userRes = await axios.get(
        `${API_BASE_URL}/auth/users?email=${inviteEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const user = userRes.data.data;
      if (!user) {
        toast.error("User not Found");
        return;
      }
      const isAlreadyMember = currentWorkspace?.members.some(
        (member) => member.userId?._id === invitedUser._id
      );

      if (isAlreadyMember) {
        toast.error("User is already a member of this workspace.");
        return;
      }
      await inviteUserToWorkspace(workspaceId, user._id, inviteRole, token);
      setInviteEmail("");
      await fetchWorkspaceById(workspaceId);
      toast.success(
        `${invitedUser.name || invitedUser.email} invited as ${inviteRole}!`
      );
    } catch (error) {
      console.log("Invite error", error);
      toast.error("Failed to invite user");
    } finally {
      setInviting(false);
    }
  };

  //function to open the member management modal
  const handleOpenMemberManagement = (member) => {
    setSelectedMember(member);
    setNewMemberRole(member.role);
    setShowMemberManagementModal(true);
  };

  //function to close the member management modal
  const handleCloseMemberManagement = () => {
    setShowMemberManagementModal(false);
    setSelectedMember(null);
    setNewMemberRole("");
    setIsUpdatingRole(false);
    setIsRemovingMember(false);
    setShowConfirmRemoveModal(false);
  };

  //handle updating a member's role
  const handleUpdateMemberRole = async () => {
    if (!selectedMember || !newMemberRole) return;

    if (selectedMember.role === newMemberRole) {
      toast.info("Role is already set to " + newMemberRole);
      handleCloseMemberManagement();
      return;
    }
    setIsUpdatingRole(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/workspaces/${workspaceId}/role/${
          selectedMember.userId._id
        }`,
        {
          role: newMemberRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Role update for ${selectedMember.userId.name}`);
      await fetchWorkspaceById(workspaceId);
      handleCloseMemberManagement();
    } catch (error) {
      console.log("Failed to updated member role", error);
      toast.error("Failed to update member role");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  //Handle removing a member
  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    if (selectedMember.userId._id === user._id) {
      toast.error("Cannot remove yourself");
      setShowConfirmRemoveModal(false);
      return;
    }
    setIsRemovingMember(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/workspaces/${workspaceId}/member/${
          selectedMember.userId._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Removed ${selectedMember.userId.name} from workspace`);
      await fetchWorkspaceById(workspaceId);
      handleCloseMemberManagement();
    } catch (error) {
      console.log("Failed to remove member", error);
      toast.error("Failed to remove member");
    } finally {
      setIsRemovingMember(false);
      setShowConfirmRemoveModal(false);
    }
  };

  //show loading state if worksapce data is not yet availabe
  if (!currentWorkspace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading workspace details...</p>
      </div>
    );
  }
  //Determive if the current user is an admin of this worksapce
  const isAdmin = currentWorkspace?.members?.some(
    (member) => member.userId?._id === user._id && member.role === "admin"
  );
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
        {/* Workspace Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 text-center">
          {currentWorkspace.name}
        </h1>
        <p className="text-md sm:text-lg text-gray-600 mb-4 text-center">
          Workspace ID:{" "}
          <span className="font-mono text-sm">{currentWorkspace._id}</span>
        </p>

        {/* Workspace Members Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Members ({currentWorkspace.members.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentWorkspace.members.map((member, idx) => (
              <div
                key={idx}
                className="bg-purple-50 border border-purple-200 p-4 rounded-lg shadow-sm flex flex-col items-start justify-between" // Added justify-between
              >
                <div>
                  <span className="font-semibold text-lg text-purple-800">
                    {member.userId?.name || "Unnamed User"}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full
                        ${
                          member.role === "admin"
                            ? "bg-red-200 text-red-800"
                            : member.role === "viewer"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                    >
                      {member.role.charAt(0).toUpperCase() +
                        member.role.slice(1)}
                    </span>
                    <span className="text-xs text-gray-600">
                      ({member.status})
                    </span>
                  </div>
                </div>
                {/* Edit button, only visible if the current user is an admin */}
                {isAdmin && (
                  <button
                    onClick={() => handleOpenMemberManagement(member)}
                    className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 cursor-pointer"
                  >
                    Manage Member
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Create New Document Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Create New Document
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-grow border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
              onClick={handleCreateDocument}
              disabled={creating}
              className={`px-6 py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium whitespace-nowrap cursor-pointer
                ${
                  creating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
            >
              {creating ? "Creating..." : "Create Document"}
            </button>
          </div>
        </div>

        {/* NEW: Workspace Actions Section (including View Tasks) */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Workspace Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            {" "}
            {/* Use flex-wrap for responsiveness */}
            <button
              onClick={() =>
                navigate(`/dashboard/workspaces/${workspaceId}/tasks`)
              }
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg flex-grow sm:flex-grow-0 cursor-pointer"
            >
              View Tasks
            </button>
            <button
              onClick={() =>
                navigate(`/dashboard/workspaces/${workspaceId}/chat`)
              }
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-md hover:shadow-lg flex-grow sm:flex-grow-0 cursor-pointer"
            >
              View Chat
            </button>
          </div>
        </div>

        {/* Invite Members Section (only visible to admins) */}
        {isAdmin && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Invite New Member
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="email"
                placeholder="User Email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-grow border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
              <button
                onClick={handleInvite}
                disabled={inviting}
                className={`px-6 py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium whitespace-nowrap
                  ${
                    inviting
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg"
                  }`}
              >
                {inviting ? "Inviting..." : "Invite Member"}
              </button>
            </div>
          </div>
        )}

        {/* List Documents Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Documents
          </h2>
          {currentWorkspace.documents &&
          currentWorkspace.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentWorkspace.documents.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white border border-gray-200 p-5 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-semibold text-lg text-gray-900">
                      {doc.title}
                    </p>
                    <p className="text-sm text-gray-500 font-mono break-all">
                      {doc._id}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/dashboard/documents/${doc._id}`)}
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md whitespace-nowrap cursor-pointer"
                  >
                    Open Document
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No documents available in this workspace. Create one above!
            </p>
          )}
        </div>
        {/* Member management modal */}
        {showMemberManagementModal && selectedMember && (
          <div className="fixed backdrop-blur inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Manage Member: {selectedMember.userId?.name}
              </h3>

              {/* Role Update Selection */}
              <div className="mb-4">
                <label
                  htmlFor="memberRole"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Change Role:
                </label>
                <select
                  id="memberRole"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  onClick={handleUpdateMemberRole}
                  disabled={isUpdatingRole}
                  className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium
                    ${
                      isUpdatingRole || newMemberRole === selectedMember.role
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    }`}
                >
                  {isUpdatingRole ? "Updating..." : "Update"}
                </button>
              </div>

              {/* Remove Member Section */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Remove Member
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  This action will permanently remove this member from the
                  workspace.
                </p>
                <button
                  onClick={() => setShowConfirmRemoveModal(true)} // Show confirmation modal
                  disabled={
                    isRemovingMember || selectedMember.userId._id === user._id
                  } // Disable if removing or if it's self
                  className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium
                    ${
                      isRemovingMember || selectedMember.userId._id === user._id
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700 shadow-md"
                    }`}
                >
                  {isRemovingMember ? "Removing..." : "Remove Member"}
                </button>
              </div>

              {/* Modal close button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseMemberManagement}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for remove Member */}
        {showConfirmRemoveModal && selectedMember && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-xs w-full mx-auto text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Confirm Removal
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to remove{" "}
                <span className="font-bold">
                  {selectedMember.userId?.name || selectedMember.userId?.email}
                </span>{" "}
                from this workspace? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmRemoveModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveMember}
                  disabled={isRemovingMember}
                  className={`px-5 py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium
                    ${
                      isRemovingMember
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                >
                  {isRemovingMember ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceDetail;
