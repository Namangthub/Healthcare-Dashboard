import db from "../config/db.js";
 
// ✅ Get all patients

export const getAllPatients = (req, res, next) => {

  const sql = "SELECT * FROM patients";

  db.query(sql, (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get patient by ID

export const getPatientById = (req, res, next) => {

  const { id } = req.params;

  const sql = "SELECT * FROM patients WHERE patient_id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) return next(err);

    if (result.length === 0)

      return res.status(404).json({ success: false, message: "Patient not found" });

    res.json({ success: true, data: result[0] });

  });

};
 
// ✅ Get patients by gender

export const getPatientsByGender = (req, res, next) => {

  const { gender } = req.params;

  const sql = "SELECT * FROM patients WHERE gender = ?";

  db.query(sql, [gender], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get patients admitted on a specific date

export const getPatientsByAdmissionDate = (req, res, next) => {

  const { date } = req.params;

  const sql = "SELECT * FROM patients WHERE admission_date = ?";

  db.query(sql, [date], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get discharged patients

export const getDischargedPatients = (req, res, next) => {

  const sql = "SELECT * FROM patients WHERE discharge_date IS NOT NULL";

  db.query(sql, (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get patients by doctor assigned

export const getPatientsByDoctor = (req, res, next) => {

  const { doctorId } = req.params;

  const sql = "SELECT * FROM patients WHERE assigned_doctor_id = ?";

  db.query(sql, [doctorId], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};

 