import axios from "axios";

const API_URL = "http://localhost:5000/api/requests";
const AUDIT_API_URL = "http://localhost:5000/api/audit";

// Get all requests
export const getRequests = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create request
export const createRequest = async (requestData) => {
  const response = await axios.post(API_URL, requestData);
  return response.data;
};

// Update request
export const updateRequest = async (id, requestData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    requestData
  );

  return response.data;
};

// Delete request
export const deleteRequest = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};

export const getAuditHistory = async (id) => {
  const response = await axios.get(
    `${AUDIT_API_URL}/${id}`
  );

  return response.data;
};