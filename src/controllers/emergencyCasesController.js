import db from "../config/db.js";
 
// ✅ Get all emergency cases

export const getAllEmergencyCases = (req, res) => {

  const sql = `

    SELECT case_id, patient_id, doctor_id, date, severity_level, status

    FROM emergency_cases

    ORDER BY date DESC

  `;
 
  db.query(sql, (err, results) => {

    if (err) {

      console.error("Error fetching emergency cases:", err);

      return res.status(500).json({

        success: false,

        message: "Database error while fetching emergency cases",

      });

    }
 
    res.status(200).json({

      success: true,

      message: "Emergency cases retrieved successfully",

      data: results,

    });

  });

};
 
// ✅ Get emergency case by ID

export const getEmergencyCaseById = (req, res) => {

  const { id } = req.params;
 
  const sql = `

    SELECT case_id, patient_id, doctor_id, date, severity_level, status

    FROM emergency_cases

    WHERE case_id = ?

  `;
 
  db.query(sql, [id], (err, results) => {

    if (err) {

      console.error("Error fetching emergency case by ID:", err);

      return res.status(500).json({

        success: false,

        message: "Database error while fetching emergency case by ID",

      });

    }
 
    if (results.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Emergency case not found",

      });

    }
 
    res.status(200).json({

      success: true,

      message: "Emergency case retrieved successfully",

      data: results[0],

    });

  });

};
 
// ✅ Get emergency cases by severity level

export const getEmergencyCasesBySeverity = (req, res) => {

  const { level } = req.params;
 
  const sql = `

    SELECT case_id, patient_id, doctor_id, date, severity_level, status

    FROM emergency_cases

    WHERE severity_level = ?

    ORDER BY date DESC

  `;
 
  db.query(sql, [level], (err, results) => {

    if (err) {

      console.error("Error fetching emergency cases by severity:", err);

      return res.status(500).json({

        success: false,

        message: "Database error while fetching by severity",

      });

    }
 
    res.status(200).json({

      success: true,

      message: "Emergency cases by severity retrieved successfully",

      data: results,

    });

  });

};
 
// ✅ Get emergency cases by status (open, resolved, etc.)

export const getEmergencyCasesByStatus = (req, res) => {

  const { status } = req.params;
 
  const sql = `

    SELECT case_id, patient_id, doctor_id, date, severity_level, status

    FROM emergency_cases

    WHERE status = ?

    ORDER BY date DESC

  `;
 
  db.query(sql, [status], (err, results) => {

    if (err) {

      console.error("Error fetching emergency cases by status:", err);

      return res.status(500).json({

        success: false,

        message: "Database error while fetching by status",

      });

    }
 
    res.status(200).json({

      success: true,

      message: "Emergency cases by status retrieved successfully",

      data: results,

    });

  });

};
 
// ✅ Get emergency cases by Doctor ID

export const getEmergencyCasesByDoctor = (req, res) => {

  const { doctorId } = req.params;
 
  const sql = `

    SELECT case_id, patient_id, doctor_id, date, severity_level, status

    FROM emergency_cases

    WHERE doctor_id = ?

    ORDER BY date DESC

  `;
 
  db.query(sql, [doctorId], (err, results) => {

    if (err) {

      console.error("Error fetching emergency cases by doctor:", err);

      return res.status(500).json({

        success: false,

        message: "Database error while fetching by doctor",

      });

    }
 
    res.status(200).json({

      success: true,

      message: "Emergency cases by doctor retrieved successfully",

      data: results,

    });

  });

};
 
// ✅ Get emergency cases by Date

export const getEmergencyCasesByDate = (req, res) => {

  const { date } = req.params;
 
  const sql = `

    SELECT case_id, patient_id, doctor_id, date, severity_level, status

    FROM emergency_cases

    WHERE DATE(date) = ?

    ORDER BY TIME(date) DESC

  `;
 
  db.query(sql, [date], (err, results) => {

    if (err) {

      console.error("Error fetching emergency cases by date:", err);

      return res.status(500).json({

        success: false,

        message: "Database error while fetching by date",

      });

    }
 
    res.status(200).json({

      success: true,

      message: "Emergency cases by date retrieved successfully",

      data: results,

    });

  });

};

 