import { useEffect, useState } from "react";
import "../styles/GCCApprovalRequests.css";
import { getRequests } from "../services/api";
import GCCApprovalGrid from "../components/grids/GCCApprovalGrid";
import GCCApprovalModal from "../components/GCCApprovalModal";
import KPICards from "../components/KPICards";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { exportGridData, getExportFileName } from "../utils/exportExcel";

const GCC_EXPORT_COLUMNS = [
  "id",
  "employee",
  "department",
  "category",
  "event",
  "eventDate",
  "budget",
  "status",
  "managerComments",
  "gccLeaderComments",
  "gccLeaderActionDate",
];

const GCC_EXPORT_HEADERS = {
  id: "Request ID",
  employee: "Employee Name",
  department: "Department",
  category: "Category",
  event: "Event",
  eventDate: "Event Date",
  budget: "Budget",
  status: "Status",
  managerComments: "Manager Comments",
  gccLeaderComments: "GCC Leader Comments",
  gccLeaderActionDate: "Approval Date",
};

const HISTORY_STATUSES = ["Approved", "Rejected"];
const REQUEST_STATUSES = ["Pending Manager", "Pending GCC Leader"];
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
const QUARTERS = ["All Quarters", "Q1", "Q2", "Q3", "Q4"];
const YEARS = ["All Years", "2024", "2025", "2026", "2027"];

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

function GCCApprovalRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userType, setUserType] = useState("GCC Leader");
  const [filters, setFilters] = useState(initialFilters);
  const [gridApi, setGridApi] = useState(null);
  const [toast, setToast] = useState(null);

  const loadRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      console.error(
        "Error fetching GCC approval requests:",
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
    const searchText = filters.search
      .trim()
      .toLowerCase();

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
      (filters.status === "All Statuses" ||
        request.status === filters.status)
    );
  };

  const filteredRequests =
    requests.filter(matchesFilters);

  const pendingRequests =
    filteredRequests.filter((request) =>
      REQUEST_STATUSES.includes(
        request.status
      )
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

  const metrics = {
    total: filteredRequests.length,
    pendingManager:
      filteredRequests.filter(
        (request) =>
          request.status ===
          "Pending Manager"
      ).length,
    pending: filteredRequests.filter(
      (request) =>
        request.status ===
        "Pending GCC Leader"
    ).length,
    approved: filteredRequests.filter(
      (request) =>
        request.status === "Approved"
    ).length,
    rejected: filteredRequests.filter(
      (request) =>
        request.status === "Rejected"
    ).length,
    budget: filteredRequests
      .filter(
        (request) =>
          request.status === "Approved"
      )
      .reduce(
        (total, request) =>
          total +
          Number(request.budget || 0),
        0
      ),
  };

  const handleExport = () => {
    exportGridData({
      api: gridApi,
      fileName: getExportFileName(
        "GCC_Approval_Requests"
      ),
      sheetName:
        activeTab === "requests"
          ? "Requests"
          : "Event History",
      columnKeys: GCC_EXPORT_COLUMNS,
      headerNames: GCC_EXPORT_HEADERS,
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
    <main className="gcc-page-container">
      <div className="gcc-page-heading">
        <div>
          <h2 className="page-title">
            GCC Approval Requests
          </h2>

          <p className="page-subtitle">
            View and approve your
            engagement requests
          </p>
        </div>

        <select
          value={userType}
          onChange={(event) =>
            setUserType(
              event.target.value
            )
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

      <KPICards metrics={metrics} />

      <div className="gcc-tabs-row">
        <div
          className="gcc-tabs"
          role="tablist"
          aria-label="GCC approval views"
        >
          <button
            type="button"
            role="tab"
            aria-selected={
              activeTab === "requests"
            }
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
            aria-selected={
              activeTab === "history"
            }
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

        {userType ===
          "GCC Leader" && (
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

      <div className="gcc-grid-container">
        <div className="gcc-filter-row">
          <input
            type="search"
            className="gcc-search"
            placeholder="Search Requests"
            value={filters.search}
            onChange={(event) =>
              updateFilter(
                "search",
                event.target.value
              )
            }
            aria-label="Search requests"
          />

          <FilterSelect
            label="Year Filter"
            value={filters.year}
            options={YEARS}
            onChange={(value) =>
              updateFilter(
                "year",
                value
              )
            }
          />

          <FilterSelect
            label="Quarter Filter"
            value={filters.quarter}
            options={QUARTERS}
            onChange={(value) =>
              updateFilter(
                "quarter",
                value
              )
            }
          />

          <FilterSelect
            label="Department Filter"
            value={filters.department}
            options={DEPARTMENTS}
            onChange={(value) =>
              updateFilter(
                "department",
                value
              )
            }
          />

          <FilterSelect
            label="Status Filter"
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(value) =>
              updateFilter(
                "status",
                value
              )
            }
          />
        </div>

        {activeTab === "requests" && (
          <div className="gcc-alert-banner">
            {metrics.pending} requests
            awaiting your approval
          </div>
        )}

        <GCCApprovalGrid
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

      <GCCApprovalModal
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

function FilterSelect({ label, value, options, onChange }) {
  return (
    <select
      className="gcc-filter-select"
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      aria-label={label}
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  );
}

export default GCCApprovalRequests;