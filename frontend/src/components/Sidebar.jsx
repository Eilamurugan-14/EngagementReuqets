import "../styles/Sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Engagement Request", path: "/requests" },
    { label: "My Requests", path: "/requests" },
    { label: "Approvals", path: "/approvals" },
    { label: "GCC Approvals", path: "/gcc-approvals" },
  ];

  return (
    <aside className="sidebar">
      {menuItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;