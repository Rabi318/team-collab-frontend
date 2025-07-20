import axios from "axios";
import { createContext, use, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const API_BASE_URL = import.meta.env.VITE_BASE_URL;
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.data);
      } catch (error) {
        console.log("Token Invalid or expired");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = (token, userData, callback) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(userData);
    if (callback) callback();
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
