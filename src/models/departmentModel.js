import db from '../config/db.js';

export const DepartmentModel = {
  // Get all departments - return raw database rows
  getAllDepartments: async () => {
    try {
      const query = `
        SELECT 
          d.*, 
          ds.doctors, 
          ds.nurses, 
          ds.support
        FROM departments d
        LEFT JOIN department_staff ds ON d.id = ds.department_id
        ORDER BY d.id;
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Error getting departments: ${error.message}`);
    }
  },

  // Get a department by ID - return raw database row
  getDepartmentById: async (id) => {
    try {
      const query = `
        SELECT 
          d.*, 
          ds.doctors, 
          ds.nurses, 
          ds.support
        FROM departments d
        LEFT JOIN department_staff ds ON d.id = ds.department_id
        WHERE d.id = ?;
      `;
      const [rows] = await db.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
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
        WHERE department_id = ?;
      `;
      const [rows] = await db.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error getting department financials: ${error.message}`);
    }
  },
  
  // Get quality metrics for a department
  getDepartmentQualityMetrics: async (id) => {
    try {
      const query = `
        SELECT 
          qps.score AS satisfaction_score, 
          qps.responses AS satisfaction_responses,
          qwt.avg_wait AS wait_time_avg,
          qwt.target AS wait_time_target,
          qrr.rate AS readmission_rate,
          qrr.target AS readmission_target
        FROM departments d
        LEFT JOIN quality_patient_satisfaction qps ON d.id = qps.department_id
        LEFT JOIN quality_wait_times qwt ON d.id = qwt.department_id
        LEFT JOIN quality_readmission_rates qrr ON d.id = qrr.department_id
        WHERE d.id = ?;
      `;
      const [rows] = await db.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error getting department quality metrics: ${error.message}`);
    }
  },
  
  // Get staff count for a department
  getDepartmentStaffCount: async (id) => {
    try {
      const query = `
        SELECT COUNT(*) AS total_staff
        FROM staff
        WHERE department_id = ?;
      `;
      const [rows] = await db.query(query, [id]);
      return rows.length > 0 ? parseInt(rows[0].total_staff) : 0;
    } catch (error) {
      throw new Error(`Error getting department staff count: ${error.message}`);
    }
  },
  
  // Get patient count for a department
  getDepartmentPatientCount: async (id) => {
    try {
      const query = `
        SELECT COUNT(*) AS total_patients
        FROM patients
        WHERE department_id = ?;
      `;
      const [rows] = await db.query(query, [id]);
      return rows.length > 0 ? parseInt(rows[0].total_patients) : 0;
    } catch (error) {
      throw new Error(`Error getting department patient count: ${error.message}`);
    }
  },

  // 🆕 Get appointments for a department
getDepartmentAppointments: async (id) => {
  try {
    const query = `
      SELECT 
        a.appointment_id, 
        a.patient_id, 
        a.doctor_, 
        a.department_id, 
        a.date AS appointment_date, 
        a.status,
        p.full_name AS patient_name, 
        s.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.staff_id = s.id
      WHERE a.department_id = ?
      ORDER BY a.date DESC;
    `;
    const [rows] = await db.query(query, [id]);
    return rows;
  } catch (error) {
    throw new Error(`Error getting department appointments: ${error.message}`);
  }
}
};
