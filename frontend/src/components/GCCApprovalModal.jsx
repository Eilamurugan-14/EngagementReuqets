import { useEffect, useState } from "react";
import {
  updateRequest,
  getAuditHistory,
} from "../services/api";
import "../styles/GCCApprovalRequests.css";

function GCCApprovalModal({
  request,
  onClose,
  refreshRequests,
  isHistoryView = false,
})  {
  const [comments, setComments] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [auditHistory, setAuditHistory] = useState([]);

  useEffect(() => {
  setComments(request?.gccLeaderComments || "");

  async function loadAuditHistory() {
    if (!request?.id) {
      return;
    }

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

  const isReadOnly = request.status === "Pending Manager";

  const handleAction = async (status) => {
    setIsSaving(true);
    try {
      await updateRequest(request.id, {
        status,
        gccLeaderComments: comments,
        gccLeaderActionDate: new Date().toISOString().split("T")[0],
      });
      await refreshRequests();
      onClose();
    } catch (error) {
      console.error("Error updating GCC approval:", error);
      alert("Unable to update the request.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" role="presentation">
      <div className="modal-content gcc-modal-content" role="dialog" aria-modal="true" aria-labelledby="gcc-modal-title">
        <div className="modal-header">
          <h2 id="gcc-modal-title">Request Details</h2>
          <button type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="gcc-details-grid">
          <Detail label="Request ID" value={request.id} />
          <Detail label="Employee Name" value={request.employee} />
          <Detail label="Department" value={request.department || "-"} />
          <Detail label="Category" value={request.category} />
          <Detail label="Event" value={request.event} />
          <Detail label="Event Date" value={request.eventDate} />
          <Detail label="Budget" value={`₹${Number(request.budget || 0).toLocaleString("en-IN")}`} />
          <Detail label="Title" value={request.title || request.event} />
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


        {!isReadOnly && !isHistoryView && (
  <>
    <label
      className="gcc-comments-label"
      htmlFor="gcc-comments"
    >
      Comments (optional)
    </label>

    <textarea
      id="gcc-comments"
      className="gcc-comments"
      placeholder="Comments (optional)"
      value={comments}
      onChange={(event) =>
        setComments(event.target.value)
      }
      disabled={isSaving}
    />
  </>
)}

        <div className="gcc-button-group">
  <button
    type="button"
    className="cancel-btn"
    onClick={onClose}
    disabled={isSaving}
  >
    {isHistoryView || isReadOnly
      ? "Close"
      : "Cancel"}
  </button>

  {!isReadOnly && !isHistoryView && (
    <>
      <button
        type="button"
        className="gcc-reject-btn"
        onClick={() =>
          handleAction("Rejected")
        }
        disabled={isSaving}
      >
        Reject
      </button>

      <button
        type="button"
        className="gcc-approve-btn"
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
    <div className={`gcc-detail ${fullWidth ? "full-width" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default GCCApprovalModal;
