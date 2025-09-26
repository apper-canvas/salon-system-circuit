import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ClientCard from "@/components/molecules/ClientCard";
import ClientForm from "@/components/organisms/ClientForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import clientService from "@/services/api/clientService";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCreateClient = async (clientData) => {
    try {
      const newClient = await clientService.create({
        ...clientData,
        createdAt: new Date().toISOString().split('T')[0]
      });
      setClients(prev => [...prev, newClient]);
      setShowForm(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateClient = async (clientData) => {
    try {
      const updatedClient = await clientService.update(selectedClient.Id, clientData);
      setClients(prev => prev.map(client => 
        client.Id === selectedClient.Id ? updatedClient : client
      ));
      setShowForm(false);
      setSelectedClient(null);
    } catch (error) {
      throw error;
    }
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  const handleBookAppointment = (client) => {
    console.log("Book appointment for:", client.name);
    // This would navigate to appointment booking with pre-selected client
  };

  const handleViewHistory = (client) => {
    console.log("View history for:", client.name);
    // This would show appointment history for the client
  };

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadClients} />;

  if (showForm) {
    return (
      <ClientForm
        client={selectedClient}
        onSubmit={selectedClient ? handleUpdateClient : handleCreateClient}
        onCancel={() => {
          setShowForm(false);
          setSelectedClient(null);
        }}
      />
    );
  }

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-800 font-display">Clients</h1>
          <p className="text-secondary-600 mt-1">
            Manage your client database and relationships
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowForm(true)}>
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search clients by name, phone, or email..."
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
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Total Clients</p>
              <p className="text-2xl font-bold text-primary-800 font-display">{clients.length}</p>
            </div>
            <ApperIcon name="Users" className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-50 to-pink-50 p-4 rounded-lg border border-accent-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">New This Month</p>
              <p className="text-2xl font-bold text-primary-800 font-display">12</p>
            </div>
            <ApperIcon name="UserPlus" className="h-8 w-8 text-accent-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Active Clients</p>
              <p className="text-2xl font-bold text-primary-800 font-display">{Math.round(clients.length * 0.8)}</p>
            </div>
            <ApperIcon name="UserCheck" className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">VIP Clients</p>
              <p className="text-2xl font-bold text-primary-800 font-display">{Math.round(clients.length * 0.15)}</p>
            </div>
            <ApperIcon name="Star" className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Client Grid */}
      {filteredClients.length === 0 ? (
        searchTerm ? (
          <Empty
            icon="Search"
            title="No clients found"
            message={`No clients match your search for "${searchTerm}". Try adjusting your search terms.`}
          />
        ) : (
          <Empty
            icon="Users"
            title="No clients yet"
            message="Start building your client base by adding your first client to the system."
            actionLabel="Add First Client"
            onAction={() => setShowForm(true)}
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <ClientCard
              key={client.Id}
              client={client}
              onEdit={handleEditClient}
              onViewHistory={handleViewHistory}
              onBookAppointment={handleBookAppointment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;