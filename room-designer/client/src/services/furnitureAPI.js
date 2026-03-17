import axios from "axios";

const API_URL = "http://localhost:5000/api/furniture";

export const furnitureAPI = {
  // Get all furniture items
  getFurnitureItems: async (category = "All Items", style = null) => {
    try {
      let url = API_URL + "?";
      if (category && category !== "All Items") {
        url += `category=${category}&`;
      }
      if (style) {
        url += `style=${style}&`;
      }
      
      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single furniture item
  getFurnitureItem: async (itemId) => {
    try {
      const response = await axios.get(`${API_URL}/${itemId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create furniture item (admin only)
  createFurnitureItem: async (itemData) => {
    try {
      const response = await axios.post(API_URL, itemData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update furniture item (admin only)
  updateFurnitureItem: async (itemId, itemData) => {
    try {
      const response = await axios.put(`${API_URL}/${itemId}`, itemData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
