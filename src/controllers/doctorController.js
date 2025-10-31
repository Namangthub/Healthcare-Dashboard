import db from "../config/db.js"; // adjust the path if needed
 
// ✅ Get all doctors

export const getAllDoctors = (req, res) => {

  const sql = "SELECT * FROM Doctors";

  db.query(sql, (err, results) => {

    if (err) {

      console.error("❌ Error fetching doctors:", err);

      return res.status(500).json({ success: false, message: "Database error" });

    }

    res.status(200).json({ success: true, message: "All doctors fetched", data: results });

  });

};
 
// ✅ Get doctor by ID

export const getDoctorById = (req, res) => {

  const { id } = req.params;

  const sql = "SELECT * FROM Doctors WHERE doctor_id = ?";

  db.query(sql, [id], (err, results) => {

    if (err) return res.status(500).json({ success: false, message: err.message });

    if (results.length === 0)

      return res.status(404).json({ success: false, message: "Doctor not found" });

    res.status(200).json({ success: true, data: results[0] });

  });

};
 
// ✅ Get doctors by department

export const getDoctorsByDepartment = (req, res) => {

  const { department } = req.params;

  const sql = "SELECT * FROM Doctors WHERE specialization LIKE ?";

  db.query(sql, [`%${department}%`], (err, results) => {

    if (err) return res.status(500).json({ success: false, message: err.message });

    res.status(200).json({

      success: true,

      message: `Doctors in ${department} department`,

      data: results,

    });

  });

};
 
// ✅ Get doctors by name

export const getDoctorsByName = (req, res) => {

  const { name } = req.params;

  const sql = "SELECT * FROM Doctors WHERE first_name LIKE ?";

  db.query(sql, [`%${name}%`], (err, results) => {

    if (err) return res.status(500).json({ success: false, message: err.message });

    res.status(200).json({

      success: true,

      message: `Doctors matching name ${name}`,

      data: results,

    });

  });

};
 
// ✅ Get available doctors (you can adjust logic)

export const getAvailableDoctors = (req, res) => {

  const sql = "SELECT * FROM Doctors WHERE availability = 1"; // assuming 'available' column = 1 means available

  db.query(sql, (err, results) => {

    if (err) return res.status(500).json({ success: false, message: err.message });

    res.status(200).json({

      success: true,

      message: "List of available doctors",

      data: results,

    });

  });

};
 

 