import serviceData from "@/services/mockData/services.json";

class ServiceService {
  constructor() {
    this.services = [...serviceData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.services];
  }

  async getById(id) {
    await this.delay(200);
    const service = this.services.find(s => s.Id === parseInt(id));
    if (!service) {
      throw new Error("Service not found");
    }
    return { ...service };
  }

  async create(serviceData) {
    await this.delay(400);
    const newService = {
      Id: Math.max(...this.services.map(s => s.Id)) + 1,
      ...serviceData
    };
    this.services.push(newService);
    return { ...newService };
  }

  async update(id, serviceData) {
    await this.delay(300);
    const index = this.services.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Service not found");
    }
    
    this.services[index] = {
      ...this.services[index],
      ...serviceData
    };
    
    return { ...this.services[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.services.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Service not found");
    }
    
    const deletedService = this.services.splice(index, 1)[0];
    return { ...deletedService };
  }

  async getByCategory(category) {
    await this.delay(250);
    return this.services.filter(service => service.category === category)
      .map(service => ({ ...service }));
  }

  async getCategories() {
    await this.delay(150);
    const categories = [...new Set(this.services.map(service => service.category))];
    return categories;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ServiceService();