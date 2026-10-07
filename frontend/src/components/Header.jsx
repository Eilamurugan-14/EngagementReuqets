import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import "../styles/Header.css";

function Header({ onMenuClick, mobileOpen }) {
  return (
    <header className="header">
      <div className="header-left">
        <IconButton
          className="header-menu-toggle"
          aria-label={mobileOpen ? "Close navigation" : "Toggle navigation"}
          onClick={onMenuClick}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <h2 className="logo">xOps</h2>
      </div>

      <div className="header-right">
        <NotificationsIcon />

        <div className="profile">
          H
        </div>
      </div>
    </header>
  );
}

export default Header;