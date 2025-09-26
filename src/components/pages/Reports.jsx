import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import appointmentService from "@/services/api/appointmentService";
import serviceService from "@/services/api/serviceService";
import clientService from "@/services/api/clientService";

const Reports = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("month");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [appointmentsData, servicesData, clientsData] = await Promise.all([
        appointmentService.getAll(),
        serviceService.getAll(),
        clientService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setServices(servicesData);
      setClients(clientsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  // Calculate revenue data
  const revenueData = appointments
.filter(apt => (apt.status_c || apt.status) === "completed")
    .reduce((total, apt) => {
      const serviceId = apt.service_id_c?.Id || apt.serviceId;
      const service = services.find(s => s.Id === serviceId);
      return total + (service?.price_c || service?.price || 0);
    }, 0);

  // Monthly revenue chart data
  const monthlyRevenueData = {
    options: {
      chart: {
        type: 'line',
        toolbar: { show: false },
        foreColor: '#8B5A8C'
      },
      colors: ['#FF6B9D', '#8B5A8C'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        borderColor: '#E5E7EB'
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${value.toLocaleString()}`
        }
      },
      tooltip: {
        y: {
          formatter: (value) => `$${value.toLocaleString()}`
        }
      }
    },
    series: [{
      name: 'Revenue',
      data: [8500, 9200, 10400, 9800, 11500, 12300]
    }]
  };

  // Service popularity chart
  const servicePopularityData = {
    options: {
      chart: {
        type: 'donut',
        foreColor: '#8B5A8C'
      },
      colors: ['#FF6B9D', '#8B5A8C', '#D4A5D6', '#B07DB8', '#7A4F7C'],
labels: services.slice(0, 5).map(s => s.name_c || s.name),
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      }
    },
    series: [35, 25, 20, 12, 8]
  };

  // Appointment status distribution
  const appointmentStatusData = {
    options: {
      chart: {
        type: 'bar',
        toolbar: { show: false },
        foreColor: '#8B5A8C'
      },
      colors: ['#10B981', '#F59E0B', '#EF4444', '#8B5A8C'],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 8
        }
      },
      xaxis: {
        categories: ['Completed', 'Pending', 'Cancelled', 'Confirmed']
      },
      grid: {
        borderColor: '#E5E7EB'
      }
    },
    series: [{
      name: 'Appointments',
      data: [
appointments.filter(apt => (apt.status_c || apt.status) === 'completed').length,
        appointments.filter(apt => (apt.status_c || apt.status) === 'pending').length,
        appointments.filter(apt => (apt.status_c || apt.status) === 'cancelled').length,
        appointments.filter(apt => (apt.status_c || apt.status) === 'confirmed').length
      ]
    }]
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-800 font-display">Reports</h1>
          <p className="text-secondary-600 mt-1">
            Track your salon's performance and growth
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={dateRange === "week" ? "primary" : "outline"} 
            size="sm"
            onClick={() => setDateRange("week")}
          >
            Week
          </Button>
          <Button 
            variant={dateRange === "month" ? "primary" : "outline"} 
            size="sm"
            onClick={() => setDateRange("month")}
          >
            Month
          </Button>
          <Button 
            variant={dateRange === "year" ? "primary" : "outline"} 
            size="sm"
            onClick={() => setDateRange("year")}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
              <p className="text-3xl font-bold text-primary-800 mt-2 font-display">
                ${revenueData.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ApperIcon name="TrendingUp" className="h-4 w-4 mr-1" />
                <span>+12.5% from last month</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-3 rounded-lg">
              <ApperIcon name="DollarSign" className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Appointments</p>
              <p className="text-3xl font-bold text-primary-800 mt-2 font-display">
                {appointments.length}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ApperIcon name="TrendingUp" className="h-4 w-4 mr-1" />
                <span>+8.2% from last month</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-accent-100 to-pink-100 p-3 rounded-lg">
              <ApperIcon name="Calendar" className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">New Clients</p>
              <p className="text-3xl font-bold text-primary-800 mt-2 font-display">24</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ApperIcon name="TrendingUp" className="h-4 w-4 mr-1" />
                <span>+15.3% from last month</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-lg">
              <ApperIcon name="UserPlus" className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Avg. Service Value</p>
              <p className="text-3xl font-bold text-primary-800 mt-2 font-display">
${Math.round(revenueData / appointments.filter(apt => (apt.status_c || apt.status) === 'completed').length) || 0}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ApperIcon name="TrendingUp" className="h-4 w-4 mr-1" />
                <span>+5.1% from last month</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-3 rounded-lg">
              <ApperIcon name="Star" className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary-800 font-display">Revenue Trend</h3>
            <Button variant="outline" size="sm">
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <Chart
            options={monthlyRevenueData.options}
            series={monthlyRevenueData.series}
            type="line"
            height={300}
          />
        </Card>

        {/* Service Popularity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary-800 font-display">Popular Services</h3>
            <Button variant="outline" size="sm">
              <ApperIcon name="MoreVertical" className="h-4 w-4" />
            </Button>
          </div>
          <Chart
            options={servicePopularityData.options}
            series={servicePopularityData.series}
            type="donut"
            height={300}
          />
        </Card>

        {/* Appointment Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary-800 font-display">Appointment Status</h3>
            <Button variant="outline" size="sm">
              <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <Chart
            options={appointmentStatusData.options}
            series={appointmentStatusData.series}
            type="bar"
            height={300}
          />
        </Card>

        {/* Top Performers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary-800 font-display">Top Performers</h3>
            <Button variant="outline" size="sm">
              <ApperIcon name="Award" className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { name: "Sarah Johnson", role: "Senior Stylist", revenue: 5200, appointments: 24 },
              { name: "Maria Garcia", role: "Colorist", revenue: 4800, appointments: 22 },
              { name: "Jennifer Lee", role: "Nail Technician", revenue: 3600, appointments: 18 },
              { name: "Amanda Wilson", role: "Esthetician", revenue: 3200, appointments: 16 }
            ].map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-primary-600 to-accent-500 p-2 rounded-full">
                    <ApperIcon name="User" className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-800">{performer.name}</p>
                    <p className="text-sm text-secondary-600">{performer.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-800">${performer.revenue.toLocaleString()}</p>
                  <p className="text-sm text-secondary-600">{performer.appointments} appointments</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;