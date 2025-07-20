import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function RegisterForm({ onSwitchToLogin, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const API_BASE_URL = import.meta.env.VITE_BASE_URL;
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      // console.log("Register success", res.data);
      // setSuccessMsg(res.data.msg);
      toast.success(res.data.msg);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        onClose();
        onSwitchToLogin();
      }, 1500);
    } catch (err) {
      console.log("Register error", err);
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
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Create Your Account
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-700 hover:underline font-semibold focus:outline-none"
        >
          Login here
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;
