import appointmentData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.appointments];
  }

  async getById(id) {
    await this.delay(200);
    const appointment = this.appointments.find(apt => apt.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  }

  async create(appointmentData) {
    await this.delay(400);
    const newAppointment = {
      Id: Math.max(...this.appointments.map(apt => apt.Id)) + 1,
      ...appointmentData,
      createdAt: new Date().toISOString()
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await this.delay(300);
    const index = this.appointments.findIndex(apt => apt.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    
    this.appointments[index] = {
      ...this.appointments[index],
      ...appointmentData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.appointments[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.appointments.findIndex(apt => apt.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    
    const deletedAppointment = this.appointments.splice(index, 1)[0];
    return { ...deletedAppointment };
  }

  async getByDateRange(startDate, endDate) {
    await this.delay(300);
    return this.appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= new Date(startDate) && aptDate <= new Date(endDate);
    }).map(apt => ({ ...apt }));
  }

  async getByClient(clientId) {
    await this.delay(250);
    return this.appointments.filter(apt => apt.clientId === parseInt(clientId))
      .map(apt => ({ ...apt }));
  }

  async getByStaff(staffId) {
    await this.delay(250);
    return this.appointments.filter(apt => apt.staffId === parseInt(staffId))
      .map(apt => ({ ...apt }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AppointmentService();