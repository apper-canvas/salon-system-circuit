import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ClientForm = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    preferences: ""
  });

  useEffect(() => {
    if (client) {
      setFormData({
name: client.name_c || client.name || "",
        phone: client.phone_c || client.phone || "",
        email: client.email_c || client.email || "",
        notes: client.notes_c || client.notes || "",
        preferences: client.preferences_c || client.preferences || ""
      });
    }
  }, [client]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

try {
      const clientData = {
        name_c: formData.name,
        phone_c: formData.phone,
        email_c: formData.email,
        notes_c: formData.notes,
        preferences_c: formData.preferences
      };
      await onSubmit(clientData);
      toast.success(client ? "Client updated successfully" : "Client created successfully");
    } catch (error) {
      toast.error("Failed to save client");
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
          {client ? "Edit Client" : "New Client"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ApperIcon name="X" className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Full Name *"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter client's full name"
          />

          <FormField
            label="Phone Number *"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="(555) 123-4567"
          />
        </div>

        <FormField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="client@example.com"
        />

        <FormField
          label="Preferences"
          name="preferences"
          value={formData.preferences}
          onChange={handleChange}
          placeholder="Preferred services, stylists, or special requests..."
        />

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Any additional notes about the client..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-secondary-100">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="accent">
            <ApperIcon name="Save" className="h-4 w-4 mr-2" />
            {client ? "Update Client" : "Create Client"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;