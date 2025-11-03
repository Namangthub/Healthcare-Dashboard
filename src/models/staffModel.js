import db from '../config/db.js';

// ✅ Staff Model for database operations
const StaffModel = {
  // Get all staff
  async getAllStaff() {
    const query = `
      SELECT s.*, d.name AS department_name
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      ORDER BY s.id;
    `;
    const result = await db.query(query);
    return result.rows;
  },

  // Get staff by ID
  async getStaffById(id) {
    const query = `
      SELECT s.*, d.name AS department_name
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  // Get staff by department
  async getStaffByDepartmentId(departmentId) {
    const query = `
      SELECT s.*, d.name AS department_name
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.department_id = $1
      ORDER BY s.id;
    `;
    const result = await db.query(query, [departmentId]);
    return result.rows;
  },

  // Update staff status
  async updateStaffStatus(id, status) {
    const validStatuses = ['On Duty', 'Off Duty', 'On Call', 'On Leave'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const query = `
      UPDATE staff
      SET status = $1::staff_status
      WHERE id = $2
      RETURNING *;
    `;
    const result = await db.query(query, [status, id]);
    return result.rows[0];
  },

  // Get staff count by role
  async getStaffCountByRole() {
    const query = `
      SELECT role, COUNT(*) AS count
      FROM staff
      GROUP BY role
      ORDER BY count DESC;
    `;
    const result = await db.query(query);
    return result.rows;
  },

  // Get staff count by department
  async getStaffCountByDepartment() {
    const query = `
      SELECT d.name AS department, COUNT(s.id) AS count
      FROM staff s
      JOIN departments d ON s.department_id = d.id
      GROUP BY d.name
      ORDER BY count DESC;
    `;
    const result = await db.query(query);
    return result.rows;
  },

  // Get patients assigned to staff
  async getPatientsByStaffId(staffId) {
    const query = `
      SELECT p.*, d.name AS department_name
      FROM patients p
      LEFT JOIN departments d ON p.department_id = d.id
      WHERE p.doctor_id = $1
      ORDER BY p.id;
    `;
    const result = await db.query(query, [staffId]);
    return result.rows;
  }
};

export default StaffModel;
