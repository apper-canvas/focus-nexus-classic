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

export const contactService = {
async getAll() {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "sales_rep_id_c" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "sales_rep_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };
      
      const response = await client.fetchRecords("contact_c", params);
      
if (!response || !response.success) {
        console.error("Error fetching contacts:", response?.message || "No response received");
        return [];
      }
      
      return response.data || [];
} catch (error) {
      console.error("Error fetching contacts:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
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
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "sales_rep_id_c" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "sales_rep_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          }
        ]
      };
      
      const response = await client.getRecordById("contact_c", id, params);
      
if (!response || !response.success) {
        console.error(`Error fetching contact ${id}:`, response?.message || "No response received");
        return null;
      }
      
      return response.data || null;
} catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return null;
    }
  },

  async create(contactData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          name_c: contactData.name || "",
          email_c: contactData.email || "",
          phone_c: contactData.phone || "",
          company_c: contactData.company || "",
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(",") : contactData.tags || "",
          notes_c: contactData.notes || ""
        }]
      };
      
      const response = await client.createRecord("contact_c", params);
      
if (!response || !response.success) {
        console.error("Error creating contact:", response?.message || "No response received");
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
console.error("Error creating contact:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return null;
    }
  },

  async update(id, contactData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: contactData.name || "",
          email_c: contactData.email || "",
          phone_c: contactData.phone || "",
          company_c: contactData.company || "",
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(",") : contactData.tags || "",
          notes_c: contactData.notes || ""
        }]
      };
      
      const response = await client.updateRecord("contact_c", params);
      
if (!response || !response.success) {
        console.error("Error updating contact:", response?.message || "No response received");
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
console.error("Error updating contact:", error?.message || error?.response?.data?.message || error);
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
      
const response = await client.deleteRecord("contact_c", params);
      
      if (!response || !response.success) {
        console.error("Error deleting contact:", response?.message || "No response received");
        return false;
      }
return true;
    } catch (error) {
      console.error("Error deleting contact:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return false;
    }
  }
};