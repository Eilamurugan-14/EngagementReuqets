import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../../styles/RequestTable.css";
import "../../styles/ManagerApprovalGrid.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const managerActionColumn = {
  headerName: "Action",
  field: "action",
  sortable: false,
  filter: false,
  width: 80,
  
  cellRenderer: ManagerActionRenderer,
};

const managerDataColumns = [
  { headerName: "Request ID", field: "id", width: 125},
  { headerName: "Employee Name", field: "employee", minWidth: 165 },
  { headerName: "Department", field: "department", minWidth: 100, valueFormatter: ({ value }) => value || "-" },
  { headerName: "Category", field: "category", minWidth: 145 },
  { headerName: "Event", field: "event", width: 150, flex: 1 },
  { headerName: "Event Date", field: "eventDate", minWidth: 135 },
  {
    headerName: "Budget",
    field: "budget",
    width: 120,
    valueFormatter: ({ value }) => `₹${value ?? ""}`,
  },
  {
    headerName: "Status",
    field: "status",
    width: 130,
    cellRenderer: ManagerStatusRenderer,
  },
  { headerName: "Manager Comments", field: "managerComments", hide: true },
];

const managerColumnDefs = [managerActionColumn, ...managerDataColumns];
const managerHistoryColumnDefs = managerDataColumns;

function ManagerActionRenderer({ data, context }) {
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

function ManagerStatusRenderer({ value }) {
  const statusClass = `status-${value?.toLowerCase().replaceAll(" ", "-")}`;
  return <span className={`status-badge ${statusClass}`}>{value}</span>;
}

function ManagerApprovalGrid({ requests, showActions, onView, onGridReady }) {
  return (
    <div className="manager-grid-shell">
      <div className="ag-theme-quartz manager-grid">
        <AgGridReact
          rowData={requests}
          columnDefs={showActions ? managerColumnDefs : managerHistoryColumnDefs}
          onGridReady={onGridReady}
          theme={themeQuartz}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          context={{ onView }}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          domLayout="autoHeight"
          suppressCellFocus
          animateRows
          rowClass="manager-grid-row"
          overlayNoRowsTemplate="<span>No requests found</span>"
        />
      </div>
    </div>
  );
}

export default ManagerApprovalGrid;
