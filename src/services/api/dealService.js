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

export const dealService = {
async getAll() {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "expected_close_date_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "sales_rep_id_c" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "contact_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          },
          { 
            field: { Name: "sales_rep_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };
      
if (!client) {
        console.error("Error fetching deals: ApperClient not initialized");
        return [];
      }
      const response = await client.fetchRecords("deal_c", params);
      
if (!response || !response.success) {
        console.error("Error fetching deals:", response?.message || "No response received");
        return [];
      }
      
      return response.data || [];
} catch (error) {
      console.error("Error fetching deals:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check if ApperClient is properly initialized with valid credentials");
      }
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
          { field: { Name: "title_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "expected_close_date_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "sales_rep_id_c" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "contact_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          },
          { 
            field: { Name: "sales_rep_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          }
        ]
      };
      
      const response = await client.getRecordById("deal_c", id, params);
if (!response || !response.success) {
        console.error(`Error fetching deal ${id}:`, response?.message || "No response received");
        return null;
      }
      
return response.data || null;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return null;
    }
  },

async getByContactId(contactId) {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "expected_close_date_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "sales_rep_id_c" } },
          { 
            field: { Name: "contact_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          },
          { 
            field: { Name: "sales_rep_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          }
        ],
        where: [
          {
            FieldName: "contact_id_c",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ]
      };
      
if (!client) {
        console.error(`Error fetching deals for contact ${contactId}: ApperClient not initialized`);
        return [];
      }
      const response = await client.fetchRecords("deal_c", params);
      
      if (!response || !response.success) {
        console.error(`Error fetching deals for contact ${contactId}:`, response?.message || "No response received");
        return [];
      }
return response.data || [];
    } catch (error) {
      console.error(`Error fetching deals for contact ${contactId}:`, error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return [];
    }
  },

  async create(dealData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          title_c: dealData.title || "",
          stage_c: dealData.stage || "Lead",
          value_c: parseFloat(dealData.value) || 0,
          expected_close_date_c: dealData.expectedCloseDate || "",
          contact_id_c: parseInt(dealData.contactId),
          sales_rep_id_c: dealData.salesRepId ? parseInt(dealData.salesRepId) : null,
          notes_c: dealData.notes || ""
        }]
      };
      
      const response = await client.createRecord("deal_c", params);
      
if (!response || !response.success) {
        console.error("Error creating deal:", response?.message || "No response received");
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
console.error("Error creating deal:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return null;
    }
  },

  async update(id, dealData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title || "",
          stage_c: dealData.stage || "Lead",
          value_c: parseFloat(dealData.value) || 0,
          expected_close_date_c: dealData.expectedCloseDate || "",
          contact_id_c: parseInt(dealData.contactId),
          sales_rep_id_c: dealData.salesRepId ? parseInt(dealData.salesRepId) : null,
          notes_c: dealData.notes || ""
        }]
      };
      
      const response = await client.updateRecord("deal_c", params);
      
if (!response || !response.success) {
        console.error("Error updating deal:", response?.message || "No response received");
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
console.error("Error updating deal:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const client = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await client.deleteRecord("deal_c", params);
      
      if (!response.success) {
console.error("Error deleting deal:", response?.message || "No response received");
        return false;
      }
      return true;
    } catch (error) {
console.error("Error deleting deal:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return false;
    }
  },

  async updateStage(id, stage) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          stage_c: stage
        }]
      };
      
      const response = await client.updateRecord("deal_c", params);
      
if (!response || !response.success) {
        console.error("Error updating deal stage:", response?.message || "No response received");
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
console.error("Error updating deal stage:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return null;
    }
  }
};