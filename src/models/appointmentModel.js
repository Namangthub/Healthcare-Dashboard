// src/models/AppointmentModel.js
import db from '../config/db.js';

export const AppointmentModel = {
  // Get all appointments
  getAllAppointments: async () => {
    try {
      const query = `
        SELECT a.*,
               p.full_name as patient_name,
               d.name as department_name,
               s.full_name as doctor_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        LEFT JOIN departments d ON a.department_id = d.id
        LEFT JOIN staff s ON a.staff_id = s.id
        ORDER BY a.date ASC, a.time ASC
      `;
      
      const result = await db.query(query);
      
      return result.rows.map(appointment => ({
        id: appointment.id,
        patientId: appointment.patient_id,
        patientName: appointment.patient_name,
        date: appointment.date,
        time: appointment.time,
        department: appointment.department_name,
        doctor: appointment.doctor_name,
        type: appointment.type,
        status: appointment.status,
        duration: appointment.duration,
        notes: appointment.notes
      }));
    } catch (error) {
      throw new Error(`Error getting appointments: ${error.message}`);
    }
  },

  // Get appointments for a specific day
  getAppointmentsForDay: async (date) => {
    try {
      const query = `
        SELECT a.*,
               p.full_name as patient_name,
               d.name as department_name,
               s.full_name as doctor_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        LEFT JOIN departments d ON a.department_id = d.id
        LEFT JOIN staff s ON a.staff_id = s.id
        WHERE a.date = $1
        ORDER BY a.time ASC
      `;
      
      const result = await db.query(query, [date]);
      
      return result.rows.map(appointment => ({
        id: appointment.id,
        patientId: appointment.patient_id,
        patientName: appointment.patient_name,
        date: appointment.date,
        time: appointment.time,
        department: appointment.department_name,
        doctor: appointment.doctor_name,
        type: appointment.type,
        status: appointment.status,
        duration: appointment.duration,
        notes: appointment.notes
      }));
    } catch (error) {
      throw new Error(`Error getting appointments for day: ${error.message}`);
    }
  },

  // Get appointments for a specific patient
  getPatientAppointments: async (patientId) => {
    try {
      const query = `
        SELECT a.*,
               p.full_name as patient_name,
               d.name as department_name,
               s.full_name as doctor_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        LEFT JOIN departments d ON a.department_id = d.id
        LEFT JOIN staff s ON a.staff_id = s.id
        WHERE a.patient_id = $1
        ORDER BY a.date ASC, a.time ASC
      `;
      
      const result = await db.query(query, [patientId]);
      
      return result.rows.map(appointment => ({
        id: appointment.id,
        patientId: appointment.patient_id,
        patientName: appointment.patient_name,
        date: appointment.date,
        time: appointment.time,
        department: appointment.department_name,
        doctor: appointment.doctor_name,
        type: appointment.type,
        status: appointment.status,
        duration: appointment.duration,
        notes: appointment.notes
      }));
    } catch (error) {
      throw new Error(`Error getting patient appointments: ${error.message}`);
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData) => {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      let departmentId = null;
      if (appointmentData.department) {
        const deptQuery = `SELECT id FROM departments WHERE name = $1`;
        const deptResult = await client.query(deptQuery, [appointmentData.department]);
        if (deptResult.rows.length > 0) {
          departmentId = deptResult.rows[0].id;
        }
      }
      
      let staffId = null;
      if (appointmentData.doctor) {
        const staffQuery = `SELECT id FROM staff WHERE full_name = $1`;
        const staffResult = await client.query(staffQuery, [appointmentData.doctor]);
        if (staffResult.rows.length > 0) {
          staffId = staffResult.rows[0].id;
        }
      }
      
      const timestamp = Date.now().toString().substr(-6);
      const id = `APT-${appointmentData.patientId}-${timestamp}`;
      
      const insertQuery = `
        INSERT INTO appointments
        (id, patient_id, department_id, staff_id, date, time, type, status, duration, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      
      const insertValues = [
        id,
        appointmentData.patientId,
        departmentId,
        staffId,
        appointmentData.date,
        appointmentData.time,
        appointmentData.type,
        appointmentData.status || 'Scheduled',
        appointmentData.duration || 30,
        appointmentData.notes || ''
      ];
      
      const result = await client.query(insertQuery, insertValues);
      
      const currentDate = new Date();
      const appointmentDate = new Date(appointmentData.date);
      
      if (appointmentDate > currentDate) {
        const updatePatientQuery = `
          UPDATE patients
          SET next_appointment = $1
          WHERE id = $2
        `;
        
        await client.query(updatePatientQuery, [
          appointmentData.date,
          appointmentData.patientId
        ]);
      }
      
      await client.query('COMMIT');
      
      const patientQuery = `SELECT full_name FROM patients WHERE id = $1`;
      const patientResult = await db.query(patientQuery, [appointmentData.patientId]);
      const patientName = patientResult.rows.length > 0 ? patientResult.rows[0].full_name : '';
      
      const doctorName = appointmentData.doctor || '';
      const departmentName = appointmentData.department || '';
      
      return {
        id,
        patientId: appointmentData.patientId,
        patientName,
        date: appointmentData.date,
        time: appointmentData.time,
        department: departmentName,
        doctor: doctorName,
        type: appointmentData.type,
        status: appointmentData.status || 'Scheduled',
        duration: appointmentData.duration || 30,
        notes: appointmentData.notes || ''
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating appointment: ${error.message}`);
    } finally {
      client.release();
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    try {
      const validStatuses = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
      }
      
      const query = `
        UPDATE appointments
        SET status = $1
        WHERE id = $2
        RETURNING *
      `;
      
      const result = await db.query(query, [status, id]);
      
      if (result.rows.length === 0) {
        throw new Error(`Appointment with ID ${id} not found`);
      }
      
      if (status === 'Completed') {
        const appointment = result.rows[0];
        const updatePatientQuery = `
          UPDATE patients
          SET last_visit = $1
          WHERE id = $2
        `;
        
        await db.query(updatePatientQuery, [
          appointment.date,
          appointment.patient_id
        ]);
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating appointment status: ${error.message}`);
    }
  },

  // Get monthly appointment statistics
  getMonthlyStats: async (month, year) => {
    try {
      const query = `
        SELECT 
          date, 
          COUNT(*) as total, 
          COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN status = 'No Show' THEN 1 END) as no_show
        FROM appointments
        WHERE EXTRACT(MONTH FROM date::date) = $1
          AND EXTRACT(YEAR FROM date::date) = $2
        GROUP BY date
        ORDER BY date ASC
      `;
      
      const result = await db.query(query, [month, year]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting monthly appointment stats: ${error.message}`);
    }
  },

  // Get appointment types statistics
  getAppointmentTypeStats: async () => {
    try {
      const query = `
        SELECT 
          type, 
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM appointments), 1) as percentage,
          AVG(duration) as avg_duration
        FROM appointments
        GROUP BY type
        ORDER BY count DESC
      `;
      
      const result = await db.query(query);
      
      return result.rows.map(row => ({
        type: row.type,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage),
        avgDuration: Math.round(parseFloat(row.avg_duration))
      }));
    } catch (error) {
      throw new Error(`Error getting appointment type stats: ${error.message}`);
    }
  }
};
