import db from "../config/db.js";
 
// ✅ Get all appointments

export const getAllAppointments = (req, res) => {

  const sql = `SELECT * FROM appointments ORDER BY appointment_date DESC`;

  db.query(sql, (err, results) => {

    if (err) {

      console.error("Error fetching appointments:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching appointments" });

    }

    res.status(200).json({ success: true, message: "Appointments retrieved successfully", data: results });

  });

};
 
// ✅ Get appointment by ID

export const getAppointmentById = (req, res) => {

  const { id } = req.params;

  const sql = `SELECT * FROM appointments WHERE appointment_id = ?`;

  db.query(sql, [id], (err, results) => {

    if (err) {

      console.error("Error fetching appointment by ID:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching appointment by ID" });

    }

    if (results.length === 0) {

      return res.status(404).json({ success: false, message: "Appointment not found" });

    }

    res.status(200).json({ success: true, message: "Appointment retrieved successfully", data: results[0] });

  });

};
 
// ✅ Get appointments by doctor ID

export const getAppointmentsByDoctor = (req, res) => {

  const { doctorId } = req.params;

  const sql = `SELECT * FROM appointments WHERE doctor_id = ? ORDER BY appointment_date DESC`;

  db.query(sql, [doctorId], (err, results) => {

    if (err) {

      console.error("Error fetching by doctor:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching appointments by doctor" });

    }

    res.status(200).json({ success: true, message: "Appointments by doctor retrieved successfully", data: results });

  });

};
 
// ✅ Get appointments by patient ID

export const getAppointmentsByPatient = (req, res) => {

  const { patientId } = req.params;

  const sql = `SELECT * FROM appointments WHERE patient_id = ? ORDER BY appointment_date DESC`;

  db.query(sql, [patientId], (err, results) => {

    if (err) {

      console.error("Error fetching by patient:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching appointments by patient" });

    }

    res.status(200).json({ success: true, message: "Appointments by patient retrieved successfully", data: results });

  });

};
 
// ✅ Get appointments by date

export const getAppointmentsByDate = (req, res) => {

  const { date } = req.params;

  const sql = `SELECT * FROM appointments WHERE DATE(appointment_date) = ? ORDER BY appointment_time ASC`;

  db.query(sql, [date], (err, results) => {

    if (err) {

      console.error("Error fetching by date:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching appointments by date" });

    }

    res.status(200).json({ success: true, message: "Appointments by date retrieved successfully", data: results });

  });

};
 
// ✅ Get appointments by status (pending, completed, cancelled)

export const getAppointmentsByStatus = (req, res) => {

  const { status } = req.params;

  const sql = `SELECT * FROM appointments WHERE status = ? ORDER BY appointment_date DESC`;

  db.query(sql, [status], (err, results) => {

    if (err) {

      console.error("Error fetching by status:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching appointments by status" });

    }

    res.status(200).json({ success: true, message: "Appointments by status retrieved successfully", data: results });

  });

};
 
// ✅ Get upcoming appointments (appointment_date >= TODAY)

export const getUpcomingAppointments = (req, res) => {

  const sql = `

    SELECT * FROM appointments

    WHERE appointment_date >= CURDATE() AND status = 'scheduled'

    ORDER BY appointment_date ASC

  `;

  db.query(sql, (err, results) => {

    if (err) {

      console.error("Error fetching upcoming appointments:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching upcoming appointments" });

    }

    res.status(200).json({ success: true, message: "Upcoming appointments retrieved successfully", data: results });

  });

};
 
// ✅ Get completed appointments

export const getCompletedAppointments = (req, res) => {

  const sql = `

    SELECT * FROM appointments

    WHERE status = 'completed'

    ORDER BY appointment_date DESC

  `;

  db.query(sql, (err, results) => {

    if (err) {

      console.error("Error fetching completed appointments:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching completed appointments" });

    }

    res.status(200).json({ success: true, message: "Completed appointments retrieved successfully", data: results });

  });

};
 
// ✅ Get cancelled appointments

export const getCancelledAppointments = (req, res) => {

  const sql = `

    SELECT * FROM appointments

    WHERE status = 'cancelled'

    ORDER BY appointment_date DESC

  `;

  db.query(sql, (err, results) => {

    if (err) {

      console.error("Error fetching cancelled appointments:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching cancelled appointments" });

    }

    res.status(200).json({ success: true, message: "Cancelled appointments retrieved successfully", data: results });

  });

};
 
// ✅ Get appointments by department (via doctor’s department)

export const getAppointmentsByDepartment = (req, res) => {

  const { deptId } = req.params;

  const sql = `

    SELECT a.*

    FROM appointments a

    JOIN doctors d ON a.doctor_id = d.doctor_id

    WHERE d.department_id = ?

    ORDER BY a.appointment_date DESC

  `;

  db.query(sql, [deptId], (err, results) => {

    if (err) {

      console.error("Error fetching by department:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching appointments by department" });

    }

    res.status(200).json({ success: true, message: "Appointments by department retrieved successfully", data: results });

  });

};

 