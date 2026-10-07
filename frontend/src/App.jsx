import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import EngagementRequests from "./pages/EngagementRequests";
import ApprovalRequests from "./pages/ApprovalRequests";
import GCCApprovalRequests from "./pages/GCCApprovalRequests";
import Profile from "./pages/Profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/App.css";


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

export default App;