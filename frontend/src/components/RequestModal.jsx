import { useState, useEffect } from "react";
import "../styles/RequestModal.css";
import {
  createRequest,
  updateRequest,
} from "../services/api";
import {
  BUDGET_MAX,
  DESCRIPTION_MAX_LENGTH,
  getTodayISO,
  validateRequestForm,
} from "../utils/validation";

function RequestModal({
  isOpen,
  onClose,
  refreshRequests,
  editingRequest,
  viewMode,
}) {
  const [formData, setFormData] = useState({
    employee: "",
    category: "",
    event: "",
    eventDate: "",
    venue: "",
    headcount: "",
    budget: "",
    description: "",
    quarter: [],
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editingRequest) {
      setFormData({
        employee: editingRequest.employee || "",
        category: editingRequest.category || "",
        event: editingRequest.event || "",
        eventDate: editingRequest.eventDate || "",
        venue: editingRequest.venue || "",
        headcount: editingRequest.headcount || "",
        budget: editingRequest.budget || "",
        description: editingRequest.description || "",
        quarter: Array.isArray(editingRequest.quarter)
          ? editingRequest.quarter
          : editingRequest.quarter
          ? [editingRequest.quarter]
          : [],
      });
    } else {
      setFormData({
        employee: "",
        category: "",
        event: "",
        eventDate: "",
        venue: "",
        headcount: "",
        budget: "",
        description: "",
        quarter: [],
      });
    }
  }, [editingRequest, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setTouched({});
      setFormError("");
    }
  }, [isOpen, editingRequest]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      setErrors((current) => ({
        ...current,
        [name]: validateRequestForm({ ...formData, [name]: value })[name],
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const nextTouched = { ...touched, [name]: true };
    setTouched(nextTouched);
    setErrors(validateRequestForm(formData));
  };

  const handleQuarterChange = (quarter) => {
    const nextQuarters = formData.quarter.includes(quarter)
      ? formData.quarter.filter((selectedQuarter) => selectedQuarter !== quarter)
      : [...formData.quarter, quarter];
    const nextFormData = { ...formData, quarter: nextQuarters };

    setFormData(nextFormData);
    if (touched.quarter) {
      setErrors((current) => ({
        ...current,
        quarter: validateRequestForm(nextFormData).quarter,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRequestForm(formData);
    setErrors(validationErrors);
    setTouched(Object.keys(formData).reduce((fields, field) => ({
      ...fields,
      [field]: true,
    }), {}));
    setFormError("");

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    try {
      if (editingRequest) {
        await updateRequest(
          editingRequest.id,
          formData
        );

      } else {
        await createRequest(formData);
      }

      await refreshRequests();

      onClose();
    } catch (error) {
      console.error(error);
      setFormError("Operation failed. Please try again.");
    }
  };

  const getFieldClassName = (fieldName) =>
    errors[fieldName] && touched[fieldName] ? "field-invalid" : "";

  const renderError = (fieldName) => (
    errors[fieldName] && touched[fieldName] ? (
      <span className="field-error">{errors[fieldName]}</span>
    ) : null
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {viewMode
              ? "View Engagement Request"
              : editingRequest
              ? "Edit Engagement Request"
              : "New Engagement Request"}
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <form
          className="request-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>
              Employee Name
              <span className="required">*</span>
            </label>

            <input
              type="text"
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName("employee")}
              disabled={viewMode}
            />
            {renderError("employee")}
          </div>

          <div className="form-group">
            <label>
              Engagement Category
              <span className="required">*</span>
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName("category")}
              disabled={viewMode}
            >
              <option value="">Select Category</option>
              <option value="Team Outing">
                Team Outing
              </option>
              <option value="Workshop">
                Workshop
              </option>
              <option value="Celebration">
                Celebration
              </option>
            </select>
            {renderError("category")}
          </div>

          <div className="form-group">
            <label>
              Event Date
              <span className="required">*</span>
            </label>

            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              min={getTodayISO()}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName("eventDate")}
              disabled={viewMode}
            />
            {renderError("eventDate")}
          </div>

          <div className="form-group">
            <label>
              Event Title
              <span className="required">*</span>
            </label>

            <input
              type="text"
              name="event"
              value={formData.event}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName("event")}
              disabled={viewMode}
            />
            {renderError("event")}
          </div>

          <div className="form-group">
            <label>
              Venue
              <span className="required">*</span>
            </label>

            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName("venue")}
              disabled={viewMode}
            />
            {renderError("venue")}
          </div>

          <div className="form-group">
            <label>
              Headcount
              <span className="required">*</span>
            </label>

            <input
              type="text"
              inputMode="numeric"
              name="headcount"
              value={formData.headcount}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName("headcount")}
              disabled={viewMode}
            />
            {renderError("headcount")}
          </div>

          <div className="form-group">
            <label>
              Budget
              <span className="required">*</span>
            </label>

            <input
              type="text"
              inputMode="decimal"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName("budget")}
              max={BUDGET_MAX}
              disabled={viewMode}
            />
            {renderError("budget")}
          </div>

          <div className="form-group full-width">
            <label>Description</label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName("description")}
              maxLength={DESCRIPTION_MAX_LENGTH}
              disabled={viewMode}
            />
            <div className="description-meta">
              <span>{formData.description.length} / {DESCRIPTION_MAX_LENGTH} characters</span>
              {renderError("description")}
            </div>
          </div>

          <div className="form-group full-width">
            <label>
              Quarter
              <span className="required">*</span>
            </label>

            <div
              className={`quarter-options ${getFieldClassName("quarter")}`}
              onBlur={() => {
                setTouched((current) => ({ ...current, quarter: true }));
                setErrors(validateRequestForm(formData));
              }}
            >
              {[
                "Q1",
                "Q2",
                "Q3",
                "Q4",
              ].map((quarter) => (
                <label className="quarter-option" key={quarter}>
                  <input
                    type="checkbox"
                    name="quarter"
                    value={quarter}
                    checked={formData.quarter.includes(quarter)}
                    onChange={() => handleQuarterChange(quarter)}
                    disabled={viewMode}
                  />
                  <span>{quarter}</span>
                </label>
              ))}
            </div>
            {renderError("quarter")}
          </div>

          <div className="button-group">
            {formError && <p className="form-error">{formError}</p>}
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              {viewMode ? "Close" : "Cancel"}
            </button>

            {!viewMode && (
              <button
                type="submit"
                className="submit-btn"
              >
                {editingRequest
                  ? "Update"
                  : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestModal;