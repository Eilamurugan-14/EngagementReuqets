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

const STATUS_OPTIONS = [
  "All Statuses",
  "Pending Manager",
  "Pending GCC Leader",
  "Approved",
  "Rejected",
];

const DEPARTMENTS = [
  "All Departments",
  "Engineering",
  "Operations",
  "Finance",
  "HR",
  "Marketing",
];

const YEARS = [
  "All Years",
  "2024",
  "2025",
  "2026",
  "2027",
];

const QUARTERS = [
  "All Quarters",
  "Q1",
  "Q2",
  "Q3",
  "Q4",
];

const initialFilters = {
  search: "",
  year: "All Years",
  quarter: "All Quarters",
  department: "All Departments",
  status: "All Statuses",
};

function hasQuarter(requestQuarter, selectedQuarter) {
  return Array.isArray(requestQuarter)
    ? requestQuarter.includes(selectedQuarter)
    : requestQuarter === selectedQuarter;
}

function ApprovalRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userType, setUserType] = useState("Manager");
  const [gridApi, setGridApi] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const loadRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      console.error(
        "Error fetching approval requests:",
        error
      );
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const matchesFilters = (request) => {
    const searchText =
      filters.search.trim().toLowerCase();

    const searchableText = [
      request.id,
      request.employee,
      request.department,
      request.category,
      request.event,
    ]
      .join(" ")
      .toLowerCase();

    const eventYear =
      request.eventDate?.slice(0, 4);

    return (
      (!searchText ||
        searchableText.includes(searchText)) &&
      (filters.year === "All Years" ||
        eventYear === filters.year) &&
      (filters.quarter === "All Quarters" ||
        hasQuarter(
          request.quarter,
          filters.quarter
        )) &&
      (filters.department ===
        "All Departments" ||
        request.department ===
          filters.department) &&
      (filters.status ===
        "All Statuses" ||
        request.status === filters.status)
    );
  };

  const filteredRequests =
    requests.filter(matchesFilters);

  const pendingRequests =
    filteredRequests.filter(
      (request) =>
        request.status ===
        "Pending Manager"
    );

  const historyRequests =
    filteredRequests.filter((request) =>
      HISTORY_STATUSES.includes(
        request.status
      )
    );

  const visibleRequests =
    activeTab === "requests"
      ? pendingRequests
      : historyRequests;

  const handleExport = () => {
    exportGridData({
      api: gridApi,
      fileName: getExportFileName(
        "Manager_Approval_Requests"
      ),
      sheetName:
        activeTab === "requests"
          ? "Requests"
          : "Event History",
      columnKeys: MANAGER_EXPORT_COLUMNS,
      headerNames: MANAGER_EXPORT_HEADERS,
      onSuccess: () =>
        setToast({
          type: "success",
          message:
            "Excel exported successfully",
        }),
      onError: () =>
        setToast({
          type: "error",
          message:
            "Failed to export Excel",
        }),
    });
  };

  return (
    <main className="approval-page-container">
      <div className="approval-page-header">
        <div className="approval-page-heading">
          <h2 className="page-title">
            Approval Requests
          </h2>

          <p className="page-subtitle">
            View and approve your engagement requests
          </p>
        </div>
      </div>

      

      <div className="approval-tabs-row">
        <div className="approval-tabs-section">
          <div
            className="approval-tabs"
            role="tablist"
            aria-label="Approval views"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "requests"}
              className={
                activeTab === "requests"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("requests")
              }
            >
              Requests
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "history"}
              className={
                activeTab === "history"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("history")
              }
            >
              Event History
            </button>
          </div>

          <select
            value={userType}
            onChange={(event) =>
              setUserType(event.target.value)
            }
            className="role-dropdown"
            aria-label="Select role"
          >
            <option value="Employee">
              Employee
            </option>

            <option value="Manager">
              Manager
            </option>

            <option value="GCC Leader">
              GCC Leader
            </option>
          </select>
        </div>

        {userType === "Manager" && (
          <button
            type="button"
            className="export-btn"
            onClick={handleExport}
            disabled={!gridApi}
          >
            <FileDownloadIcon />
            Export Excel
          </button>
        )}
      </div>

      <div className="approval-grid-container">
        <div className="approval-filter-row">
          <input
            type="search"
            className="approval-search"
            placeholder="Search Requests"
            value={filters.search}
            onChange={(event) =>
              updateFilter(
                "search",
                event.target.value
              )
            }
          />

          <select
            value={filters.year}
            onChange={(event) =>
              updateFilter(
                "year",
                event.target.value
              )
            }
            className="approval-filter-select"
          >
            {YEARS.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>

          <select
            value={filters.quarter}
            onChange={(event) =>
              updateFilter(
                "quarter",
                event.target.value
              )
            }
            className="approval-filter-select"
          >
            {QUARTERS.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>

          <select
            value={filters.department}
            onChange={(event) =>
              updateFilter(
                "department",
                event.target.value
              )
            }
            className="approval-filter-select"
          >
            {DEPARTMENTS.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(event) =>
              updateFilter(
                "status",
                event.target.value
              )
            }
            className="approval-filter-select"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <ManagerApprovalGrid
          requests={visibleRequests}
          showActions={
            activeTab === "requests"
          }
          onView={setSelectedRequest}
          onGridReady={({ api }) =>
            setGridApi(api)
          }
        />
      </div>

    <ApprovalModal
      request={selectedRequest}
      isHistoryView={
        activeTab === "history"
      }
      onClose={() =>
        setSelectedRequest(null)
      }
      refreshRequests={loadRequests}
    />


      {toast && (
        <div
          className={`export-toast export-toast-${toast.type}`}
          role="status"
        >
          {toast.message}

          <button
            type="button"
            onClick={() =>
              setToast(null)
            }
            aria-label="Dismiss notification"
          >
            
          </button>
        </div>
      )}
    </main>
  );
}

export default ApprovalRequests;