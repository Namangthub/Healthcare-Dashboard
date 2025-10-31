import db from "../config/db.js";
 
// ✅ Get all staff

export const getAllStaff = (req, res, next) => {

  const sql = "SELECT * FROM staff";

  db.query(sql, (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get staff by ID

export const getStaffById = (req, res, next) => {

  const { id } = req.params;

  const sql = "SELECT * FROM staff WHERE staff_id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) return next(err);

    if (result.length === 0)

      return res.status(404).json({ success: false, message: "Staff not found" });

    res.json({ success: true, data: result[0] });

  });

};
 
// ✅ Get on-duty staff

export const getOnDutyStaff = (req, res, next) => {

  const sql = "SELECT * FROM staff WHERE is_on_duty = 1";

  db.query(sql, (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get available staff (not on leave)

export const getAvailableStaff = (req, res, next) => {

  const sql = "SELECT * FROM staff WHERE is_available = 1";

  db.query(sql, (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get staff by department

export const getStaffByDepartment = (req, res, next) => {

  const { deptId } = req.params;

  const sql = "SELECT * FROM staff WHERE department_id = ?";

  db.query(sql, [deptId], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get staff by role

export const getStaffByRole = (req, res, next) => {

  const { role } = req.params;

  const sql = "SELECT * FROM staff WHERE role = ?";

  db.query(sql, [role], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get staff by shift (morning/evening/night)

export const getStaffByShift = (req, res, next) => {

  const { shift } = req.params;

  const sql = "SELECT * FROM staff WHERE shift = ?";

  db.query(sql, [shift], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};

 