import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import "../styles/Header.css";
import Badge from "@mui/material/Badge";
import { useState } from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useEffect } from "react";

import { getPublishedReleaseNotes,} from "../services/api";

import ReleaseNotePreviewDialog from "./ReleaseNotePreviewDialog";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function Header({ onMenuClick, mobileOpen }) {

  const [anchorEl, setAnchorEl] =
  useState(null);

  const [unreadCount, setUnreadCount] =
  useState(0);

  const [
  releaseNotes,
  setReleaseNotes
] = useState([]);

  const [previewOpen, setPreviewOpen] =
  useState(false);

  const [
  selectedReleaseNote,
  setSelectedReleaseNote
] = useState(null);

const [activeTab, setActiveTab] =
  useState("release-notes");

  function openNotifications(
  event
) {
  setAnchorEl(
    event.currentTarget
  );
}

 function closeNotifications() {
  setAnchorEl(null);
}

function openReleaseNote(
  note
) {

  markReleaseAsRead(
    note.ReleaseNoteId
  );

  setSelectedReleaseNote(
    note
  );

  closeNotifications();

  setPreviewOpen(true);

  loadNotifications();
}

function markReleaseAsRead(
  releaseNoteId
) {

  localStorage.setItem(
    `read_release_note_${releaseNoteId}`,
    "true"
  );

}

async function loadNotifications() {
  try {

    const notes =
      await getPublishedReleaseNotes();

    setReleaseNotes(notes);

   const unreadNotes =
  notes.filter(note => {

    const isRead =
      localStorage.getItem(
        `read_release_note_${note.ReleaseNoteId}`
      );

    return !isRead;

  });

    setUnreadCount(
      unreadNotes.length
    );

  } catch (error) {

    console.error(error);

  }
}

useEffect(() => {

  loadNotifications();

  window.addEventListener(
    "storage",
    loadNotifications
  );

  return () => {

    window.removeEventListener(
      "storage",
      loadNotifications
    );

  };

}, []);
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
        <IconButton
        onClick={
          openNotifications
        }
      >
       <Badge
          badgeContent={
            unreadCount > 99
              ? "99+"
              : unreadCount
          }
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor:
                "#007DA3",
              color: "white",
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeNotifications}
        PaperProps={{
          sx: {
            width: 420,
            maxHeight: 550,
            borderRadius: "12px",
            mt: 1,
            overflow: "hidden",
          },
        }}
      >
     <div
      style={{
        background: "#F8FBFC",
        borderBottom: "1px solid #E5E7EB",
      }}
    >

      <div
        style={{
          padding: "16px 20px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Notifications
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#6B7280",
            }}
          >
            Stay updated with the latest changes
          </div>

        </div>

        <div
          style={{
            background: "#E6F7FB",
            color: "#007DA3",
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {unreadCount} Unread
        </div>

      </div>

    </div>

    <Tabs
      value={activeTab}
      onChange={(_, value) =>
        setActiveTab(value)
      }
      sx={{
        px: 2,
        background: "#F8FBFC",

        "& .MuiTabs-indicator": {
          backgroundColor: "#007DA3",
        },

        "& .Mui-selected": {
          color: "#007DA3 !important",
        },
      }}
    >
      <Tab
        value="release-notes"
        label="Release Notes"
      />

      <Tab
        value="announcements"
        label="Announcements"
      />
    </Tabs>

{activeTab === "release-notes" && (
   releaseNotes.length === 0 ? (

  <MenuItem>
    No Release Notes
  </MenuItem>

) : (

  releaseNotes.map(note => (

    <MenuItem
      key={
        note.ReleaseNoteId
      }
      onClick={() =>
        openReleaseNote(
          note
        )
      }

      sx={{
        borderLeft:
          localStorage.getItem(
            `read_release_note_${note.ReleaseNoteId}`
          )
            ? "none"
            : "4px solid #007DA3",

        backgroundColor:
          localStorage.getItem(
            `read_release_note_${note.ReleaseNoteId}`
          )
            ? "transparent"
            : "#F4FAFC",

        alignItems: "flex-start",

        py: 2,

        transition: "all 0.2s ease",

        "&:hover": {
          backgroundColor: "#EEF7FA",
        },
      }}
    >

      <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "4px",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >

        <RocketLaunchIcon
          sx={{
            color: "#007DA3",
            fontSize: 18,
          }}
        />

        <div
          style={{
            fontWeight: 600,
            color: "#111827",
            fontSize: "15px",
          }}
        >
          {note.Title}
        </div>

      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#007DA3",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        <span>
          Version {note.Version}
        </span>

        <span
          style={{
            color: "#94A3B8",
          }}
        >
          • Recently Published
        </span>
      </div>

      <div
        style={{
          color: "#6B7280",
          fontSize: "12px",
          lineHeight: 1.5,
          marginTop: "2px",
        }}
      >
        {note.Summary?.length > 70
          ? `${note.Summary.slice(
              0,
              70
            )}...`
          : note.Summary}
      </div>

    </div>

    </MenuItem>

  ))
)

)}


{activeTab ===
  "announcements" && (

  <MenuItem
    disabled
  >
    No announcements available
  </MenuItem>

)}

<div
  style={{
    borderTop:
      "1px solid #E5E7EB",

    padding: "12px 20px",

    textAlign: "center",

    color: "#007DA3",

    fontWeight: 600,

    cursor: "pointer",

    background: "#FAFCFD",
  }}
>
  View Release History →
</div>

</Menu>

        <div className="profile">
          H
        </div>
      </div>

      <ReleaseNotePreviewDialog
        open={previewOpen}
        releaseNote={selectedReleaseNote}
        onClose={() => { setPreviewOpen(false); loadNotifications();}}
      />
    </header>
  );
}

export default Header;