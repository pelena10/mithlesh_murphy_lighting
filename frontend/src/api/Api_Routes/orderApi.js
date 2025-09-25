import api from "../api";
// Order API methods
export const orderApi = {
  // Get all temporary order items
  getTempItems: async (cust_id) => {
    try {
      const response = await api.get("/order/temp-items-cust/" + cust_id);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch temporary order items");
    }
  },

  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post("/order", orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create order");
    }
  },

  // Add a temporary order item
  addTempItem: async (itemData) => {
    try {
      const response = await api.post("/order/temp-items", itemData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add temporary item");
    }
  },

  // Update a temporary order item
  updateTempItem: async (id, itemData) => {
    try {
      const response = await api.put(`/order/temp-items/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update temporary item");
    }
  },

  // Delete a temporary order item
  deleteTempItem: async (id) => {
    try {
      const response = await api.delete(`/order/temp-items/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete temporary item");
    }
  },
    getPendingOrder: async () => {
    try {
      const response = await api.get("/order/pending");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch temporary order items");
    }
  },
    getPendingOrderItems: async (cust_id) => {
    try {
      const response = await api.get("/order/pending-items/" + cust_id);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch temporary order items");
    }
  },
    getTotalCustPendingOrders: async (cust_id) => {
    try {
      const response = await api.get(`/order/total-cust-pending-order/${cust_id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch temporary order items");
    }
  },
    getFgName: async () => {
    try {
      const response = await api.get(`/fg-name`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch temporary order items");
    }
  },
    getFgNameById: async (id) => {
    try {
      const response = await api.get(`/fg-name/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch temporary order items");
    }
  },
    getAllFGNameAttributes: async (fg_id) => {
    try {
      const response = await api.get(`/fg-name/attributes/${fg_id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch temporary order items");
    }
  },
};

export default orderApi;