import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import AppointmentForm from "@/components/organisms/AppointmentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import appointmentService from "@/services/api/appointmentService";
import clientService from "@/services/api/clientService";
import serviceService from "@/services/api/serviceService";
import staffService from "@/services/api/staffService";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week");
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [appointmentsData, clientsData, servicesData, staffData] = await Promise.all([
        appointmentService.getAll(),
        clientService.getAll(),
        serviceService.getAll(),
        staffService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setClients(clientsData);
      setServices(servicesData);
      setStaff(staffData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAppointment = async (appointmentData) => {
    try {
      const newAppointment = await appointmentService.create(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      setShowForm(false);
      setSelectedAppointment(null);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateAppointment = async (appointmentData) => {
    try {
      const updatedAppointment = await appointmentService.update(selectedAppointment.Id, appointmentData);
      setAppointments(prev => prev.map(apt => 
        apt.Id === selectedAppointment.Id ? updatedAppointment : apt
      ));
      setShowForm(false);
      setSelectedAppointment(null);
    } catch (error) {
      throw error;
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentService.delete(appointmentId);
      setAppointments(prev => prev.filter(apt => apt.Id !== appointmentId));
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  if (showForm) {
    return (
      <AppointmentForm
        appointment={selectedAppointment}
        clients={clients}
        services={services}
        staff={staff}
        onSubmit={selectedAppointment ? handleUpdateAppointment : handleCreateAppointment}
        onCancel={() => {
          setShowForm(false);
          setSelectedAppointment(null);
        }}
      />
    );
  }

  // Generate week days
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  // Filter appointments for the current week
  const weekAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return weekDays.some(day => isSameDay(day, appointmentDate));
  });

  const navigateWeek = (direction) => {
    setCurrentDate(prev => addDays(prev, direction * 7));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-800 font-display">Calendar</h1>
          <p className="text-secondary-600 mt-1">
            Manage your salon appointments and schedule
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg border border-secondary-200">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigateWeek(-1)}>
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold text-primary-800">
            {format(startDate, "MMMM d")} - {format(addDays(startDate, 6), "MMMM d, yyyy")}
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigateWeek(1)}>
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={view === "week" ? "primary" : "outline"} 
            size="sm"
            onClick={() => setView("week")}
          >
            Week
          </Button>
          <Button 
            variant={view === "day" ? "primary" : "outline"} 
            size="sm"
            onClick={() => setView("day")}
          >
            Day
          </Button>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weekDays.map(day => {
          const dayAppointments = weekAppointments.filter(appointment => 
            isSameDay(new Date(appointment.date), day)
          ).sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={day.toISOString()} className="space-y-3">
              <div className="text-center py-3 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg border border-secondary-200">
                <h3 className="font-semibold text-primary-800">
                  {format(day, "EEE")}
                </h3>
                <p className={`text-lg font-bold ${
                  isSameDay(day, new Date()) 
                    ? "text-accent-600" 
                    : "text-primary-700"
                }`}>
                  {format(day, "d")}
                </p>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {dayAppointments.length === 0 ? (
                  <div className="text-center py-8 text-secondary-500">
                    <ApperIcon name="Calendar" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No appointments</p>
                  </div>
                ) : (
                  dayAppointments.map(appointment => {
                    const client = clients.find(c => c.Id === appointment.clientId);
                    const service = services.find(s => s.Id === appointment.serviceId);
                    const staffMember = staff.find(s => s.Id === appointment.staffId);

                    return (
                      <div key={appointment.Id} className="relative">
                        <AppointmentCard
                          appointment={appointment}
                          client={client}
                          service={service}
                          staff={staffMember}
                          onEdit={handleEditAppointment}
                          onCancel={handleCancelAppointment}
                          className="text-xs p-3"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-primary-800">This Week</h3>
            <ApperIcon name="Calendar" className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-primary-800 font-display">
            {weekAppointments.length}
          </p>
          <p className="text-sm text-secondary-600">Total appointments</p>
        </div>

        <div className="bg-gradient-to-br from-accent-50 to-pink-50 p-6 rounded-lg border border-accent-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-primary-800">Confirmed</h3>
            <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-primary-800 font-display">
            {weekAppointments.filter(apt => apt.status === "confirmed").length}
          </p>
          <p className="text-sm text-secondary-600">Ready to go</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-primary-800">Pending</h3>
            <ApperIcon name="Clock" className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-primary-800 font-display">
            {weekAppointments.filter(apt => apt.status === "pending").length}
          </p>
          <p className="text-sm text-secondary-600">Need confirmation</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;