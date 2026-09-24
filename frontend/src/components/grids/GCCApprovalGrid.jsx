import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../../styles/RequestTable.css";
import "../../styles/GCCApprovalGrid.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const gccActionColumn = {
  headerName: "Action",
  field: "action",
  sortable: false,
  filter: false,
  width: 80,

  
  cellRenderer: GCCActionRenderer,
};

const gccDataColumns = [
  { headerName: "Request ID", field: "id", minWidth: 125,width:140 },
  { headerName: "Employee Name", field: "employee", minWidth: 110,width:220 },
  { headerName: "Department", field: "department", minWidth: 90,width:200, valueFormatter: ({ value }) => value || "-" },
  { headerName: "Category", field: "category", minWidth: 95,width:200 },
  {
    headerName: "Event",
    field: "event",
    minWidth: 125,
    width:200,
    valueGetter: ({ data }) => data?.title || data?.event || null,
    valueFormatter: ({ value }) => value || "-",
  },
  { headerName: "Event Date", field: "eventDate", minWidth: 100,width:180 },
  {
    headerName: "Budget (INR)",
    field: "budget",
    minWidth: 100,
    width: 150,
    valueFormatter: ({ value }) => `₹${Number(value || 0).toLocaleString("en-IN")}`,
  },
  {
    headerName: "Status",
    field: "status",
    minWidth: 200,
    width: 220,
    cellRenderer: GCCStatusRenderer,
  },
  { headerName: "Manager Comments", field: "managerComments", hide: true },
  { headerName: "GCC Leader Comments", field: "gccLeaderComments", hide: true },
  { headerName: "Approval Date", field: "gccLeaderActionDate", hide: true },
];

const gccColumnDefs = [gccActionColumn, ...gccDataColumns];
const gccHistoryColumnDefs = [
  {
    headerName: "Request ID",
    field: "id",
    minWidth: 140,
    width: 160,
  },
  {
    headerName: "Employee Name",
    field: "employee",
    minWidth: 200,
    width: 220,
  },
  {
    headerName: "Department",
    field: "department",
    minWidth: 200,
    width: 220,
  },
  {
    headerName: "Category",
    field: "category",
    minWidth: 200,
    width: 220,
  },
  {
    headerName: "Event",
    field: "event",
    minWidth: 180,
    width: 200,
    valueGetter: ({ data }) => data?.title || data?.event || null,
    valueFormatter: ({ value }) => value || "-",
    
  },
  {
    headerName: "Event Date",
    field: "eventDate",
    minWidth: 140,
    width: 180,
  },
  {
    headerName: "Budget (INR)",
    field: "budget",
    minWidth: 140,
    width: 160,
  },
  {
    headerName: "Status",
    field: "status",
    minWidth: 200,
    width: 220,
    cellRenderer: GCCStatusRenderer,
  },
];
function GCCActionRenderer({ data, context }) {
  if (!data) return null;

  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={`View ${data.id}`}
      onClick={() => context.onView(data)}
    >
      <VisibilityIcon className="view-icon" />
    </button>
  );
}

function GCCStatusRenderer({ value }) {
  const statusClass = `gcc-status-${value?.toLowerCase().replaceAll(" ", "-")}`;
  const label = value === "Pending GCC Leader" ? "Pending GCC" : value;
  return <span className={`status-badge ${statusClass}`}>{label}</span>;
}

function GCCApprovalGrid({ requests, showActions, onView, onGridReady }) {
  return (
    <div className="gcc-grid-shell">
      <div className="ag-theme-quartz gcc-grid">
        <AgGridReact
          rowData={requests}
          columnDefs={showActions ? gccColumnDefs : gccHistoryColumnDefs}
          onGridReady={onGridReady}
          theme={themeQuartz}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          autoSizeStrategy={{ type: "fitGridWidth", defaultMinWidth: 70 }}
          context={{ onView }}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          domLayout="autoHeight"
          suppressCellFocus
          animateRows
          rowClass="gcc-grid-row"
          overlayNoRowsTemplate="<span>No requests found</span>"
        />
      </div>
    </div>
  );
}

export default GCCApprovalGrid;
