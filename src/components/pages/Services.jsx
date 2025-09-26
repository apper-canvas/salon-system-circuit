import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import serviceService from "@/services/api/serviceService";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceService.getAll();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadServices} />;

  // Get unique categories
const categories = ["all", ...new Set(services.map(service => service.category_c || service.category).filter(Boolean))];

  // Filter and search logic
  const filteredServices = services.filter(service => {
    const name = service.name_c || service.name || "";
    const description = service.description_c || service.description || "";
    const category = service.category_c || service.category || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group services by category
  const servicesByCategory = {};
filteredServices.forEach(service => {
    const category = service.category_c || service.category || "Other";
    if (!servicesByCategory[category]) {
      servicesByCategory[category] = [];
    }
    servicesByCategory[category].push(service);
  });

  const getCategoryIcon = (category) => {
    const icons = {
      "Hair": "Scissors",
      "Nails": "Hand",
      "Skin": "Sparkles",
      "Massage": "Heart",
      "Makeup": "Palette",
      "Eyebrows": "Eye",
      "Hair Removal": "Zap"
    };
    return icons[category] || "Star";
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Hair": "accent",
      "Nails": "default",
      "Skin": "success",
      "Massage": "warning",
      "Makeup": "error",
      "Eyebrows": "accent",
      "Hair Removal": "default"
    };
    return colors[category] || "default";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-800 font-display">Services</h1>
          <p className="text-secondary-600 mt-1">
            Manage your service menu and pricing
          </p>
        </div>
        <Button variant="accent">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Service
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category === "all" ? "All Services" : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Total Services</p>
              <p className="text-2xl font-bold text-primary-800 font-display">{services.length}</p>
            </div>
            <ApperIcon name="Scissors" className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-50 to-pink-50 p-4 rounded-lg border border-accent-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Avg. Price</p>
              <p className="text-2xl font-bold text-primary-800 font-display">
${Math.round(services.reduce((sum, s) => sum + (s.price_c || s.price || 0), 0) / services.length) || 0}
              </p>
            </div>
            <ApperIcon name="DollarSign" className="h-8 w-8 text-accent-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Categories</p>
              <p className="text-2xl font-bold text-primary-800 font-display">{categories.length - 1}</p>
            </div>
            <ApperIcon name="Grid3X3" className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Most Popular</p>
              <p className="text-xl font-bold text-primary-800 font-display">Haircut</p>
            </div>
            <ApperIcon name="TrendingUp" className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        searchTerm ? (
          <Empty
            icon="Search"
            title="No services found"
            message={`No services match your search for "${searchTerm}". Try adjusting your search terms.`}
          />
        ) : (
          <Empty
            icon="Scissors"
            title="No services yet"
            message="Start building your service menu by adding your first service offering."
            actionLabel="Add First Service"
          />
        )
      ) : (
        <div className="space-y-8">
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-2 rounded-lg">
                  <ApperIcon name={getCategoryIcon(category)} className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-primary-800 font-display">{category}</h2>
                <Badge variant={getCategoryColor(category)}>
                  {categoryServices.length} services
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map(service => (
                  <Card key={service.Id} className="p-6 hover:scale-[1.02] transition-transform duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-800 mb-2">{service.name}</h3>
                        <p className="text-sm text-secondary-600 mb-3">{service.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-primary-800 font-display">${service.price}</p>
                        <p className="text-sm text-secondary-600">{service.duration} min</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
<Badge variant={getCategoryColor(service.category_c || service.category)}>
                        {service.category}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ApperIcon name="MoreVertical" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;