import { useState, useEffect } from "react";
import "../styles/EngagementRequests.css";
import EmployeeGrid from "../components/grids/EmployeeGrid";
import RequestModal from "../components/RequestModal";
import { getRequests } from "../services/api";

function EngagementRequests() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState("Employee");

  const loadRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h2 className="page-title">
              My Engagement Requests
            </h2>

            <p className="page-subtitle">
              View and manage your engagement requests
            </p>
          </div>

          <button
            className="new-btn"
            onClick={() => {
              setEditingRequest(null);
              setViewMode(false);
              setIsModalOpen(true);
            }}
          >
            + New Request
          </button>
        </div>
      </div>

      <div className="grid-container">
        <div className="grid-toolbar">
          <input
            type="text"
            placeholder="Search by Employee, Category or Event"
            className="search-box"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <select
            value={userType}
            onChange={(e) =>
              setUserType(e.target.value)
            }
            className="role-dropdown"
          >
            <option value="Employee">
              Employee
            </option>
            <option value="Manager">
              Manager
            </option>
            <option value="GCC Leader">
              GCC Leader
            </option>
          </select>
        </div>

        <EmployeeGrid
          requests={requests}
          searchTerm={searchTerm}
          onEdit={(request) => {
            setEditingRequest(request);
            setViewMode(false);
            setIsModalOpen(true);
          }}
          onView={(request) => {
            setEditingRequest(request);
            setViewMode(true);
            setIsModalOpen(true);
          }}
        />
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRequest(null);
          setViewMode(false);
        }}
        refreshRequests={loadRequests}
        editingRequest={editingRequest}
        viewMode={viewMode}
      />
    </div>
  );
}

export default EngagementRequests;