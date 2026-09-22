import { useEffect, useState } from "react";
import { updateRequest } from "../services/api";
import "../styles/GCCApprovalRequests.css";

function GCCApprovalModal({ request, onClose, refreshRequests }) {
  const [comments, setComments] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setComments(request?.gccLeaderComments || "");
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

        {!isReadOnly && (
          <>
            <label className="gcc-comments-label" htmlFor="gcc-comments">Comments (optional)</label>
            <textarea
              id="gcc-comments"
              className="gcc-comments"
              placeholder="Comments (optional)"
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              disabled={isSaving}
            />
          </>
        )}

        <div className="gcc-button-group">
          <button type="button" className="cancel-btn" onClick={onClose} disabled={isSaving}>{isReadOnly ? "Close" : "Cancel"}</button>
          {!isReadOnly && (
            <>
              <button type="button" className="gcc-reject-btn" onClick={() => handleAction("Rejected")} disabled={isSaving}>Reject</button>
              <button type="button" className="gcc-approve-btn" onClick={() => handleAction("Approved")} disabled={isSaving}>Approve</button>
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
