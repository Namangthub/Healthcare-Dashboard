import db from "../config/db.js";
 
// ✅ Get all departments

export const getAllDepartments = (req, res, next) => {

  const sql = "SELECT * FROM departments ORDER BY dept_name ASC";

  db.query(sql, (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get department by ID

export const getDepartmentById = (req, res, next) => {

  const { id } = req.params;

  const sql = "SELECT * FROM departments WHERE department_id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) return next(err);

    if (!result.length) return res.status(404).json({ message: "Department not found" });

    res.json({ success: true, data: result[0] });

  });

};
 
// ✅ Get department by Name

export const getDepartmentByName = (req, res, next) => {

  const { name } = req.params;

  const sql = "SELECT * FROM departments WHERE dept_name LIKE ?";

  db.query(sql, [`%${name}%`], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get doctors in a department

export const getDoctorsInDepartment = (req, res, next) => {

  const { id } = req.params;

  const sql = `

    SELECT d.* FROM doctors d

    WHERE d.department_id = ?`;

  db.query(sql, [id], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get patients in a department (via doctor/appointment relation)

export const getPatientsInDepartment = (req, res, next) => {

  const { id } = req.params;

  const sql = `

    SELECT DISTINCT p.* 

    FROM patients p

    JOIN appointments a ON p.patient_id = a.patient_id

    WHERE a.department_id = ?`;

  db.query(sql, [id], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get appointments by department

export const getAppointmentsByDepartment = (req, res, next) => {

  const { id } = req.params;

  const sql = `

    SELECT a.* 

    FROM appointments a

    WHERE a.department_id = ?

    ORDER BY a.appointment_date DESC`;

  db.query(sql, [id], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get active departments (having doctors or appointments)

export const getActiveDepartments = (req, res, next) => {

  const sql = `

    SELECT d.*, COUNT(a.appointment_id) AS total_appointments

    FROM departments d

    LEFT JOIN appointments a ON d.department_id = a.department_id

    GROUP BY d.department_id

    HAVING total_appointments > 0`;

  db.query(sql, (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get department statistics (doctors, patients, appointments)

export const getDepartmentStats = (req, res, next) => {

  const { id } = req.params;

  const sql = `

    SELECT 

      d.dept_name,

      COUNT(DISTINCT doc.doctor_id) AS total_doctors,

      COUNT(DISTINCT p.patient_id) AS total_patients,

      COUNT(a.appointment_id) AS total_appointments

    FROM departments d

    LEFT JOIN doctors doc ON d.department_id = doc.department_id

    LEFT JOIN appointments a ON d.department_id = a.department_id

    LEFT JOIN patients p ON a.patient_id = p.patient_id

    WHERE d.department_id = ?`;

  db.query(sql, [id], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result[0] });

  });

};
 
// ✅ Get top departments by appointment count

export const getTopDepartmentsByAppointments = (req, res, next) => {

  const sql = `

    SELECT d.dept_name, COUNT(a.appointment_id) AS total_appointments

    FROM departments d

    LEFT JOIN appointments a ON d.department_id = a.department_id

    GROUP BY d.department_id

    ORDER BY total_appointments DESC

    LIMIT 5`;

  db.query(sql, (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result });

  });

};
 
// ✅ Get department head (HOD)

export const getDepartmentHead = (req, res, next) => {

  const { id } = req.params;

  const sql = `

    SELECT s.staff_id, s.full_name, s.position

    FROM staff s

    WHERE s.department_id = ? AND s.position LIKE '%Head%'`;

  db.query(sql, [id], (err, result) => {

    if (err) return next(err);

    if (!result.length)

      return res.json({ success: true, message: "No department head assigned yet" });

    res.json({ success: true, data: result[0] });

  });

};
 
// ✅ Get department capacity info (beds, staff count, etc.)

export const getDepartmentCapacity = (req, res, next) => {

  const { id } = req.params;

  const sql = `

    SELECT 

      d.dept_name,

      d.total_beds,

      COUNT(DISTINCT s.staff_id) AS total_staff,

      COUNT(DISTINCT p.patient_id) AS current_patients

    FROM departments d

    LEFT JOIN staff s ON d.department_id = s.department_id

    LEFT JOIN patients p ON d.department_id = p.department_id

    WHERE d.department_id = ?`;

  db.query(sql, [id], (err, result) => {

    if (err) return next(err);

    res.json({ success: true, data: result[0] });

  });

};

 