import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import staffService from "@/services/api/staffService";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getAll();
      setStaff(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadStaff} />;

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    const icons = {
      "Stylist": "Scissors",
      "Nail Technician": "Hand",
      "Esthetician": "Sparkles",
      "Massage Therapist": "Heart",
      "Makeup Artist": "Palette",
      "Manager": "UserCheck",
      "Receptionist": "Phone"
    };
    return icons[role] || "User";
  };

  const getRoleColor = (role) => {
    const colors = {
      "Stylist": "accent",
      "Nail Technician": "default",
      "Esthetician": "success",
      "Massage Therapist": "warning",
      "Makeup Artist": "error",
      "Manager": "accent",
      "Receptionist": "default"
    };
    return colors[role] || "default";
  };

  const getStatusColor = (isAvailable) => {
    return isAvailable ? "success" : "error";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-800 font-display">Staff</h1>
          <p className="text-secondary-600 mt-1">
            Manage your team and their schedules
          </p>
        </div>
        <Button variant="accent">
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          New Staff Member
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search staff by name, role, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            Schedules
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Total Staff</p>
              <p className="text-2xl font-bold text-primary-800 font-display">{staff.length}</p>
            </div>
            <ApperIcon name="Users" className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Available Today</p>
              <p className="text-2xl font-bold text-primary-800 font-display">
                {staff.filter(member => Math.random() > 0.3).length}
              </p>
            </div>
            <ApperIcon name="UserCheck" className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-50 to-pink-50 p-4 rounded-lg border border-accent-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Stylists</p>
              <p className="text-2xl font-bold text-primary-800 font-display">
                {staff.filter(member => member.role === "Stylist").length}
              </p>
            </div>
            <ApperIcon name="Scissors" className="h-8 w-8 text-accent-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">On Break</p>
              <p className="text-2xl font-bold text-primary-800 font-display">
                {staff.filter(member => Math.random() > 0.7).length}
              </p>
            </div>
            <ApperIcon name="Coffee" className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        searchTerm ? (
          <Empty
            icon="Search"
            title="No staff found"
            message={`No staff members match your search for "${searchTerm}". Try adjusting your search terms.`}
          />
        ) : (
          <Empty
            icon="Users"
            title="No staff members yet"
            message="Start building your team by adding your first staff member to the system."
            actionLabel="Add First Staff Member"
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map(member => {
            const isAvailable = Math.random() > 0.3;
            const todaysAppointments = Math.floor(Math.random() * 8) + 1;
            
            return (
              <Card key={member.Id} className="p-6 hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-primary-600 to-accent-500 p-3 rounded-full">
                      <ApperIcon name={getRoleIcon(member.role)} className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-800">{member.name}</h3>
                      <Badge variant={getRoleColor(member.role)} className="mt-1">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(isAvailable)}>
                    {isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-secondary-600 flex items-center">
                    <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                    {member.email}
                  </p>
                  <p className="text-sm text-secondary-600 flex items-center">
                    <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                    {member.phone}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-3 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-secondary-600">Today's Appointments</p>
                      <p className="text-lg font-bold text-primary-800">{todaysAppointments}</p>
                    </div>
                    <ApperIcon name="Calendar" className="h-5 w-5 text-primary-600" />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-secondary-100">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ApperIcon name="Calendar" className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ApperIcon name="MoreVertical" className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Staff;