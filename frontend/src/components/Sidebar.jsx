import "../styles/Sidebar.css";
import { NavLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";

function Sidebar({ collapsed, mobileOpen, onNavigate }) {
  const menuItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { label: "Profile", path: "/profile", icon: <PersonIcon /> },
    {
      label: "Engagement Request",
      path: "/requests",
      icon: <AssignmentIcon />,
    },
    { label: "My Requests", path: "/requests", icon: <DescriptionIcon /> },
    { label: "Approvals", path: "/approvals", icon: <FactCheckIcon /> },
    { label: "GCC Approvals", path: "/gcc-approvals", icon: <GroupsIcon /> },
  ];

  return (
    <aside
      className={`sidebar ${
        collapsed ? "is-collapsed" : ""
      } ${mobileOpen ? "mobile-open" : ""}`}
      aria-label="Main navigation"
    >
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Tooltip
            key={item.label}
            title={collapsed ? item.label : ""}
            placement="right"
            arrow
            disableHoverListener={!collapsed || mobileOpen}
            disableFocusListener={!collapsed || mobileOpen}
          >
            <NavLink
              to={item.path}
              end={item.path === "/"}
              onClick={onNavigate}
              aria-label={item.label}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-item-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="menu-item-label">
                {item.label}
              </span>
            </NavLink>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;