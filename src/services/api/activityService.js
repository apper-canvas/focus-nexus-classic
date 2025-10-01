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

export const activityService = {
  async getAll(limit = 20) {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "entity_type_c" } },
          { field: { Name: "entity_id_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };
      
      const response = await client.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByEntityId(entityType, entityId, limit = 10) {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "entity_type_c" } },
          { field: { Name: "entity_id_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [
          {
            FieldName: "entity_type_c",
            Operator: "EqualTo",
            Values: [entityType]
          },
          {
            FieldName: "entity_id_c",
            Operator: "EqualTo",
            Values: [parseInt(entityId)]
          }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };
      
      const response = await client.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching activities for ${entityType} ${entityId}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  async create(activityData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          type_c: activityData.type || "",
          entity_type_c: activityData.entityType || "",
          entity_id_c: parseInt(activityData.entityId) || 0,
          description_c: activityData.description || "",
          timestamp_c: new Date().toISOString()
        }]
      };
      
      const response = await client.createRecord("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
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
      console.error("Error creating activity:", error?.response?.data?.message || error);
      return null;
    }
  }
};