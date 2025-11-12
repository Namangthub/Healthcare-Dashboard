import db from '../config/db.js';

export default class PatientModel {
  // ✅ Get all patients (includes discharged + active)
  static async getAllPatients() {
    try {
      const query = `
        SELECT 
          p.id,
          p.full_name,
          p.age,
          p.gender,
          d.name AS department_name,
          s.full_name AS doctor_name,
          COALESCE(p.status, 'Unknown') AS status,
          COALESCE(p.severity, 'Normal') AS severity,
          p.admission_date,
          p.last_visit,
          p.next_appointment,
          p.room,
          p.diagnosis,
          COALESCE(
            JSON_OBJECT(
              'bloodPressure', pv.blood_pressure,
              'heartRate', pv.heart_rate,
              'temperature', pv.temperature,
              'oxygenSaturation', pv.oxygen_saturation
            ),
            JSON_OBJECT()
          ) AS vitals
        FROM patients p
        LEFT JOIN departments d ON p.department_id = d.department_id
        LEFT JOIN staff s ON p.doctor_id = s.id
        LEFT JOIN patient_vitals_current pv ON pv.patient_id = p.id
        ORDER BY p.id ASC;
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('❌ Error getting all patients:', error);
      throw error;
    }
  }

  // ✅ Get only active patients
  static async getActivePatients() {
    try {
      const query = `
        SELECT 
          p.id,
          p.full_name,
          p.age,
          p.gender,
          d.name AS department_name,
          s.full_name AS doctor_name,
          COALESCE(p.status, 'Unknown') AS status,
          COALESCE(p.severity, 'Normal') AS severity,
          p.admission_date,
          p.last_visit,
          p.next_appointment,
          p.room,
          p.diagnosis,
          COALESCE(
            JSON_OBJECT(
              'bloodPressure', pv.blood_pressure,
              'heartRate', pv.heart_rate,
              'temperature', pv.temperature,
              'oxygenSaturation', pv.oxygen_saturation
            ),
            JSON_OBJECT()
          ) AS vitals
        FROM patients p
        LEFT JOIN departments d ON p.department_id = d.department_id
        LEFT JOIN staff s ON p.doctor_id = s.id
        LEFT JOIN patient_vitals_current pv ON pv.patient_id = p.id
        WHERE p.status != 'Discharged'
        ORDER BY p.id ASC;
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('❌ Error getting active patients:', error);
      throw error;
    }
  }
  // ✅ Get patients by status (fixed joins and column names)
static async getPatientsByStatus(status) {
  try {
    const query = `
      SELECT 
        p.id,
        p.full_name,
        p.age,
        p.gender,
        COALESCE(p.status, 'Unknown') AS status,
        COALESCE(p.severity, 'Normal') AS severity,
        p.admission_date,
        p.last_visit,
        p.next_appointment,
        p.room,
        p.diagnosis,
        COALESCE(
          JSON_OBJECT(
            'bloodPressure', pv.blood_pressure,
            'heartRate', pv.heart_rate,
            'temperature', pv.temperature,
            'oxygenSaturation', pv.oxygen_saturation
          ),
          JSON_OBJECT()
        ) AS vitals,
        d.name AS department_name,
        s.full_name AS doctor_name
      FROM patients p
      LEFT JOIN departments d ON p.department_id = d.department_id
      LEFT JOIN staff s ON p.doctor_id = s.id
      LEFT JOIN patient_vitals_current pv ON pv.patient_id = p.id
      WHERE p.status = ?
      ORDER BY p.id ASC;
    `;

    const [rows] = await db.query(query, [status]);
    return rows;
  } catch (error) {
    console.error('❌ Error in getPatientsByStatus:', error);
    throw error;
  }
}


  // ✅ Other existing methods (unchanged)
  static async getPatientById(id) {
    const [rows] = await db.query(`SELECT * FROM patients WHERE id = ?`, [id]);
    return rows[0];
  }

  static async getSecurePatientById(id) {
    const [rows] = await db.query(`SELECT id, full_name FROM patients WHERE id = ?`, [id]);
    return rows[0];
  }

  static async getPatientsByDepartment(departmentId) {
    const [rows] = await db.query(
      `SELECT * FROM patients WHERE department_id = ?`,
      [departmentId]
    );
    return rows;
  }

  static async getDemographics() {
    const [rows] = await db.query(`
      SELECT gender, COUNT(*) AS count FROM patients GROUP BY gender
    `);
    return rows;
  }

  static async getPatientTimeline(id) {
    return [
      { id: `${id}-1`, date: '2025-10-10', type: 'visit', title: 'Routine Check', description: 'Regular follow-up' },
      { id: `${id}-2`, date: '2025-09-25', type: 'test', title: 'Blood Test', description: 'Lab test done' }
    ];
  }
}
