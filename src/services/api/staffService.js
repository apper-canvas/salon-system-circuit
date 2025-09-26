import { toast } from "react-toastify";

class StaffService {
  constructor() {
    this.tableName = 'staff_c';
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
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "schedule_c"}}
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
      console.error("Error fetching staff:", error?.response?.data?.message || error);
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
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "schedule_c"}}
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
      console.error(`Error fetching staff member ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(staffData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const scheduleText = typeof staffData.schedule === 'object' 
        ? JSON.stringify(staffData.schedule) 
        : (staffData.schedule_c || staffData.schedule || "");

      const params = {
        records: [{
          Name: staffData.name_c || staffData.name || "",
          name_c: staffData.name_c || staffData.name || "",
          role_c: staffData.role_c || staffData.role || "",
          email_c: staffData.email_c || staffData.email || "",
          phone_c: staffData.phone_c || staffData.phone || "",
          schedule_c: scheduleText
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
          console.error(`Failed to create ${failed.length} staff records:`, failed);
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
      console.error("Error creating staff member:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, staffData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const scheduleText = typeof staffData.schedule === 'object' 
        ? JSON.stringify(staffData.schedule) 
        : (staffData.schedule_c || staffData.schedule || "");
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: staffData.name_c || staffData.name || "",
          name_c: staffData.name_c || staffData.name || "",
          role_c: staffData.role_c || staffData.role || "",
          email_c: staffData.email_c || staffData.email || "",
          phone_c: staffData.phone_c || staffData.phone || "",
          schedule_c: scheduleText
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
          console.error(`Failed to update ${failed.length} staff records:`, failed);
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
      console.error("Error updating staff member:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} staff records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting staff member:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByRole(role) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "schedule_c"}}
        ],
        where: [{"FieldName": "role_c", "Operator": "EqualTo", "Values": [role]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching staff by role:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getAvailableStaff(date, time) {
    try {
      const allStaff = await this.getAll();
      
      return allStaff.filter(member => {
        try {
          const schedule = member.schedule_c ? JSON.parse(member.schedule_c) : {};
          const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
          const daySchedule = schedule[dayOfWeek];
          
          if (daySchedule === "off" || !daySchedule) return false;
          
          if (Array.isArray(daySchedule) && daySchedule.length >= 2) {
            const [startTime, endTime] = daySchedule;
            return time >= startTime && time <= endTime;
          }
          
          return false;
        } catch (error) {
          console.error("Error parsing schedule for staff member:", member.Id, error);
          return false;
        }
      });
    } catch (error) {
      console.error("Error getting available staff:", error);
      return [];
    }
  }
}

export default new StaffService();