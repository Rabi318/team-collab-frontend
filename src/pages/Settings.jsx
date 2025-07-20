import React, { useState, useEffect, use } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL;

// Helper function to construct the full avatar URL
const getFullAvatarUrl = (avatarPath, baseUrl) => {
  if (!avatarPath) return null;
  // Check if it's already a full URL (e.g., blob: for local preview or external URL)
  if (
    avatarPath.startsWith("http://") ||
    avatarPath.startsWith("https://") ||
    avatarPath.startsWith("blob:")
  ) {
    return avatarPath;
  }
  // Otherwise, prepend the base URL
  return `${baseUrl}${avatarPath}`;
};

const Settings = () => {
  const { token, user, setUser } = useAuth();

  // Profile Update States
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState(null); // Holds the selected File object
  // Initialize previewUrl by constructing the full URL from user.avatar
  const [previewUrl, setPreviewUrl] = useState(
    getFullAvatarUrl(user?.avatar, API_BASE_URL)
  );
  const [loading, setLoading] = useState(false);

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  // Effect to synchronize name and previewUrl with user data from context
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      const newAvatarUrl = getFullAvatarUrl(user.avatar, AVATAR_BASE_URL);

      if (previewUrl !== newAvatarUrl) {
        setPreviewUrl(newAvatarUrl);
      }
    }

    // Cleanup function for object URLs created by URL.createObjectURL
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [user, previewUrl]);
  // Handle file input change for avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // Store the actual file
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl); // Set the new blob URL for immediate local preview
    } else {
      setAvatarFile(null);
      setPreviewUrl(getFullAvatarUrl(user?.avatar, AVATAR_BASE_URL));
    }
  };

  // Handle profile update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      let hasChanges = false;

      // Only append name if it has changed from the initial user.name
      if (name !== user?.name) {
        formData.append("name", name);
        hasChanges = true;
      }
      if (avatarFile) {
        // Only append avatar if a new file is selected
        formData.append("avatar", avatarFile);
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.info("No changes to save.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/auth/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for FormData
          },
        }
      );
      // setUser will update the user context, which in turn triggers the useEffect
      // to update `previewUrl` with the new `user.avatar` (full URL) from the backend response.
      setUser(response.data.data);
      toast.success("Profile updated successfully!");
      setAvatarFile(null); // Clear the file input state after successful upload
      // The previewUrl will be updated by the useEffect due to user context change
    } catch (error) {
      console.error("Update Profile Error", error);
      toast.error(error.response?.data?.msg || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change submission
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      // Basic password length validation
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setPassLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/auth/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password Update Error", error);
      toast.error(error.response?.data?.msg || "Failed to update password.");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Account Settings
        </h1>

        {/* Update Profile Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">
            Update Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Display and Input */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-md">
                {previewUrl ? ( // Use previewUrl here
                  <img
                    src={previewUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-800 text-5xl font-bold">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : user?.email
                      ? user.email.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white text-sm font-medium"
                  title="Change Avatar"
                >
                  Change
                </label>
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Hide the default file input
              />
            </div>

            {/* Email Display (Non-editable) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Your email cannot be changed.
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Updating Profile..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="border-t border-gray-200 pt-6 mt-10">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
              />
            </div>
            <button
              type="submit"
              disabled={passLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg
                ${
                  passLoading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {passLoading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
