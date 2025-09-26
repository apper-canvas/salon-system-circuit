import { toast } from "react-toastify";

class AppointmentService {
  constructor() {
    this.tableName = 'appointment_c';
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "client_id_c"}},
          {"field": {"Name": "staff_id_c"}},
          {"field": {"Name": "service_id_c"}}
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
      console.error("Error fetching appointments:", error?.response?.data?.message || error);
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "client_id_c"}},
          {"field": {"Name": "staff_id_c"}},
          {"field": {"Name": "service_id_c"}}
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
      console.error(`Error fetching appointment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(appointmentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: `Appointment - ${appointmentData.date_c || appointmentData.date}`,
          date_c: appointmentData.date_c || appointmentData.date || "",
          start_time_c: appointmentData.start_time_c || appointmentData.startTime || "",
          end_time_c: appointmentData.end_time_c || appointmentData.endTime || "",
          status_c: appointmentData.status_c || appointmentData.status || "pending",
          notes_c: appointmentData.notes_c || appointmentData.notes || "",
          client_id_c: parseInt(appointmentData.client_id_c || appointmentData.clientId || 0),
          staff_id_c: parseInt(appointmentData.staff_id_c || appointmentData.staffId || 0),
          service_id_c: parseInt(appointmentData.service_id_c || appointmentData.serviceId || 0)
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
          console.error(`Failed to create ${failed.length} appointment records:`, failed);
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
      console.error("Error creating appointment:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, appointmentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Appointment - ${appointmentData.date_c || appointmentData.date}`,
          date_c: appointmentData.date_c || appointmentData.date || "",
          start_time_c: appointmentData.start_time_c || appointmentData.startTime || "",
          end_time_c: appointmentData.end_time_c || appointmentData.endTime || "",
          status_c: appointmentData.status_c || appointmentData.status || "pending",
          notes_c: appointmentData.notes_c || appointmentData.notes || "",
          client_id_c: parseInt(appointmentData.client_id_c || appointmentData.clientId || 0),
          staff_id_c: parseInt(appointmentData.staff_id_c || appointmentData.staffId || 0),
          service_id_c: parseInt(appointmentData.service_id_c || appointmentData.serviceId || 0)
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
          console.error(`Failed to update ${failed.length} appointment records:`, failed);
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
      console.error("Error updating appointment:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} appointment records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "client_id_c"}},
          {"field": {"Name": "staff_id_c"}},
          {"field": {"Name": "service_id_c"}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]},
          {"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by date range:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByClient(clientId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "client_id_c"}},
          {"field": {"Name": "staff_id_c"}},
          {"field": {"Name": "service_id_c"}}
        ],
        where: [{"FieldName": "client_id_c", "Operator": "EqualTo", "Values": [parseInt(clientId)]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by client:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStaff(staffId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "client_id_c"}},
          {"field": {"Name": "staff_id_c"}},
          {"field": {"Name": "service_id_c"}}
        ],
        where: [{"FieldName": "staff_id_c", "Operator": "EqualTo", "Values": [parseInt(staffId)]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by staff:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new AppointmentService();

export default new AppointmentService();