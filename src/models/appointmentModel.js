// src/models/AppointmentModel.js
import db from '../config/db.js';

const AppointmentModel = {
  // Get all appointments
  async getAllAppointments() {
    const query = `
      SELECT 
        a.id,
        a.patient_id AS patientId,
        p.name AS patientName,
        a.date,
        a.time,
        a.status,
        a.type,
        a.doctor_name AS doctorName
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      ORDER BY a.date DESC, a.time DESC;
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // Get appointments for a specific day
  async getAppointmentsForDay(date) {
    const query = `
      SELECT 
        a.id,
        a.patient_id AS patientId,
        p.name AS patientName,
        a.date,
        a.time,
        a.status,
        a.type,
        a.doctor_name AS doctorName
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE a.date = ?
      ORDER BY a.time ASC;
    `;
    const [rows] = await db.query(query, [date]);
    return rows;
  },

  // Get appointments for a specific patient
  async getPatientAppointments(patientId) {
    const query = `
      SELECT 
        id, 
        date, 
        time, 
        status, 
        type, 
        doctor_name AS doctorName
      FROM appointments
      WHERE patient_id = ?
      ORDER BY date DESC, time DESC;
    `;
    const [rows] = await db.query(query, [patientId]);
    return rows;
  },

  // Create a new appointment
  async createAppointment(data) {
    const query = `
      INSERT INTO appointments (patient_id, date, time, type, status, doctor_name)
      VALUES (?, ?, ?, ?, 'Scheduled', ?);
    `;
    const values = [
      data.patientId,
      data.date,
      data.time,
      data.type,
      data.doctorName || 'Unassigned'
    ];
    const [result] = await db.query(query, values);

    return {
      id: result.insertId,
      patientId: data.patientId,
      date: data.date,
      time: data.time,
      type: data.type,
      doctorName: data.doctorName || 'Unassigned',
      status: 'Scheduled'
    };
  },

  // Update appointment status
  async updateAppointmentStatus(id, status) {
    const query = `
      UPDATE appointments
      SET status = ?
      WHERE id = ?;
    `;
    await db.query(query, [status, id]);
    return true;
  },

  // Get monthly appointment statistics
  async getMonthlyStats(month, year) {
    const query = `
      SELECT 
        COUNT(*) AS total,
        SUM(status = 'Completed') AS completed,
        SUM(status = 'Cancelled') AS cancelled
      FROM appointments
      WHERE MONTH(date) = ? AND YEAR(date) = ?;
    `;
    const [rows] = await db.query(query, [month, year]);
    return rows[0];
  },

  // Get appointment type breakdown
  async getAppointmentTypeStats() {
    const query = `
      SELECT 
        type, 
        COUNT(*) AS count
      FROM appointments
      GROUP BY type
      ORDER BY count DESC;
    `;
    const [rows] = await db.query(query);
    return rows;
  }
};

export default AppointmentModel;
