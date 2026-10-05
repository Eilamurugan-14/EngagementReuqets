import axios from "axios";

const API_URL = "http://localhost:5000/api/requests";
const AUDIT_API_URL = "http://localhost:5000/api/audit";
const SKILLS_API_URL =
  "http://localhost:5000/api/skills";

const PROFILE_API_URL =
  "http://localhost:5000/api/profile";

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

export const getSkills = async () => {
  const response = await axios.get(
    SKILLS_API_URL
  );

  return response.data;
};

export const getEmployeeSkills =
  async (employeeId) => {
    const response = await axios.get(
      `${PROFILE_API_URL}/skills/${employeeId}`
    );

    return response.data;
  };

export const addEmployeeSkill =
  async (skillData) => {
    const response = await axios.post(
      `${PROFILE_API_URL}/skills`,
      skillData
    );

    return response.data;
  };

export const deleteEmployeeSkill =
  async (id) => {
    const response = await axios.delete(
      `${PROFILE_API_URL}/skills/${id}`
    );

    return response.data;
  };

  export const updateEmployeeSkill =
  async (
    id,
    proficiencyLevel
  ) => {
    const response =
      await axios.put(
        `${PROFILE_API_URL}/skills/${id}`,
        {
          proficiencyLevel,
        }
      );

    return response.data;
  };