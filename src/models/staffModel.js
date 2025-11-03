// src/models/StaffModel.js
import db from '../config/db.js';

// Staff model for database operations related to staff members
export const StaffModel = {
  // Get all staff members
  getAllStaff: async () => {
    try {
      const query = `
        SELECT s.*,
               d.name as department_name
        FROM staff s
        LEFT JOIN departments d ON s.department_id = d.id
        ORDER BY s.id
      `;
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting staff: ${error.message}`);
    }
  },

  // Get a staff member by ID
  getStaffById: async (id) => {
    try {
      const query = `
        SELECT s.*,
               d.name as department_name
        FROM staff s
        LEFT JOIN departments d ON s.department_id = d.id
        WHERE s.id = $1
      `;
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error getting staff member: ${error.message}`);
    }
  },

  // Get staff members by department ID
  getStaffByDepartmentId: async (departmentId) => {
    try {
      const query = `
        SELECT s.*,
               d.name as department_name
        FROM staff s
        LEFT JOIN departments d ON s.department_id = d.id
        WHERE s.department_id = $1
        ORDER BY s.id
      `;
      const result = await db.query(query, [departmentId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting staff by department: ${error.message}`);
    }
  },

  // Update staff status
  updateStaffStatus: async (id, status) => {
    try {
      const validStatuses = ['On Duty', 'Off Duty', 'On Call', 'On Leave'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      const query = `
        UPDATE staff
        SET status = $1::staff_status
        WHERE id = $2
        RETURNING *
      `;
      const result = await db.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating staff status: ${error.message}`);
    }
  },

  // Get staff count by role
  getStaffCountByRole: async () => {
    try {
      const query = `
        SELECT role, COUNT(*) as count
        FROM staff
        GROUP BY role
        ORDER BY count DESC
      `;
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting staff count by role: ${error.message}`);
    }
  },

  // Get staff count by department
  getStaffCountByDepartment: async () => {
    try {
      const query = `
        SELECT d.name as department, COUNT(s.id) as count
        FROM staff s
        JOIN departments d ON s.department_id = d.id
        GROUP BY d.name
        ORDER BY count DESC
      `;
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting staff count by department: ${error.message}`);
    }
  },

  // Get patients assigned to a staff member
  getPatientsByStaffId: async (staffId) => {
    try {
      const query = `
        SELECT p.*,
               d.name as department_name
        FROM patients p
        LEFT JOIN departments d ON p.department_id = d.id
        WHERE p.doctor_id = $1
        ORDER BY p.id
      `;
      const result = await db.query(query, [staffId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting patients by staff ID: ${error.message}`);
    }
  }
};
