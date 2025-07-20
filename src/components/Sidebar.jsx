import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItemClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
      isActive ? "bg-blue-200 font-bold" : ""
    }`;

  return (
    <div className="w-60 bg-white shadow h-full p-4">
      <h2 className="text-lg font-bold mb-4">TeamSpace</h2>
      <nav className="space-y-2">
        <NavLink to="/dashboard/workspaces" className={navItemClass}>
          Workspaces
        </NavLink>
        <NavLink to="/dashboard/settings" className={navItemClass}>
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
