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
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";

const RELEASE_VERSION = "skills-matrix-v1";

const releaseNotes = {
  version: RELEASE_VERSION,
  title: "Skills Matrix & Competencies",
  releaseDate: "October 2026",
  summary:
    "A new Skills Matrix & Competencies experience has been added to the Employee Profile page. Employees can now manage, maintain, and showcase professional skills and expertise across software, engineering, manufacturing, quality, and domain areas.",
  features: [
    {
      title: "Add Skills",
      description:
        "Add professional skills directly from your profile.",
    },
    {
      title: "Update Proficiency Levels",
      description:
        "Track expertise from Basic Awareness to Expert.",
    },
    {
      title: "Search Skills",
      description:
        "Quickly find skills by name or category.",
    },
    {
      title: "Categorized Skills",
      description:
        "View skills grouped using category badges.",
    },
    {
      title: "Engineering & Technical Skills",
      description:
        "Support software, mechanical, manufacturing, electrical, quality, and engineering competencies.",
    },
    {
      title: "Skills Dashboard",
      description:
        "View skills in a structured card-based experience.",
    },
  ],
  improvements: [
    "Better profile visibility",
    "Centralized competency management",
    "Improved employee skill tracking",
    "Enhanced skill discoverability through search and sorting",
  ],
  whyThisMatters:
    "This feature helps employees showcase their expertise and keep professional capabilities visible. It supports career development discussions, highlights growth opportunities, and contributes to future workforce planning initiatives.",
  benefits: [
    "Showcase expertise",
    "Maintain professional visibility",
    "Support career development discussions",
    "Highlight growth opportunities",
    "Contribute to future workforce planning initiatives",
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
        <span>🚀 What's New</span>
        <IconButton
          className="skills-release-close"
          aria-label="Close release notes"
          onClick={acknowledgeRelease}
        >
          <CloseIcon />
        </IconButton>
        <span className="skills-release-version">Version 1.0</span>
        <span className="skills-release-date">
          Release Date: {releaseNotes.releaseDate}
        </span>
      </DialogTitle>
      <DialogContent className="skills-release-content">
        <header className="skills-release-header">
          <h2>{releaseNotes.title}</h2>
        </header>

        <section className="skills-release-section">
          <h3>Summary</h3>
          <p>{releaseNotes.summary}</p>
        </section>

        <Divider className="skills-release-divider" />

        <section className="skills-release-section">
          <h3>New Features</h3>
          <div className="skills-release-grid">
            {releaseNotes.features.map((feature) => (
              <article
                className="skills-release-feature"
                key={feature.title}
              >
                <CheckCircleOutlineIcon className="skills-release-check" />
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Divider className="skills-release-divider" />

        <section className="skills-release-section">
          <h3>Improvements</h3>
          <ul className="skills-release-list">
            {releaseNotes.improvements.map((improvement) => (
              <li key={improvement}>{improvement}</li>
            ))}
          </ul>
        </section>

        <Divider className="skills-release-divider" />

        <section className="skills-release-section">
          <h3>Why This Matters</h3>
          <p>{releaseNotes.whyThisMatters}</p>
          <ul className="skills-release-list">
            {releaseNotes.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>

        <Divider className="skills-release-divider" />

        
      </DialogContent>
      <DialogActions className="skills-release-actions">
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