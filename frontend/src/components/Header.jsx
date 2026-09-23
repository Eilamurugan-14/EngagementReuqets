import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <MenuIcon />
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