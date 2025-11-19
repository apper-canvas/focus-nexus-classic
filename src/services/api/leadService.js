import { toast } from 'react-toastify';

// Initialize ApperClient singleton
let apperClientInstance = null;

const getApperClient = () => {
  if (!apperClientInstance) {
    const { ApperClient } = window.ApperSDK;
    apperClientInstance = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
  return apperClientInstance;
};

export const leadService = {
  async getAll(filters = {}) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { "field": { "Name": "lead_name_c" } },
          { "field": { "Name": "email_c" } },
          { "field": { "Name": "phone_c" } },
          { "field": { "Name": "lead_source_c" } },
          { "field": { "Name": "lead_status_c" } },
          { "field": { "Name": "priority_c" } },
          { "field": { "Name": "assigned_to_c" }, "referenceField": { "field": { "Name": "Name" } } },
          { "field": { "Name": "CreatedOn" } }
        ],
        orderBy: [{ "fieldName": "CreatedOn", "sorttype": "DESC" }],
        pagingInfo: { "limit": 50, "offset": 0 }
      };

      // Add filters if provided
      if (filters.status) {
        params.where = [{ 
          "FieldName": "lead_status_c", 
          "Operator": "EqualTo", 
          "Values": [filters.status] 
        }];
      }

      const response = await apperClient.fetchRecords('lead_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching leads:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(leadId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { "field": { "Name": "lead_name_c" } },
          { "field": { "Name": "email_c" } },
          { "field": { "Name": "phone_c" } },
          { "field": { "Name": "lead_source_c" } },
          { "field": { "Name": "lead_status_c" } },
          { "field": { "Name": "priority_c" } },
          { "field": { "Name": "assigned_to_c" }, "referenceField": { "field": { "Name": "Name" } } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "ModifiedOn" } }
        ]
      };
      
      const response = await apperClient.getRecordById('lead_c', leadId, params);
      return response?.data || null;
    } catch (error) {
      console.error(`Error fetching lead ${leadId}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(leadData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields and ensure proper data types
      const params = {
        records: [{
          lead_name_c: leadData.lead_name_c,
          email_c: leadData.email_c,
          phone_c: leadData.phone_c,
          lead_source_c: leadData.lead_source_c,
          lead_status_c: leadData.lead_status_c || 'New',
          priority_c: leadData.priority_c || 'Medium',
          assigned_to_c: leadData.assigned_to_c ? parseInt(leadData.assigned_to_c) : null
        }]
      };
      
      const response = await apperClient.createRecord('lead_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} leads: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Lead created successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating lead:", error?.response?.data?.message || error);
      toast.error('Failed to create lead');
      throw error;
    }
  },

  async update(leadId, leadData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields and ensure proper data types
      const params = {
        records: [{
          Id: parseInt(leadId),
          lead_name_c: leadData.lead_name_c,
          email_c: leadData.email_c,
          phone_c: leadData.phone_c,
          lead_source_c: leadData.lead_source_c,
          lead_status_c: leadData.lead_status_c,
          priority_c: leadData.priority_c,
          assigned_to_c: leadData.assigned_to_c ? parseInt(leadData.assigned_to_c) : null
        }]
      };
      
      const response = await apperClient.updateRecord('lead_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} leads: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Lead updated successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating lead:", error?.response?.data?.message || error);
      toast.error('Failed to update lead');
      throw error;
    }
  },

  async delete(leadId) {
    try {
      const apperClient = getApperClient();
      
      const params = { 
        RecordIds: [parseInt(leadId)]
      };
      
      const response = await apperClient.deleteRecord('lead_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} leads: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Lead deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting lead:", error?.response?.data?.message || error);
      toast.error('Failed to delete lead');
      throw error;
    }
  }
};