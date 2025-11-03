const db = require('../config/db');
const { maskPII, maskEmail, maskPhoneNumber } = require('../utils/privacyUtils');

const StaffController = {
  // Get all staff members (with PII masked)
  getAllStaff: (req, res) => {
    const query = `
      SELECT 
        s.id, s.full_name, s.role, s.status, s.shift, s.specialty,
        s.experience, s.patient_count, s.rating, d.name AS department_name
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      ORDER BY s.id
    `;

    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching staff:', err);
        return res.status(500).json({ message: 'Failed to fetch staff', error: err.message });
      }

      const secureStaff = result.map(member => ({
        id: member.id,
        fullName: maskPII(member.full_name),
        role: member.role,
        department: member.department_name,
        status: member.status,
        shift: member.shift,
        specialty: member.specialty,
        experience: Number(member.experience),
        patients: Number(member.patient_count || 0),
        rating: Number(member.rating || 0)
      }));

      res.json(secureStaff);
    });
  },

  // Get a staff member by ID (with PII masked)
  getStaffById: (req, res) => {
    const { id } = req.params;

    const query = `
      SELECT 
        s.id, s.full_name, s.role, s.status, s.shift, s.specialty,
        s.experience, s.patient_count, s.rating, d.name AS department_name
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.id = ?
      LIMIT 1
    `;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error fetching staff by ID:', err);
        return res.status(500).json({ message: 'Failed to fetch staff', error: err.message });
      }

      if (!result.length) {
        return res.status(404).json({ message: `Staff member with ID ${id} not found` });
      }

      const staff = result[0];
      const secureStaff = {
        id: staff.id,
        fullName: maskPII(staff.full_name),
        role: staff.role,
        department: staff.department_name,
        status: staff.status,
        shift: staff.shift || 'Day Shift',
        specialty: staff.specialty || 'General',
        experience: Number(staff.experience || 0),
        patients: Number(staff.patient_count || 0),
        rating: Number(staff.rating || 4.0)
      };

      res.json(secureStaff);
    });
  },

  // Get staff by department ID (with PII masked)
  getStaffByDepartmentId: (req, res) => {
    const { departmentId } = req.params;

    const query = `
      SELECT 
        s.id, s.full_name, s.role, s.status, s.shift, s.specialty,
        s.experience, s.patient_count, s.rating, d.name AS department_name
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.department_id = ?
      ORDER BY s.id
    `;

    db.query(query, [departmentId], (err, result) => {
      if (err) {
        console.error('Error fetching staff by department:', err);
        return res.status(500).json({ message: 'Failed to fetch staff', error: err.message });
      }

      const secureStaff = result.map(member => ({
        id: member.id,
        fullName: maskPII(member.full_name),
        role: member.role,
        department: member.department_name,
        status: member.status,
        shift: member.shift,
        specialty: member.specialty,
        experience: Number(member.experience),
        patients: Number(member.patient_count),
        rating: Number(member.rating)
      }));

      res.json(secureStaff);
    });
  },

  // Update staff status
  updateStaffStatus: (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const query = `UPDATE staff SET status = ? WHERE id = ?`;

    db.query(query, [status, id], (err, result) => {
      if (err) {
        console.error('Error updating staff status:', err);
        return res.status(500).json({ message: 'Failed to update status', error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: `Staff member with ID ${id} not found` });
      }

      res.json({ success: true, message: `Staff ${id} status updated to ${status}` });
    });
  },

  // Get patients assigned to a staff member
  getPatientsByStaffId: (req, res) => {
    const { id } = req.params;

    const query = `
      SELECT 
        p.id, p.full_name, p.age, p.gender, p.status, p.severity,
        p.admission_date, p.room, p.diagnosis, d.name AS department_name
      FROM patients p
      LEFT JOIN departments d ON p.department_id = d.id
      WHERE p.doctor_id = ?
    `;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error fetching patients by staff:', err);
        return res.status(500).json({ message: 'Failed to fetch patients', error: err.message });
      }

      const securePatients = result.map(patient => ({
        id: patient.id,
        fullName: maskPII(patient.full_name),
        age: patient.age,
        gender: patient.gender,
        department: patient.department_name,
        status: patient.status,
        severity: patient.severity,
        admissionDate: patient.admission_date,
        room: patient.room,
        diagnosis: patient.diagnosis
      }));

      res.json(securePatients);
    });
  },

  // Get staff count by role
  getStaffCountByRole: (req, res) => {
    const query = `
      SELECT role, COUNT(*) AS count
      FROM staff
      GROUP BY role
      ORDER BY role
    `;

    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching staff count by role:', err);
        return res.status(500).json({ message: 'Failed to fetch count', error: err.message });
      }

      res.json(result);
    });
  },

  // Get staff count by department
  getStaffCountByDepartment: (req, res) => {
    const query = `
      SELECT d.name AS department, COUNT(s.id) AS count
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      GROUP BY d.name
      ORDER BY d.name
    `;

    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching staff count by department:', err);
        return res.status(500).json({ message: 'Failed to fetch count', error: err.message });
      }

      res.json(result);
    });
  }
};

module.exports = StaffController;
