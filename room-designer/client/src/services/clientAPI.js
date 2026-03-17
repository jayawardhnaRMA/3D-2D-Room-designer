import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const clientAPI = {
  // Get all clients for designer
  getClients: async (userId) => {
    try {
      const response = await api.get(`/clients/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error.response?.data || error;
    }
  },

  // Create new client
  createClient: async (userId, clientData) => {
    try {
      const response = await api.post(`/clients/${userId}`, clientData);
      return response.data;
    } catch (error) {
      console.error("Error creating client:", error);
      throw error.response?.data || error;
    }
  },

  // Get single client
  getClient: async (clientId) => {
    try {
      const response = await api.get(`/clients/detail/${clientId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error.response?.data || error;
    }
  },

  // Update client
  updateClient: async (clientId, clientData) => {
    try {
      const response = await api.put(`/clients/${clientId}`, clientData);
      return response.data;
    } catch (error) {
      console.error("Error updating client:", error);
      throw error.response?.data || error;
    }
  },

  // Delete client
  deleteClient: async (clientId) => {
    try {
      const response = await api.delete(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error.response?.data || error;
    }
  },
};

export default api;
