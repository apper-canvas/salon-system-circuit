import clientData from "@/services/mockData/clients.json";

class ClientService {
  constructor() {
    this.clients = [...clientData];
  }

  async getAll() {
    await this.delay(250);
    return [...this.clients];
  }

  async getById(id) {
    await this.delay(200);
    const client = this.clients.find(c => c.Id === parseInt(id));
    if (!client) {
      throw new Error("Client not found");
    }
    return { ...client };
  }

  async create(clientData) {
    await this.delay(400);
    const newClient = {
      Id: Math.max(...this.clients.map(c => c.Id)) + 1,
      ...clientData,
      createdAt: clientData.createdAt || new Date().toISOString().split('T')[0]
    };
    this.clients.push(newClient);
    return { ...newClient };
  }

  async update(id, clientData) {
    await this.delay(300);
    const index = this.clients.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Client not found");
    }
    
    this.clients[index] = {
      ...this.clients[index],
      ...clientData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.clients[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.clients.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Client not found");
    }
    
    const deletedClient = this.clients.splice(index, 1)[0];
    return { ...deletedClient };
  }

  async search(query) {
    await this.delay(200);
    const searchTerm = query.toLowerCase();
    return this.clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      client.phone.includes(searchTerm)
    ).map(client => ({ ...client }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ClientService();