import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm = ({ onSwitchToRegister, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_BASE_URL;
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      console.log("Login success", res.data.token, res.data.data);
      login(res.data.token, res.data.data, () => {
        toast.success(res.data.msg);
        setEmail("");
        setPassword("");
        onClose();
        navigate("/dashboard/workspaces");
      });
      // toast.success(res.data.msg);
      // setEmail("");
      // setPassword("");
      // setTimeout(() => {
      //   onClose();
      //   navigate("/dashboard");
      // }, 1500);
    } catch (err) {
      console.log("Loging Error: ", err);
      if (err.response) {
        if (err.response.data && err.response.data.msg) {
          setError(err.response.data.msg);
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Server Error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError(
          "No response from server. Please check your network connection or try again later."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="text-center">
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Login
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter Your Email "
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter Your Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-md hover:bg-blue-800 transition duration-300 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </div>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-700 hover:underline font-semibold focus:outline-none cursor-pointer"
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
