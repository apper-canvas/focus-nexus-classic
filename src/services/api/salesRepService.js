let apperClient = null;

const getApperClient = () => {
  if (!apperClient) {
    const { ApperClient } = window.ApperSDK;
    apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
  return apperClient;
};

export const salesRepService = {
  async getAll() {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "phone_c" } }
        ]
      };
      
      const response = await client.fetchRecords("sales_rep_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching sales reps:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "phone_c" } }
        ]
      };
      
      const response = await client.getRecordById("sales_rep_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching sales rep ${id}:`, error?.response?.data?.message || error);
return null;
    }
  }
};