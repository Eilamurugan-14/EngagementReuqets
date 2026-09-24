import { useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../../styles/RequestTable.css";
import "../../styles/EmployeeGrid.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const employeeColumnDefs = [
  {
    headerName: "Action",
    field: "action",
    sortable: false,
    filter: false,
    width: 80,
    suppressHeaderMenuButton: true,
    
    cellRenderer: EmployeeActionRenderer,
  },
  { headerName: "ID", field: "id", minWidth: 125,width:140 },
  { headerName: "Employee", field: "employee", minWidth: 170,width:220 },
  {
  headerName: "Department",
  field: "department",
  minWidth: 150,
  width:200
},
  { headerName: "Category", field: "category", minWidth: 180,width:200 },
  { headerName: "Event", field: "event", minWidth: 150,width:200 },
  { headerName: "Event Date", field: "eventDate", minWidth: 140,width:180 },
  {
    headerName: "Budget",
    field: "budget",
    minWidth: 120,
    width: 150,
    valueFormatter: ({ value }) => `₹${value ?? ""}`,
  },
  {
    headerName: "Status",
    field: "status",
    minWidth: 200,
    width: 220,
    cellRenderer: EmployeeStatusRenderer,
  },
];

function EmployeeActionRenderer({ data, context }) {
  if (!data) return null;

  const isApproved = data.status === "Approved";
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={`${isApproved ? "View" : "Edit"} ${data.id}`}
      onClick={() => (isApproved ? context.onView(data) : context.onEdit(data))}
    >
      {isApproved ? (
        <VisibilityIcon className="view-icon" />
      ) : (
        <EditIcon className="edit-icon" />
      )}
    </button>
  );
}

function EmployeeStatusRenderer({ value }) {
  return (
    <span className={`status-badge ${value === "Approved" ? "status-approved" : "status-pending"}`}>
      {value}
    </span>
  );
}

function EmployeeGrid({ requests, searchTerm, onEdit, onView }) {
  const gridApiRef = useRef(null);

  useEffect(() => {
    gridApiRef.current?.setGridOption("quickFilterText", searchTerm);
  }, [searchTerm]);

  const handleGridReady = ({ api }) => {
    gridApiRef.current = api;
    api.setGridOption("quickFilterText", searchTerm);
  };

  return (
    <div className="employee-grid-shell">
      <div className="ag-theme-quartz employee-grid">
        <AgGridReact
          onGridReady={handleGridReady}
          rowData={requests}
          columnDefs={employeeColumnDefs}
          theme={themeQuartz}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          context={{ onEdit, onView }}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          domLayout="autoHeight"
          suppressCellFocus
          animateRows
          rowClass="employee-grid-row"
          overlayNoRowsTemplate="<span>No requests found</span>"
        />
      </div>
    </div>
  );
}

export default EmployeeGrid;
