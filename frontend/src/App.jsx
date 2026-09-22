import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import EngagementRequests from "./pages/EngagementRequests";
import ApprovalRequests from "./pages/ApprovalRequests";
import GCCApprovalRequests from "./pages/GCCApprovalRequests";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/App.css";


function App() {
  return (
    <BrowserRouter>
      <Header />

      <div className="app-layout">
        <Sidebar />
        <Routes>
          <Route path="/" element={<EngagementRequests />} />
          <Route path="/requests" element={<EngagementRequests />} />
          <Route path="/approvals" element={<ApprovalRequests />} />
          <Route path="/gcc-approvals" element={<GCCApprovalRequests />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;