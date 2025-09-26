import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const AppointmentForm = ({ 
  appointment, 
  clients, 
  services, 
  staff, 
  onSubmit, 
  onCancel 
}) => {
const [formData, setFormData] = useState({
    clientId: "",
    staffId: "",
    serviceId: "",
    date: "",
    startTime: "",
    status: "pending",
    notes: ""
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        clientId: appointment.client_id_c?.Id || appointment.clientId || "",
        staffId: appointment.staff_id_c?.Id || appointment.staffId || "",
        serviceId: appointment.service_id_c?.Id || appointment.serviceId || "",
        date: appointment.date_c || appointment.date || "",
        startTime: appointment.start_time_c || appointment.startTime || "",
        status: appointment.status_c || appointment.status || "pending",
        notes: appointment.notes_c || appointment.notes || ""
      });
    }
  }, [appointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.serviceId || !formData.staffId || !formData.date || !formData.startTime) {
      toast.error("Please fill in all required fields");
      return;
    }

// Calculate end time based on service duration
    const selectedService = services.find(s => s.Id === parseInt(formData.serviceId));
    if (selectedService) {
      const duration = selectedService.duration_c || selectedService.duration || 60;
      const startTime = new Date(`2024-01-01T${formData.startTime}`);
      const endTime = new Date(startTime.getTime() + (duration * 60000));
      
      const appointmentData = {
        client_id_c: parseInt(formData.clientId),
        staff_id_c: parseInt(formData.staffId),
        service_id_c: parseInt(formData.serviceId),
        date_c: formData.date,
        start_time_c: formData.startTime,
        end_time_c: endTime.toTimeString().slice(0, 5),
        status_c: formData.status,
        notes_c: formData.notes
      };

      try {
        await onSubmit(appointmentData);
        toast.success(appointment ? "Appointment updated successfully" : "Appointment created successfully");
      } catch (error) {
        toast.error("Failed to save appointment");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-salon-lg max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-800 font-display">
          {appointment ? "Edit Appointment" : "New Appointment"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ApperIcon name="X" className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Client *
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select a client</option>
{clients.map(client => (
                <option key={client.Id} value={client.Id}>
                  {client.name_c || client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Service *
            </label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select a service</option>
{services.map(service => (
                <option key={service.Id} value={service.Id}>
                  {service.name_c || service.name} - ${service.price_c || service.price} ({service.duration_c || service.duration} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Staff Member *
            </label>
            <select
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select staff member</option>
{staff.map(member => (
                <option key={member.Id} value={member.Id}>
                  {member.name_c || member.name} - {member.role_c || member.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <FormField
            label="Date *"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <FormField
            label="Start Time *"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <FormField
          label="Notes"
          type="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any special notes or requests..."
        />

        <div className="flex justify-end gap-3 pt-6 border-t border-secondary-100">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="accent">
            <ApperIcon name="Save" className="h-4 w-4 mr-2" />
            {appointment ? "Update Appointment" : "Create Appointment"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;