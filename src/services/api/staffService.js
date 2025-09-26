import staffData from "@/services/mockData/staff.json";

class StaffService {
  constructor() {
    this.staff = [...staffData];
  }

  async getAll() {
    await this.delay(250);
    return [...this.staff];
  }

  async getById(id) {
    await this.delay(200);
    const staffMember = this.staff.find(s => s.Id === parseInt(id));
    if (!staffMember) {
      throw new Error("Staff member not found");
    }
    return { ...staffMember };
  }

  async create(staffData) {
    await this.delay(400);
    const newStaffMember = {
      Id: Math.max(...this.staff.map(s => s.Id)) + 1,
      ...staffData,
      schedule: staffData.schedule || {}
    };
    this.staff.push(newStaffMember);
    return { ...newStaffMember };
  }

  async update(id, staffData) {
    await this.delay(300);
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Staff member not found");
    }
    
    this.staff[index] = {
      ...this.staff[index],
      ...staffData
    };
    
    return { ...this.staff[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Staff member not found");
    }
    
    const deletedStaffMember = this.staff.splice(index, 1)[0];
    return { ...deletedStaffMember };
  }

  async getByRole(role) {
    await this.delay(200);
    return this.staff.filter(member => member.role === role)
      .map(member => ({ ...member }));
  }

  async getAvailableStaff(date, time) {
    await this.delay(300);
    // Mock availability check - in real app would check against appointments
    return this.staff.filter(member => {
      const dayOfWeek = new Date(date).toLocaleLowerCase().substring(0, 3);
      const schedule = member.schedule[dayOfWeek];
      if (schedule === "off" || !schedule) return false;
      
      const [startTime, endTime] = schedule;
      return time >= startTime && time <= endTime;
    }).map(member => ({ ...member }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new StaffService();