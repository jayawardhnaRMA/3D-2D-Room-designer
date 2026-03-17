import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include HTTP-only cookies with requests
});

// Design API
export const designAPI = {
  // Get all designs for a user
  getUserDesigns: async (userId) => {
    try {
      const response = await api.get(`/designs/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user designs:", error);
      throw error;
    }
  },

  // Get single design
  getDesign: async (designId) => {
    try {
      const response = await api.get(`/designs/${designId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching design:", error);
      throw error;
    }
  },

  // Create new design
  createDesign: async (userId, designData) => {
    try {
      const response = await api.post(`/designs/user/${userId}`, designData);
      return response.data;
    } catch (error) {
      console.error("Error creating design:", error);
      throw error;
    }
  },

  // Update design
  updateDesign: async (designId, designData) => {
    try {
      const response = await api.put(`/designs/${designId}`, designData);
      return response.data;
    } catch (error) {
      console.error("Error updating design:", error);
      throw error;
    }
  },

  // Delete design
  deleteDesign: async (designId) => {
    try {
      const response = await api.delete(`/designs/${designId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting design:", error);
      throw error;
    }
  },
};

export default api;
