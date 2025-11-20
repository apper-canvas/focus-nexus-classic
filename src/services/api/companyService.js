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

export const companyService = {
  async getAll() {
    try {
      const client = getApperClient();
const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "num_employees_c" } },
          { field: { Name: "annual_revenue_c" } },
          { field: { Name: "parent_company_id_c" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "parent_company_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };
      
      const response = await client.fetchRecords("company_c", params);
      
      if (!response || !response.success) {
        console.error("Error fetching companies:", response?.message || "No response received");
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error?.message || error?.response?.data?.message || error);
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
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "num_employees_c" } },
          { field: { Name: "annual_revenue_c" } },
          { field: { Name: "parent_company_id_c" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "parent_company_id_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          }
        ]
      };
      
      const response = await client.getRecordById("company_c", id, params);
      
      if (!response || !response.success) {
        console.error(`Error fetching company ${id}:`, response?.message || "No response received");
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return null;
    }
  },

async create(companyData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          name_c: companyData.name || "",
          address_c: companyData.address || "",
          city_c: companyData.city || "",
          state_c: companyData.state || "",
          zip_code_c: companyData.zipCode || "",
          phone_c: companyData.phone || "",
          website_c: companyData.website || "",
          industry_c: companyData.industry || "",
          notes_c: companyData.notes || "",
          num_employees_c: companyData.numEmployees || null,
          annual_revenue_c: companyData.annualRevenue || null,
          parent_company_id_c: companyData.parentCompanyId ? parseInt(companyData.parentCompanyId) : null
        }]
      };
      
      const response = await client.createRecord("company_c", params);
      
      if (!response || !response.success) {
        console.error("Error creating company:", response?.message || "No response received");
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
      console.error("Error creating company:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return null;
    }
  },

  async update(id, companyData) {
    try {
      const client = getApperClient();
const params = {
        records: [{
          Id: parseInt(id),
          name_c: companyData.name || "",
          address_c: companyData.address || "",
          city_c: companyData.city || "",
          state_c: companyData.state || "",
          zip_code_c: companyData.zipCode || "",
          phone_c: companyData.phone || "",
          website_c: companyData.website || "",
          industry_c: companyData.industry || "",
          notes_c: companyData.notes || "",
          num_employees_c: companyData.numEmployees || null,
          annual_revenue_c: companyData.annualRevenue || null,
          parent_company_id_c: companyData.parentCompanyId ? parseInt(companyData.parentCompanyId) : null
        }]
      };
      
      const response = await client.updateRecord("company_c", params);
      
      if (!response || !response.success) {
        console.error("Error updating company:", response?.message || "No response received");
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
      console.error("Error updating company:", error?.message || error?.response?.data?.message || error);
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
      
      const response = await client.deleteRecord("company_c", params);
      
      if (!response || !response.success) {
        console.error("Error deleting company:", response?.message || "No response received");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting company:", error?.message || error?.response?.data?.message || error);
      if (error?.message === "Network Error") {
        console.error("Network Error Details: Check ApperClient initialization");
      }
      return false;
    }
  }
};