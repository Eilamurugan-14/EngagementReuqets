import { useEffect, useState } from "react";
import {
  updateRequest,
  getAuditHistory,
} from "../services/api";
import "../styles/ApprovalRequests.css";

function ApprovalModal({
  request,
  onClose,
  refreshRequests,
  isHistoryView = false,
})  {
  const [comments, setComments] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [auditHistory, setAuditHistory] = useState([]);

  useEffect(() => {
  setComments(request?.managerComments || "");

  async function loadAuditHistory() {
    if (!request?.id) {
      return;
    }
    const history = await getAuditHistory(
  request.id
);

console.log("REQUEST ID:", request.id);
console.log("AUDIT HISTORY:", history);

setAuditHistory(history);
    try {
      const history =
        await getAuditHistory(
          request.id
        );

      setAuditHistory(history);
    } catch (error) {
      console.error(
        "Error loading audit history:",
        error
      );

      setAuditHistory([]);
    }
  }

  loadAuditHistory();
}, [request]);

  if (!request) return null;

  

  const handleAction = async (status) => {
    setIsSaving(true);
    try {
      await updateRequest(request.id, {
        status,
        managerComments: comments,
        actionDate: new Date().toISOString().split("T")[0],
      });
      await refreshRequests();
      onClose();
    } catch (error) {
      console.error("Error updating approval request:", error);
      alert("Unable to update the request.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" role="presentation">
      <div className="modal-content approval-modal-content" role="dialog" aria-modal="true" aria-labelledby="approval-modal-title">
        <div className="modal-header">
          <h2 id="approval-modal-title">Request Details</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="approval-details-grid">
          <Detail label="Request ID" value={request.id} />
          <Detail label="Employee Name" value={request.employee} />
          <Detail label="Category" value={request.category} />
          <Detail label="Event" value={request.event} />
          <Detail label="Event Date" value={request.eventDate} />
          <Detail label="Venue" value={request.venue} />
          <Detail label="Headcount" value={request.headcount} />
          <Detail label="Budget" value={`₹${request.budget}`} />
          <Detail label="Quarter" value={request.quarter} />
          <Detail label="Status" value={request.status} />
          <Detail label="Description" value={request.description || "-"} fullWidth />
        </div>

        <div className="audit-history-section">
  <h3>Approval History</h3>

  {auditHistory.length === 0 ? (
    <p>No history available.</p>
  ) : (
    auditHistory.map((item) => (
      <div
        key={item.AuditId}
        className="audit-history-item"
      >
        <div>
          <strong>
            {item.ActionBy}
          </strong>
        </div>

        <div>
          {item.OldStatus}
          {" → "}
          {item.NewStatus}
        </div>

        <div>
          {new Date(
            item.ActionDate
          ).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "medium",
          })}
        </div>

        {item.Comments && (
          <div>
            {item.Comments}
          </div>
        )}
      </div>
    ))
  )}
</div>


        {!isHistoryView && (
  <>
    <label
      className="approval-comments-label"
      htmlFor="manager-comments"
    >
      Manager Comments
    </label>

    <textarea
      id="manager-comments"
      className="approval-comments"
      placeholder="Add comments..."
      value={comments}
      onChange={(event) =>
        setComments(event.target.value)
      }
      disabled={isSaving}
    />
  </>
)}

        <div className="approval-button-group">
  <button
    type="button"
    className="cancel-btn"
    onClick={onClose}
    disabled={isSaving}
  >
    {isHistoryView ? "Close" : "Cancel"}
  </button>

  {!isHistoryView && (
    <>
      <button
        type="button"
        className="escalate-btn"
        onClick={() =>
          handleAction("Pending GCC Leader")
        }
        disabled={isSaving}
      >
        Escalate to GCC Leader
      </button>

      <button
        type="button"
        className="reject-btn"
        onClick={() =>
          handleAction("Rejected")
        }
        disabled={isSaving}
      >
        Reject
      </button>

      <button
        type="button"
        className="approve-btn"
        onClick={() =>
          handleAction("Approved")
        }
        disabled={isSaving}
      >
        Approve
      </button>
    </>
  )}
</div>
      </div>
    </div>
  );
}

function Detail({ label, value, fullWidth = false }) {
  return (
    <div className={`approval-detail ${fullWidth ? "full-width" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default ApprovalModal;
