import VisibilityIcon from "@mui/icons-material/Visibility";
import "../styles/RequestTable.css";
import "../styles/GCCApprovalRequests.css";

function GCCApprovalTable({ requests, showActions, onView }) {
  return (
    <div className="table-container gcc-table-container">
      <table className="request-table gcc-table">
        <thead>
          <tr>
            {showActions && <th>Action</th>}
            <th>Request ID</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Category</th>
            <th>Title</th>
            <th>Event Date</th>
            <th>Budget (INR)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? requests.map((request) => (
            <tr key={request.id}>
              {showActions && (
                <td>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`View ${request.id}`}
                      onClick={() => onView(request)}
                    >
                      <VisibilityIcon className="view-icon" />
                    </button>
                  </div>
                </td>
              )}
              <td>{request.id}</td>
              <td>{request.employee}</td>
              <td>{request.department || "-"}</td>
              <td>{request.category}</td>
              <td>{request.title || request.event}</td>
              <td>{request.eventDate}</td>
              <td>₹{Number(request.budget || 0).toLocaleString("en-IN")}</td>
              <td>
                <span className={`status-badge gcc-status-${request.status.toLowerCase().replaceAll(" ", "-")}`}>
                  {request.status === "Pending GCC Leader" ? "Pending GCC" : request.status}
                </span>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={showActions ? 9 : 8} className="empty-table-cell">
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GCCApprovalTable;
