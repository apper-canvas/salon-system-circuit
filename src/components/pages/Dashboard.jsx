import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, isToday } from "date-fns";
import appointmentService from "@/services/api/appointmentService";
import clientService from "@/services/api/clientService";
import serviceService from "@/services/api/serviceService";
import staffService from "@/services/api/staffService";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
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
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadDashboardData} />;

  // Filter today's appointments
  const todaysAppointments = appointments.filter(appointment => 
    isToday(new Date(appointment.date))
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Calculate stats
  const totalRevenue = appointments
    .filter(apt => apt.status === "completed")
    .reduce((sum, apt) => {
      const service = services.find(s => s.Id === apt.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const todaysRevenue = todaysAppointments
    .filter(apt => apt.status === "completed")
    .reduce((sum, apt) => {
      const service = services.find(s => s.Id === apt.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const activeClients = clients.length;
  const pendingAppointments = appointments.filter(apt => apt.status === "pending").length;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Appointments"
          value={todaysAppointments.length}
          icon="Calendar"
          trend="up"
          trendValue="2 more than yesterday"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          trend="up"
          trendValue="12% from last month"
        />
        <StatCard
          title="Active Clients"
          value={activeClients}
          icon="Users"
          trend="up"
          trendValue="5 new this week"
        />
        <StatCard
          title="Pending Bookings"
          value={pendingAppointments}
          icon="Clock"
        />
      </div>

      {/* Today's Schedule */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-800 font-display">
              Today's Schedule
            </h2>
            <p className="text-secondary-600 mt-1">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <Button variant="accent">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {todaysAppointments.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No appointments today"
            message="Your schedule is clear for today. Perfect time to catch up or take a well-deserved break!"
            actionLabel="Schedule Appointment"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {todaysAppointments.map(appointment => {
              const client = clients.find(c => c.Id === appointment.clientId);
              const service = services.find(s => s.Id === appointment.serviceId);
              const staffMember = staff.find(s => s.Id === appointment.staffId);

              return (
                <AppointmentCard
                  key={appointment.Id}
                  appointment={appointment}
                  client={client}
                  service={service}
                  staff={staffMember}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary-800">Staff on Duty</h3>
            <ApperIcon name="UserCheck" className="h-5 w-5 text-primary-600" />
          </div>
          <div className="space-y-2">
            {staff.slice(0, 3).map(member => (
              <div key={member.Id} className="flex items-center justify-between">
                <span className="text-sm text-primary-700">{member.name}</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Available
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-50 to-pink-50 rounded-lg p-6 border border-accent-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary-800">Popular Services</h3>
            <ApperIcon name="Scissors" className="h-5 w-5 text-accent-600" />
          </div>
          <div className="space-y-2">
            {services.slice(0, 3).map(service => (
              <div key={service.Id} className="flex items-center justify-between">
                <span className="text-sm text-primary-700">{service.name}</span>
                <span className="text-xs text-secondary-600">${service.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary-800">Today's Revenue</h3>
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-primary-800 font-display mb-2">
            ${todaysRevenue.toLocaleString()}
          </div>
          <p className="text-sm text-secondary-600">
            From {todaysAppointments.filter(apt => apt.status === "completed").length} completed appointments
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;