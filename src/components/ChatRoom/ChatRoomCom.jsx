import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWorkspace } from "../../context/WorkspaceContext";
import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const ChatRoomCom = () => {
  const { workspaceId, channelId } = useParams();
  const { token, user } = useAuth();
  const { currentWorkspace, fetchWorkspaceById } = useWorkspace();

  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelIsPrivate, setNewChannelIsPrivate] = useState(false);
  const [newChannelMembers, setNewChannelMembers] = useState([]); // Array of user IDs for private channels
  const [creatingChannel, setCreatingChannel] = useState(false);

  //ref to auto scroll the message
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceById(workspaceId);
    }
  }, [workspaceId, fetchWorkspaceById]);

  //fetch chat channels for the worksapce
  useEffect(() => {
    const fetchChannels = async () => {
      setLoadingChannels(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/chat/workspace/${workspaceId}/channels`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChannels(response.data.data);
        if (channelId) {
          const foundChannel = response.data.data.find(
            (ch) => ch._id === channelId
          );
          if (foundChannel) {
            setSelectedChannel(foundChannel);
          } else if (response.data.data.length > 0) {
            setSelectedChannel(response.data.data[0]);
            navigate(
              `/dashboard/workspaces/${workspaceId}/chat/${response.data.data[0]._id}`,
              { replace: true }
            );
          }
        } else if (response.data.data.length > 0) {
          setSelectedChannel(response.data.data[0]);
          navigate(
            `/dashboard/workspaces/${workspaceId}/chat/${response.data.data[0]._id}`,
            { replace: true }
          );
        }
      } catch (error) {
        console.error("Failed to fetch channels:", error);
        toast.error("Failed to load chat channels.");
      } finally {
        setLoadingChannels(false);
      }
    };
    if (workspaceId && token) {
      fetchChannels();
    }
  }, [workspaceId, token, channelId]);

  //stocket connection and handlig the messages
  useEffect(() => {
    if (!token || !user?._id) return;

    socket.current = io(SOCKET_URL, {
      auth: { token },
      query: { userId: user._id },
    });
    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);
      if (selectedChannel) {
        socket.current.emit("join-chat", { channelId: selectedChannel._id });
      }
    });
    socket.current.on("receive-message", (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => {
        // Prevent duplicate messages if the message is already in state
        if (prevMessages.some((m) => m._id === message._id)) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    });
    socket.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      toast.error("Chat connection error.");
    });
    return () => {
      // Clean up socket on component unmount or channel change
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [token, user?._id, selectedChannel?._id, SOCKET_URL]);

  //fetch messages for the selected channel
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChannel?._id) {
        setMessages([]);
        return;
      }
      setLoadingMessages(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/chat/channel/${selectedChannel._id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data.data);
      } catch (error) {
        console.log("Failed to fech messages:", error);
        toast.error("Failed to Load Messages.");
      } finally {
        setLoadingMessages(false);
      }
    };
    if (selectedChannel?._id && token) {
      fetchMessages();
      if (socket.current && socket.current.connected) {
        socket.current.emit("join-chat", { channelId: selectedChannel._id });
      }
    }
  }, [selectedChannel?._id, token, API_BASE_URL]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //handle for sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageContent.trim() || !selectedChannel?._id || !user?._id) {
      return;
    }
    setSendingMessage(true);
    try {
      if (socket.current && socket.current.connected) {
        socket.current.emit("send-message", {
          channelId: selectedChannel._id,
          senderId: user._id,
          content: newMessageContent,
          type: "text", // Assuming only text for now
        });
        setNewMessageContent(""); // Clear input immediately
      } else {
        toast.error("Chat connection not established. Please try again.");
      }
    } catch (error) {
      console.error("Error emitting message:", error);
      toast.error("Failed to send message.");
    } finally {
      setSendingMessage(false);
    }
  };

  //handle creating a new channel
  const handleCreateChannel = async (e) => {
    console.log("Inside the function");
    e.preventDefault();
    if (!newChannelName.trim()) {
      toast.error("Channel name cannot be empty.");
      return;
    }
    if (!workspaceId) {
      toast.error("Workspace not found.");
      return;
    }
    setCreatingChannel(true);
    try {
      const payload = {
        name: newChannelName,
        workspaceId,
        isPrivate: newChannelIsPrivate,
        members: newChannelIsPrivate ? newChannelMembers : [],
      };
      console.log("Playload", payload);
      const response = await axios.post(
        `${API_BASE_URL}/chat/channels`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Channel "${response.data.data.name}" created!`);
      setChannels((prev) => [...prev, response.data.data]);
      setShowCreateChannelModal(false);
      setNewChannelName("");
      setNewChannelIsPrivate(false);
      setNewChannelMembers([]);
      // Optionally, select the newly created channel
      setSelectedChannel(response.data.data);
      navigate(
        `/dashboard/workspaces/${workspaceId}/chat/${response.data.data._id}`,
        { replace: true }
      );
    } catch (error) {
      console.error("Failed to create channel:", error);
      toast.error(error.response?.data?.msg || "Failed to create channel.");
    } finally {
      setCreatingChannel(false);
    }
  };
  // Get workspace members for private channel creation dropdown
  const workspaceMembers =
    currentWorkspace?.members.filter(
      (member) =>
        member.userId &&
        (member.userId.name || member.userId.email) &&
        member.userId._id !== user._id
    ) || []; // Exclude current user from selectable members

  if (loadingChannels) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading chat...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Chat Header */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between z-10">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          {currentWorkspace?.name || "Workspace"} Chat
        </h1>
        <button
          onClick={() => setShowCreateChannelModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md"
        >
          + New Channel
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Channel List Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto flex-shrink-0 hidden md:block">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
            Channels
          </h2>
          <ul className="space-y-2">
            {channels.length > 0 ? (
              channels.map((ch) => (
                <li key={ch._id}>
                  <button
                    onClick={() => setSelectedChannel(ch)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200
                      ${
                        selectedChannel?._id === ch._id
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-700 text-gray-200"
                      }`}
                  >
                    #{ch.name}{" "}
                    {ch.isPrivate && (
                      <span className="text-xs ml-1">(Private)</span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-sm">
                No channels yet. Create one!
              </p>
            )}
          </ul>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white border-l border-gray-200">
          {selectedChannel ? (
            <>
              {/* Current Channel Header */}
              <div className="bg-gray-100 p-4 border-b border-gray-200 shadow-sm flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  #{selectedChannel.name}{" "}
                  {selectedChannel.isPrivate && (
                    <span className="text-sm text-gray-600">(Private)</span>
                  )}
                </h3>
                {/* Mobile channel selector */}
                <select
                  className="md:hidden border rounded-md px-2 py-1 bg-white text-gray-800"
                  value={selectedChannel._id}
                  onChange={(e) =>
                    setSelectedChannel(
                      channels.find((ch) => ch._id === e.target.value)
                    )
                  }
                >
                  {channels.map((ch) => (
                    <option key={ch._id} value={ch._id}>
                      #{ch.name} {ch.isPrivate ? "(Private)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Messages Display */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                {loadingMessages ? (
                  <p className="text-center text-gray-600">
                    Loading messages...
                  </p>
                ) : messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender?._id === user?._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-md p-3 rounded-lg shadow-sm ${
                          message.sender?._id === user?._id
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1">
                          {message.sender?._id === user?._id
                            ? "You"
                            : message.sender?.name ||
                              message.sender?.email ||
                              "Unknown User"}
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <div className="text-right text-xs mt-1 opacity-75">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">
                    No messages yet. Start the conversation!
                  </p>
                )}
                <div ref={messagesEndRef} /> {/* Scroll target */}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 bg-white"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessageContent.trim()}
                    className={`px-6 py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium
                      ${
                        sendingMessage || !newMessageContent.trim()
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                      }`}
                  >
                    {sendingMessage ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600">
              <p>Select a channel or create a new one to start chatting.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateChannelModal && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Create New Channel
            </h3>
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label
                  htmlFor="channelName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Channel Name
                </label>
                <input
                  type="text"
                  id="channelName"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newChannelIsPrivate}
                  onChange={(e) => setNewChannelIsPrivate(e.target.checked)}
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor="isPrivate"
                  className="text-sm font-medium text-gray-700"
                >
                  Private Channel
                </label>
              </div>
              {newChannelIsPrivate && (
                <div>
                  <label
                    htmlFor="privateMembers"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Members (for private channel)
                  </label>
                  <select
                    id="privateMembers"
                    multiple
                    value={newChannelMembers}
                    onChange={(e) =>
                      setNewChannelMembers(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        )
                      )
                    }
                    className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 overflow-y-auto"
                  >
                    {workspaceMembers.map((member) => (
                      <option key={member.userId._id} value={member.userId._id}>
                        {member.userId.name || member.userId.email}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple.
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateChannelModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingChannel}
                  className={`px-5 py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium
                    ${
                      creatingChannel
                        ? "bg-purple-300 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700 shadow-md"
                    }`}
                >
                  {creatingChannel ? "Creating..." : "Create Channel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoomCom;
