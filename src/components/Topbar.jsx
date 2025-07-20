import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <div>📁 Quick Access</div>
      <div className="flex items-center gap-4">
        <span>{user?.name}</span>
        <img
          src={`https://api.dicebear.com/8.x/initials/svg?seed=${
            user?.name || "U"
          }`}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
