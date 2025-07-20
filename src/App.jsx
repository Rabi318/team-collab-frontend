import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./pages/Footer";
import Dashboard from "./pages/Dashboard";
import toast, { Toaster } from "react-hot-toast";
import Workspaces from "./pages/Workspaces";
import Document from "./pages/Document";
import ChatRoom from "./pages/ChatRoom";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./components/ProtectedRoute";
import WorkspaceDetail from "./pages/WorkspaceDetail";

function App() {
  const location = useLocation();
  const showNavAndFooter = !location.pathname.startsWith("/dashboard");
  return (
    <>
      {showNavAndFooter && <Navbar />}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="workspaces" element={<Workspaces />} />
            <Route
              path="workspaces/:workspaceId"
              element={<WorkspaceDetail />}
            />
            <Route path="workspaces/:workspaceId/tasks" element={<Tasks />} />
            <Route
              path="workspaces/:workspaceId/chat/:channelId?"
              element={<ChatRoom />}
            />
            <Route path="documents/:id" element={<Document />} />

            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
      {showNavAndFooter && <Footer />}
    </>
  );
}

export default App;
