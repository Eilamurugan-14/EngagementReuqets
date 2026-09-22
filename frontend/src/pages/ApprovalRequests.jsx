import { useEffect, useState } from "react";
import "../styles/ApprovalRequests.css";
import ManagerApprovalGrid from "../components/grids/ManagerApprovalGrid";
import ApprovalModal from "../components/ApprovalModal";
import { getRequests } from "../services/api";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { exportGridData, getExportFileName } from "../utils/exportExcel";

const MANAGER_EXPORT_COLUMNS = [
  "id",
  "employee",
  "department",
  "category",
  "event",
  "eventDate",
  "budget",
  "status",
  "managerComments",
];

const MANAGER_EXPORT_HEADERS = {
  id: "Request ID",
  employee: "Employee Name",
  department: "Department",
  category: "Category",
  event: "Event Title",
  eventDate: "Event Date",
  budget: "Budget",
  status: "Status",
  managerComments: "Manager Comments",
};

const HISTORY_STATUSES = [
  "Approved",
  "Rejected",
  "Escalated to GCC Leader",
  "Pending GCC Leader",
];

function ApprovalRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userType, setUserType] = useState("Manager");
  const [gridApi, setGridApi] = useState(null);
  const [toast, setToast] = useState(null);

  const loadRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching approval requests:", error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending Manager"
  );
  const historyRequests = requests.filter((request) =>
    HISTORY_STATUSES.includes(request.status)
  );
  const visibleRequests =
    activeTab === "requests" ? pendingRequests : historyRequests;

  const handleExport = () => {
    exportGridData({
      api: gridApi,
      fileName: getExportFileName("Manager_Approval_Requests"),
      sheetName: activeTab === "requests" ? "Requests" : "Event History",
      columnKeys: MANAGER_EXPORT_COLUMNS,
      headerNames: MANAGER_EXPORT_HEADERS,
      onSuccess: () => setToast({ type: "success", message: "Excel exported successfully" }),
      onError: () => setToast({ type: "error", message: "Failed to export Excel" }),
    });
  };

  return (
    <main className="approval-page-container">
      <div className="approval-page-heading">
        <h2 className="page-title">Approval Requests</h2>
        <p className="page-subtitle">
          View and approve your engagement requests
        </p>
      </div>

      <div className="approval-toolbar">
        <select
          value={userType}
          onChange={(event) => setUserType(event.target.value)}
          className="role-dropdown"
          aria-label="Select role"
        >
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="GCC Leader">GCC Leader</option>
        </select>
      </div>

      <div className="approval-tabs-row">
        <div className="approval-tabs" role="tablist" aria-label="Approval views">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "requests"}
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "history"}
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            Event History
          </button>
        </div>

        {userType === "Manager" && (
          <button type="button" className="export-btn" onClick={handleExport} disabled={!gridApi}>
            <FileDownloadIcon />
            Export Excel
          </button>
        )}
      </div>

      <ManagerApprovalGrid
        requests={visibleRequests}
        showActions={activeTab === "requests"}
        onView={setSelectedRequest}
        onGridReady={({ api }) => setGridApi(api)}
      />

      <ApprovalModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        refreshRequests={loadRequests}
      />

      {toast && (
        <div className={`export-toast export-toast-${toast.type}`} role="status">
          {toast.message}
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification">×</button>
        </div>
      )}
    </main>
  );
}

export default ApprovalRequests;
