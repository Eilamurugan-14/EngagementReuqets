import { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function ProfileSection({
  title,
  icon,
  children,
  defaultOpen = true,
}) {
  const [open, setOpen] =
    useState(defaultOpen);

  return (
    <section className="profile-section">

      <button
        type="button"
        className="profile-section-header"
        onClick={() =>
          setOpen(!open)
        }
      >
        <div className="profile-section-title">
          {icon}
          <span>{title}</span>
        </div>

        {open ? (
          <KeyboardArrowUpIcon
            className="section-arrow"
          />
        ) : (
          <KeyboardArrowDownIcon
            className={`section-arrow ${
              open ? "open" : ""
            }`}
          />
        )}
      </button>

      <div
          className={`profile-section-body ${
            open ? "open" : ""
          }`}
        >
          {children}
        </div>

    </section>
  );
}

export default ProfileSection;