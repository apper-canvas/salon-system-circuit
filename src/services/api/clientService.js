import { toast } from "react-toastify";

class ClientService {
  constructor() {
    this.tableName = 'client_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching clients:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(clientData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: clientData.name_c || clientData.name || "",
          name_c: clientData.name_c || clientData.name || "",
          phone_c: clientData.phone_c || clientData.phone || "",
          email_c: clientData.email_c || clientData.email || "",
          notes_c: clientData.notes_c || clientData.notes || "",
          preferences_c: clientData.preferences_c || clientData.preferences || "",
          created_at_c: clientData.created_at_c || clientData.createdAt || new Date().toISOString().split('T')[0]
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} client records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating client:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, clientData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: clientData.name_c || clientData.name || "",
          name_c: clientData.name_c || clientData.name || "",
          phone_c: clientData.phone_c || clientData.phone || "",
          email_c: clientData.email_c || clientData.email || "",
          notes_c: clientData.notes_c || clientData.notes || "",
          preferences_c: clientData.preferences_c || clientData.preferences || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} client records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating client:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} client records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting client:", error?.response?.data?.message || error);
      return false;
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        whereGroups: {
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "name_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "email_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "phone_c", "operator": "Contains", "values": [query]}
              ]
            }
          ]
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching clients:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new ClientService();
