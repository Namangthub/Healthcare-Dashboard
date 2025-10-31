import db from "../config/db.js";
 
// ✅ 1. Get all medical records

export const getAllMedicalRecords = (req, res) => {

  const sql = `

    SELECT record_id, patient_id, appointment_id, diagnosis, treatment, record_date, note

    FROM medicalrecords

    ORDER BY record_date DESC

  `;

  db.query(sql, (err, results) => {

    if (err) {

      console.error("Error fetching medical records:", err);

      return res.status(500).json({

        success: false,

        message: "Database error while fetching medical records",

      });

    }

    res.status(200).json({

      success: true,

      message: "All medical records retrieved successfully",

      data: results,

    });

  });

};
 
// ✅ 2. Get medical record by ID

export const getMedicalRecordById = (req, res) => {

  const { id } = req.params;

  const sql = `

    SELECT record_id, patient_id, appointment_id, diagnosis, treatment, record_date, note

    FROM medicalrecords WHERE record_id = ?

  `;

  db.query(sql, [id], (err, results) => {

    if (err) {

      console.error("Error fetching medical record by ID:", err);

      return res.status(500).json({

        success: false,

        message: "Database error while fetching medical record",

      });

    }

    if (results.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Medical record not found",

      });

    }

    res.status(200).json({

      success: true,

      message: "Medical record retrieved successfully",

      data: results[0],

    });

  });

};
 
// ✅ 3. Get medical records by Patient ID

export const getMedicalRecordsByPatientId = (req, res) => {

  const { patientId } = req.params;

  const sql = `

    SELECT * FROM medicalrecords WHERE patient_id = ? ORDER BY record_date DESC

  `;

  db.query(sql, [patientId], (err, results) => {

    if (err) {

      console.error("Error fetching records by patient ID:", err);

      return res.status(500).json({ success: false, message: "Database error" });

    }

    res.status(200).json({

      success: true,

      message: "Medical records by patient retrieved successfully",

      data: results,

    });

  });

};
 
// ✅ 4. Get medical records by Appointment ID

export const getMedicalRecordsByAppointmentId = (req, res) => {

  const { appointmentId } = req.params;

  const sql = `

    SELECT * FROM medicalrecords WHERE appointment_id = ?

  `;

  db.query(sql, [appointmentId], (err, results) => {

    if (err) {

      console.error("Error fetching records by appointment ID:", err);

      return res.status(500).json({ success: false, message: "Database error" });

    }

    res.status(200).json({

      success: true,

      message: "Medical records by appointment retrieved successfully",

      data: results,

    });

  });

};
 
// ✅ 5. Get medical records by Doctor ID

export const getMedicalRecordsByDoctorId = (req, res) => {

  const { doctorId } = req.params;

  const sql = `

    SELECT mr.* FROM medicalrecords mr

    JOIN appointments a ON mr.appointment_id = a.appointment_id

    WHERE a.doctor_id = ?

  `;

  db.query(sql, [doctorId], (err, results) => {

    if (err) {

      console.error("Error fetching records by doctor ID:", err);

      return res.status(500).json({ success: false, message: "Database error" });

    }

    res.status(200).json({

      success: true,

      message: "Medical records by doctor retrieved successfully",

      data: results,

    });

  });

};
 
// ✅ 6. Get medical records by Diagnosis

export const getMedicalRecordsByDiagnosis = (req, res) => {

  const { diagnosis } = req.params;

  const sql = `

    SELECT * FROM medicalrecords WHERE diagnosis LIKE ?

  `;

  db.query(sql, [`%${diagnosis}%`], (err, results) => {

    if (err) {

      console.error("Error fetching records by diagnosis:", err);

      return res.status(500).json({ success: false, message: "Database error" });

    }

    res.status(200).json({

      success: true,

      message: "Medical records by diagnosis retrieved successfully",

      data: results,

    });

  });

};
 
// ✅ 7. Get medical records between date range

export const getMedicalRecordsByDateRange = (req, res) => {

  const { start, end } = req.query;

  if (!start || !end) {

    return res.status(400).json({

      success: false,

      message: "Please provide both start and end dates (YYYY-MM-DD)",

    });

  }
 
  const sql = `

    SELECT * FROM medicalrecords

    WHERE record_date BETWEEN ? AND ?

    ORDER BY record_date DESC

  `;

  db.query(sql, [start, end], (err, results) => {

    if (err) {

      console.error("Error fetching records by date range:", err);

      return res.status(500).json({ success: false, message: "Database error" });

    }

    res.status(200).json({

      success: true,

      message: "Medical records by date range retrieved successfully",

      data: results,

    });

  });

};

 