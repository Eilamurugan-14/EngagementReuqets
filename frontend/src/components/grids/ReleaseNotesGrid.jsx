import { useEffect, useRef } from "react";

import { AgGridReact } from "ag-grid-react";

import PublishIcon
from "@mui/icons-material/Publish";

import UnpublishedIcon
from "@mui/icons-material/Unpublished";

import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import "../../styles/EmployeeGrid.css";

ModuleRegistry.registerModules([
  AllCommunityModule,
]);

const releaseNotesColumnDefs = [
  {
    headerName: "Action",
    field: "action",
    sortable: false,
    filter: false,
    minWidth: 140,
    suppressHeaderMenuButton: true,
    cellRenderer: ReleaseNoteActionRenderer,
  },

  {
    headerName: "Title",
    field: "Title",
    minWidth: 160,
    width: 500,
    filter: true
  },

  {
    headerName: "Version",
    field: "Version",
    width: 120,
  },

  {
    headerName: "Status",
    field: "IsPublished",
    width: 150,
    filter: true,
    cellRenderer: ReleaseNoteStatusRenderer,
  },

  {
    headerName: "Published Date",
    field: "PublishedDate",
    minWidth: 180,
    valueFormatter: ({ value }) =>
      value
        ? new Date(value).toLocaleDateString()
        : "-",
  },

  {
    headerName: "Created By",
    field: "CreatedBy",
    minWidth: 180,
  },

  {
    headerName: "Created Date",
    field: "CreatedDate",
    minWidth: 180,
    valueFormatter: ({ value }) =>
      value
        ? new Date(value).toLocaleDateString()
        : "-",
  },
];

function ReleaseNoteActionRenderer({
  data,
  context,
}) {
  if (!data) return null;
  const isPublished =
    data.IsPublished === true ||
    data.IsPublished === 1 ||
    data.IsPublished === "1";

  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        justifyContent: "center",
      }}
    >
       <button
        type="button"
        className="icon-btn"
        aria-label={`View ${data.Title}`}
        onClick={() =>
          context.onView?.(data)
        }
      >
        <VisibilityIcon
          className="view-icon"
        />
      </button>
      <button
        type="button"
        className="icon-btn"
        aria-label={`Edit ${data.Title}`}
        onClick={() =>
          context.onEdit?.(data)
        }
      >
        <EditIcon className="edit-icon" />
      </button>

      <button
        type="button"
        className="icon-btn"
        aria-label={`Delete ${data.Title}`}
        onClick={() =>
          context.onDelete?.(data)
        }
      >
        <DeleteIcon className="edit-icon" />
      </button>

      <button
        type="button"
        className="icon-btn"
        onClick={() =>
          context.onTogglePublish?.(
            data
          )
        }
      >
        {isPublished ? (
          <UnpublishedIcon className="status-icon" />
        ) : (
          <PublishIcon className="status-icon" />
        )}
      </button>

     
    </div>
  );
}

function ReleaseNoteStatusRenderer({
  value,
}) {
  const isPublished =
    value === true ||
    value === 1 ||
    value === "1";

  return (
    <span
      className={`status-badge ${
        isPublished
          ? "status-approved"
          : "status-draft"
      }`}
    >
      {isPublished
        ? "Published"
        : "Draft"}
    </span>
  );
}

function ReleaseNotesGrid({
  releaseNotes,
  searchTerm,
  onView,
  onEdit,
  onDelete,
  onTogglePublish,
}) {
  const gridApiRef = useRef(null);

  useEffect(() => {
    gridApiRef.current?.setGridOption(
      "quickFilterText",
      searchTerm
    );
  }, [searchTerm]);

  const handleGridReady = ({
    api,
  }) => {
    gridApiRef.current = api;

    api.setGridOption(
      "quickFilterText",
      searchTerm
    );
  };

  return (
    <div className="employee-grid-shell">

      <div className="ag-theme-quartz employee-grid">

        <AgGridReact
          onGridReady={handleGridReady}
          rowData={releaseNotes}
          columnDefs={releaseNotesColumnDefs}
          theme={themeQuartz}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          context={{
            onView,
            onEdit,
            onDelete,
            onTogglePublish,
          }}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[
            10,
            25,
            50,
          ]}
          domLayout="autoHeight"
          suppressCellFocus
          animateRows
          rowClass="employee-grid-row"
          overlayNoRowsTemplate="<span>No release notes found</span>"
        />

      </div>

    </div>
  );
}

export default ReleaseNotesGrid;