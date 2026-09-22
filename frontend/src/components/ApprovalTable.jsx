import VisibilityIcon from "@mui/icons-material/Visibility";
import "../styles/RequestTable.css";

function ApprovalTable({ requests, showActions, onView }) {
  return (
    <div className="table-container approval-table-container">
      <table className="request-table">
        <thead>
          <tr>
            {showActions && <th>Action</th>}
            <th>Request ID</th>
            <th>Employee Name</th>
            <th>Category</th>
            <th>Event</th>
            <th>Event Date</th>
            <th>Budget</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
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
                <td>{request.category}</td>
                <td>{request.event}</td>
                <td>{request.eventDate}</td>
                <td>₹{request.budget}</td>
                <td>
                  <span className={`status-badge status-${request.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {request.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={showActions ? 8 : 7} className="empty-table-cell">
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ApprovalTable;
