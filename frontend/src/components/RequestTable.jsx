import "../styles/RequestTable.css";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

function RequestTable({
  requests,
  //refreshRequests,
  onEdit,
  onView,
}) {
  return (
    <div className="table-container">
      <table className="request-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>ID</th>
            <th>Employee</th>
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
                <td>
                  <div className="action-buttons">
                    {request.status === "Approved" ? (
                      <button
                        className="icon-btn"
                        onClick={() =>
                          onView(request)
                        }
                      >
                        <VisibilityIcon className="view-icon" />
                      </button>
                    ) : (
                      <button
                        className="icon-btn"
                        onClick={() =>
                          onEdit(request)
                        }
                      >
                        <EditIcon className="edit-icon" />
                      </button>
                    )}
                  </div>
                </td>

                <td>{request.id}</td>
                <td>{request.employee}</td>
                <td>{request.category}</td>
                <td>{request.event}</td>
                <td>{request.eventDate}</td>
                <td>₹{request.budget}</td>

                <td>
                  <span
                    className={`status-badge ${
                      request.status ===
                      "Approved"
                        ? "status-approved"
                        : "status-pending"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RequestTable;