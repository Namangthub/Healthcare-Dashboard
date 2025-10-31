import db from "../config/db.js";
 
// ✅ Get all lab tests

export const getAllLabTests = (req, res) => {

  const sql = `

    SELECT test_id, patient_id, appointment_id, test_type, test_date, result, status

    FROM labtests

    ORDER BY test_date DESC

  `;
 
  db.query(sql, (err, results) => {

    if (err) {

      console.error("Error fetching lab tests:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching lab tests" });

    }

    res.status(200).json({ success: true, message: "Lab tests retrieved successfully", data: results });

  });

};
 
// ✅ Get lab test by ID

export const getLabTestById = (req, res) => {

  const { id } = req.params;
 
  const sql = `

    SELECT test_id, patient_id, appointment_id, test_type, test_date, result, status

    FROM labtests WHERE test_id = ?

  `;
 
  db.query(sql, [id], (err, results) => {

    if (err) {

      console.error("Error fetching lab test by ID:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching lab test" });

    }
 
    if (results.length === 0)

      return res.status(404).json({ success: false, message: "Lab test not found" });
 
    res.status(200).json({ success: true, message: "Lab test retrieved successfully", data: results[0] });

  });

};
 
// ✅ Get lab tests by Patient ID

export const getLabTestsByPatientId = (req, res) => {

  const { patientId } = req.params;
 
  const sql = `

    SELECT test_id, test_type, test_date, result, status

    FROM labtests WHERE patient_id = ?

    ORDER BY test_date DESC

  `;
 
  db.query(sql, [patientId], (err, results) => {

    if (err) {

      console.error("Error fetching lab tests by patient:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching patient lab tests" });

    }
 
    if (results.length === 0)

      return res.status(404).json({ success: false, message: "No lab tests found for this patient" });
 
    res.status(200).json({ success: true, message: "Patient lab tests retrieved successfully", data: results });

  });

};
 
// ✅ Get lab tests by Status (pending, completed, etc.)

export const getLabTestsByStatus = (req, res) => {

  const { status } = req.params;
 
  const sql = `

    SELECT test_id, patient_id, test_type, test_date, result, status

    FROM labtests WHERE status = ?

    ORDER BY test_date DESC

  `;
 
  db.query(sql, [status], (err, results) => {

    if (err) {

      console.error("Error fetching lab tests by status:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching lab tests by status" });

    }
 
    if (results.length === 0)

      return res.status(404).json({ success: false, message: `No ${status} lab tests found` });
 
    res.status(200).json({ success: true, message: `${status} lab tests retrieved successfully`, data: results });

  });

};
 
// ✅ Get recent lab tests (last 7 days)

export const getRecentLabTests = (req, res) => {

  const sql = `

    SELECT test_id, patient_id, test_type, test_date, result, status

    FROM labtests

    WHERE test_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)

    ORDER BY test_date DESC

  `;
 
  db.query(sql, (err, results) => {

    if (err) {

      console.error("Error fetching recent lab tests:", err);

      return res.status(500).json({ success: false, message: "Database error while fetching recent lab tests" });

    }
 
    res.status(200).json({ success: true, message: "Recent lab tests retrieved successfully", data: results });

  });

};

 