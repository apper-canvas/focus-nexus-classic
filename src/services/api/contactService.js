import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

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
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { 
            field: { Name: "company_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          },
          { field: { Name: "tags_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await client.fetchRecords("contact_c", params);

      if (!response.success) {
        console.error("Error fetching contacts:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
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
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { 
            field: { Name: "company_c" },
            referenceField: {
              field: { Name: "name_c" }
            }
          },
          { field: { Name: "tags_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await client.getRecordById("contact_c", id, params);

      if (!response?.data) {
        return null;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
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
          company_c: contactData.company ? parseInt(contactData.company) : null,
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(",") : "",
          notes_c: contactData.notes || ""
        }]
      };

      const response = await client.createRecord("contact_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
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
          company_c: contactData.company ? parseInt(contactData.company) : null,
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(",") : "",
          notes_c: contactData.notes || ""
        }]
      };

      const response = await client.updateRecord("contact_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      return false;
    }
  }
};