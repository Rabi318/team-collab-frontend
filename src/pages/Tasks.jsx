import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWorkspace } from "../context/WorkspaceContext";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Tasks = () => {
  const { workspaceId } = useParams();
  const { token, user } = useAuth();
  const { currentWorkspace, fetchWorkspaceById } = useWorkspace();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [creatingTask, setCreatingTask] = useState(false);

  // New Task Form States
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState(""); // userId

  // Edit Task Modal States
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // The task object being edited
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("");
  const [editTaskDueDate, setEditTaskDueDate] = useState("");
  const [editTaskAssignedTo, setEditTaskAssignedTo] = useState("");
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

  // Delete Task Confirmation Modal States
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null); // The task object to be deleted
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  // Fetch tasks for the workspace
  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/tasks/workspace/${workspaceId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to load tasks.");
      } finally {
        setLoadingTasks(false);
      }
    };

    if (workspaceId && token) {
      fetchTasks();
      // Also ensure workspace members are fetched for assignment dropdowns.
      // This is crucial because `assignedTo` is not populated on tasks directly.
      if (!currentWorkspace || currentWorkspace._id !== workspaceId) {
        fetchWorkspaceById(workspaceId);
      }
    }
  }, [workspaceId, token, fetchWorkspaceById, currentWorkspace]);

  // Handle Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error("Task title is required.");
      return;
    }

    setCreatingTask(true);
    try {
      const payload = {
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: newTaskDueDate || undefined, // Send undefined if empty
        assignedTo: newTaskAssignedTo || undefined, // Send undefined if empty
        workspaceId,
      };

      const response = await axios.post(`${API_BASE_URL}/tasks`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => [...prevTasks, response.data.data]);
      toast.success("Task created successfully!");
      // Clear form
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
      setNewTaskAssignedTo("");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task.");
    } finally {
      setCreatingTask(false);
    }
  };

  // Open Edit Task Modal
  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || "");
    setEditTaskStatus(task.status);
    // Format date for input type="date"
    setEditTaskDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
    // Set assignedTo to the _id for the select input, as the backend returns an ID string
    setEditTaskAssignedTo(task.assignedTo || ""); // Use task.assignedTo directly if it's an ID string
    setShowEditTaskModal(true);
  };

  // Handle Update Task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask || !editTaskTitle.trim()) {
      toast.error("Task title is required.");
      return;
    }

    setIsUpdatingTask(true);
    try {
      const payload = {
        title: editTaskTitle,
        description: editTaskDescription,
        status: editTaskStatus,
        dueDate: editTaskDueDate || undefined,
        assignedTo: editTaskAssignedTo || undefined, // Send the ID string
      };

      const response = await axios.put(
        `${API_BASE_URL}/tasks/${editingTask._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the tasks state with the newly updated task
      // Note: The response.data.data from update might still have assignedTo as an ID.
      // We'll rely on TaskCard's lookup logic.
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editingTask._id
            ? { ...task, ...response.data.data }
            : task
        )
      );
      toast.success("Task updated successfully!");
      setShowEditTaskModal(false);
      setEditingTask(null); // Clear editing task
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task.");
    } finally {
      setIsUpdatingTask(false);
    }
  };

  // Open Delete Confirmation Modal
  const openConfirmDeleteModal = (task) => {
    setTaskToDelete(task);
    setShowConfirmDeleteModal(true);
  };

  // Handle Delete Task
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    setIsDeletingTask(true);
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskToDelete._id)
      );
      toast.success("Task deleted successfully!");
      setShowConfirmDeleteModal(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task.");
    } finally {
      setIsDeletingTask(false);
    }
  };

  // Filter tasks by status for Kanban columns
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  // Get workspace members for assignment dropdowns
  // Ensure that currentWorkspace and its members.userId are populated
  const workspaceMembers =
    currentWorkspace?.members.filter(
      (member) => member.userId && (member.userId.name || member.userId.email)
    ) || [];

  // Determine if the current user is an admin of this workspace
  const isAdmin = currentWorkspace?.members?.some(
    (member) => member.userId?._id === user?._id && member.role === "admin"
  );

  if (loadingTasks) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Task Board for {currentWorkspace?.name || "Workspace"}
        </h1>

        {/* Create New Task Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Create New Task
          </h2>
          <form
            onSubmit={handleCreateTask}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Task Title (required)"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              title="Due Date"
            />
            <select
              value={newTaskAssignedTo}
              onChange={(e) => setNewTaskAssignedTo(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="">Assign To (optional)</option>
              {workspaceMembers.map((member) => (
                <option key={member.userId._id} value={member.userId._id}>
                  {member.userId.name || member.userId.email}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={creatingTask}
              className={`md:col-span-2 px-6 py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium
                ${
                  creatingTask
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg cursor-pointer"
                }`}
            >
              {creatingTask ? "Creating..." : "Add Task"}
            </button>
          </form>
        </div>

        {/* Kanban Board */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Tasks Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">
                To Do ({todoTasks.length})
              </h3>
              <div className="space-y-3">
                {todoTasks.length > 0 ? (
                  todoTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      openEditTaskModal={openEditTaskModal}
                      openConfirmDeleteModal={openConfirmDeleteModal}
                      isAdmin={isAdmin} // Pass isAdmin prop
                      workspaceMembers={workspaceMembers} // Pass workspaceMembers
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No tasks to do!</p>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 pb-2 border-b border-yellow-200">
                In Progress ({inProgressTasks.length})
              </h3>
              <div className="space-y-3">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      openEditTaskModal={openEditTaskModal}
                      openConfirmDeleteModal={openConfirmDeleteModal}
                      isAdmin={isAdmin} // Pass isAdmin prop
                      workspaceMembers={workspaceMembers} // Pass workspaceMembers
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No tasks in progress.</p>
                )}
              </div>
            </div>

            {/* Done Column */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-green-800 mb-4 pb-2 border-b border-green-200">
                Done ({doneTasks.length})
              </h3>
              <div className="space-y-3">
                {doneTasks.length > 0 ? (
                  doneTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      openEditTaskModal={openEditTaskModal}
                      openConfirmDeleteModal={openConfirmDeleteModal}
                      isAdmin={isAdmin} // Pass isAdmin prop
                      workspaceMembers={workspaceMembers} // Pass workspaceMembers
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No completed tasks.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Task Modal */}
        {showEditTaskModal && editingTask && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Edit Task
              </h3>
              <form onSubmit={handleUpdateTask} className="space-y-4">
                <div>
                  <label
                    htmlFor="editTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="editTitle"
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="editDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="editDescription"
                    value={editTaskDescription}
                    onChange={(e) => setEditTaskDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="editStatus"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="editStatus"
                    value={editTaskStatus}
                    onChange={(e) => setEditTaskStatus(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="editDueDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="editDueDate"
                    value={editTaskDueDate}
                    onChange={(e) => setEditTaskDueDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editAssignedTo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Assigned To
                  </label>
                  <select
                    id="editAssignedTo"
                    value={editTaskAssignedTo}
                    onChange={(e) => setEditTaskAssignedTo(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {workspaceMembers.map((member) => (
                      <option key={member.userId._id} value={member.userId._id}>
                        {member.userId.name || member.userId.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditTaskModal(false)}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingTask}
                    className={`px-5 cursor-pointer py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium
                      ${
                        isUpdatingTask
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                      }`}
                  >
                    {isUpdatingTask ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Task Confirmation Modal */}
        {showConfirmDeleteModal && taskToDelete && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-xs w-full mx-auto text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Confirm Delete
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete task:{" "}
                <span className="font-bold">{taskToDelete.title}</span>? This
                action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmDeleteModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  disabled={isDeletingTask}
                  className={`px-5 py-2 rounded-lg transition-colors duration-200 ease-in-out font-medium
                    ${
                      isDeletingTask
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                >
                  {isDeletingTask ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Task Card Component (reusable for each task)
const TaskCard = ({
  task,
  openEditTaskModal,
  openConfirmDeleteModal,
  isAdmin,
  workspaceMembers,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Due Date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Find the assigned user's details from workspaceMembers
  const assignedMember = workspaceMembers.find(
    (member) => String(member.userId._id) === String(task.assignedTo)
  );
  // console.log(workspaceMembers[0].userId._id);
  // console.log("object", task.assignedTo.name);
  // const assignedUserName = assignedMember
  //   ? assignedMember.userId.name ||
  //     assignedMember.userId.email ||
  //     "Unknown User"
  //   : "Unassigned";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Due: {formatDate(task.dueDate)}</span>
        <span className="flex items-center gap-1">
          <span className="text-gray-700 font-medium">
            Assigned: {task.assignedTo.name}
          </span>
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
            task.status
          )}`}
        >
          {task.status
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </span>
        {isAdmin && ( // Only show buttons if current user is an admin
          <div className="flex gap-2">
            <button
              onClick={() => openEditTaskModal(task)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
              title="Edit Task"
            >
              Edit
            </button>
            <button
              onClick={() => openConfirmDeleteModal(task)}
              className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
              title="Delete Task"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
