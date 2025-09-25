import api from "../api";

// Customer API methods
export const customerApi = {
  // master-data-customer
  getMasterDataCustomer: async () => {
    try {
      const response = await api.get("/customers/master-data-customer");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch customers");
    }
  },
  // Get all customers
  getAll: async () => {
    try {
      const response = await api.get("/customers");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch customers");
    }
  },
  getCustomersNameList: async () => {
    try {
      const response = await api.get("/customers/name-list");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch customers");
    }
  },

  // Get single customer by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch customer");
    }
  },

  // Create new customer
  create: async (customerData) => {
    try {
      const response = await api.post("/customers", customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create customer");
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update customer");
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete customer");
    }
  },

  // Upload documents
  uploadDocuments: async (customerId, formData) => {
    try {
      const response = await api.post(`/customers/${customerId}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to upload documents");
    }
  },
};

export default customerApi;