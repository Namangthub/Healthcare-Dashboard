// src/models/departmentModel.js
import db from '../config/db.js';

export const DepartmentModel = {
  // Get all departments - return raw database rows
  getAllDepartments: async () => {
    try {
      const query = `
        SELECT d.*, 
               ds.doctors, ds.nurses, ds.support
        FROM departments d
        LEFT JOIN department_staff ds ON d.id = ds.department_id
        ORDER BY d.id
      `;
      const result = await db.query(query);
      return result.rows; // Return raw data without transformation
    } catch (error) {
      throw new Error(`Error getting departments: ${error.message}`);
    }
  },

  // Get a department by ID - return raw database row
  getDepartmentById: async (id) => {
    try {
      const query = `
        SELECT d.*, 
               ds.doctors, ds.nurses, ds.support
        FROM departments d
        LEFT JOIN department_staff ds ON d.id = ds.department_id
        WHERE d.id = $1
      `;
      const result = await db.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0]; // Return raw data without transformation
    } catch (error) {
      throw new Error(`Error getting department: ${error.message}`);
    }
  },
  
  // Get financial data for a department
  getDepartmentFinancials: async (id) => {
    try {
      const query = `
        SELECT revenue, percentage
        FROM department_financials
        WHERE department_id = $1
      `;
      const result = await db.query(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error getting department financials: ${error.message}`);
    }
  },
  
  // Get quality metrics for a department
  getDepartmentQualityMetrics: async (id) => {
    try {
      const query = `
        SELECT 
          qps.score as satisfaction_score, 
          qps.responses as satisfaction_responses,
          qwt.avg_wait as wait_time_avg,
          qwt.target as wait_time_target,
          qrr.rate as readmission_rate,
          qrr.target as readmission_target
        FROM departments d
        LEFT JOIN quality_patient_satisfaction qps ON d.id = qps.department_id
        LEFT JOIN quality_wait_times qwt ON d.id = qwt.department_id
        LEFT JOIN quality_readmission_rates qrr ON d.id = qrr.department_id
        WHERE d.id = $1
      `;
      const result = await db.query(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error getting department quality metrics: ${error.message}`);
    }
  },
  
  // Get staff count for a department
  getDepartmentStaffCount: async (id) => {
    try {
      const query = `
        SELECT COUNT(*) as total_staff
        FROM staff
        WHERE department_id = $1
      `;
      const result = await db.query(query, [id]);
      return result.rows.length > 0 ? parseInt(result.rows[0].total_staff) : 0;
    } catch (error) {
      throw new Error(`Error getting department staff count: ${error.message}`);
    }
  },
  
  // Get patient count for a department
  getDepartmentPatientCount: async (id) => {
    try {
      const query = `
        SELECT COUNT(*) as total_patients
        FROM patients
        WHERE department_id = $1
      `;
      const result = await db.query(query, [id]);
      return result.rows.length > 0 ? parseInt(result.rows[0].total_patients) : 0;
    } catch (error) {
      throw new Error(`Error getting department patient count: ${error.message}`);
    }
  }
};
