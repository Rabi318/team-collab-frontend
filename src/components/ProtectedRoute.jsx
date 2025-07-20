import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center p-6">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
