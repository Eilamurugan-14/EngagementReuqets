import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import EngagementRequests from "./pages/EngagementRequests";
import ApprovalRequests from "./pages/ApprovalRequests";
import GCCApprovalRequests from "./pages/GCCApprovalRequests";
import Profile from "./pages/Profile";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import InsightsIcon from "@mui/icons-material/Insights";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";

const RELEASE_VERSION = "skills-matrix-v1";

const releaseNotes = {
  version: RELEASE_VERSION,
  title: "Skills Matrix & Competencies",
  description:
    "Track, manage, and showcase your professional skills directly from your profile.",
  features: [
    {
      icon: <AddCircleOutlineIcon />,
      title: "Add Skills",
      description:
        "Add software, engineering, manufacturing, and domain skills.",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Update Proficiency",
      description:
        "Maintain proficiency levels from Basic Awareness to Expert.",
    },
    {
      icon: <SearchIcon />,
      title: "Search Skills",
      description:
        "Quickly find skills by name or category.",
    },
    {
      icon: <CategoryIcon />,
      title: "Categorized Skills",
      description:
        "Review skills grouped with clear category badges.",
    },
    {
      icon: <InsightsIcon />,
      title: "Skill Insights",
      description:
        "View competencies in a structured, professional format.",
    },
    {
      icon: <AccountCircleOutlinedIcon />,
      title: "Profile Integration",
      description:
        "Keep your skills together with your employee profile.",
    },
  ],
  benefits: [
    "Showcase expertise",
    "Maintain skill visibility",
    "Support career growth",
    "Enable better workforce planning",
    "Highlight learning and development opportunities",
  ],
};

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);
  const [mobileOpen, setMobileOpen] =
    useState(false);
  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia(
      "(max-width: 767px)"
    );

    const updateViewport = () => {
      setIsMobile(mobileQuery.matches);

      if (!mobileQuery.matches) {
        setMobileOpen(false);
      }
    };

    updateViewport();
    mobileQuery.addEventListener(
      "change",
      updateViewport
    );

    return () => {
      mobileQuery.removeEventListener(
        "change",
        updateViewport
      );
    };
  }, []);

  function handleMenuClick() {
    if (isMobile) {
      setMobileOpen((open) => !open);
      return;
    }

    setSidebarCollapsed((collapsed) => !collapsed);
  }

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeButton
        theme="colored"
      />
      <SkillsReleaseNotes />
      <Header
        onMenuClick={handleMenuClick}
        mobileOpen={mobileOpen}
      />

      <div className="app-layout">
        <button
          type="button"
          className={`sidebar-backdrop ${
            mobileOpen ? "visible" : ""
          }`}
          aria-label="Close navigation"
          aria-hidden={!mobileOpen}
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
        />
        <Sidebar
          collapsed={sidebarCollapsed && !isMobile}
          mobileOpen={mobileOpen}
          onNavigate={() => setMobileOpen(false)}
        />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<EngagementRequests />} />
            <Route path="/requests" element={<EngagementRequests />} />
            <Route path="/approvals" element={<ApprovalRequests />} />
            <Route path="/gcc-approvals" element={<GCCApprovalRequests />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function SkillsReleaseNotes() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const storageKey = `release_notes_${releaseNotes.version}`;

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      setOpen(true);
    }
  }, [storageKey]);

  function acknowledgeRelease() {
    localStorage.setItem(storageKey, "seen");
    setOpen(false);
  }

  function exploreSkills() {
    acknowledgeRelease();
    navigate("/profile");
    window.setTimeout(() => {
      document
        .getElementById("skills-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <Dialog
      open={open}
      onClose={acknowledgeRelease}
      maxWidth="md"
      fullWidth
      className="skills-release-dialog"
      aria-labelledby="skills-release-title"
    >
      <DialogTitle
        id="skills-release-title"
        className="skills-release-heading"
      >
        🚀 What's New
      </DialogTitle>
      <DialogContent className="skills-release-content">
        <h2>{releaseNotes.title}</h2>
        <p className="skills-release-description">
          {releaseNotes.description}
        </p>

        <div className="skills-release-grid">
          {releaseNotes.features.map((feature) => (
            <article
              className="skills-release-feature"
              key={feature.title}
            >
              <div className="skills-release-feature-icon">
                {feature.icon}
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>

        <section className="skills-release-benefits">
          <h3>Why this matters</h3>
          <p>This feature helps employees:</p>
          <ul>
            {releaseNotes.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>
      </DialogContent>
      <DialogActions className="skills-release-actions">
        <Button onClick={acknowledgeRelease}>
          Got It
        </Button>
        <Button
          variant="contained"
          onClick={exploreSkills}
        >
          Explore Skills
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default App;