import { DepartmentModel } from '../models/departmentModel.js';
import db from '../config/db.js';
import {
  transformDepartment,
  transformQualityMetrics,
  transformFinancial
} from '../utils/transformData.js';
 
export const DepartmentController = {
  // Get all departments
  async getAllDepartments(req, res) {
    try {
      const departments = await DepartmentModel.getAllDepartments();
      const transformedDepartments = departments.map(dept => transformDepartment(dept));
      res.json(transformedDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).json({ message: 'Failed to fetch departments', error: error.message });
    }
  },
 
  // Get department by id
  async getDepartmentById(req, res) {
    try {
      const { id } = req.params;
      const department = await DepartmentModel.getDepartmentById(id);
      if (!department) return res.status(404).json({ message: `Department with id ${id} not found` });
      const transformedDepartment = transformDepartment(department);
      res.json(transformedDepartment);
    } catch (error) {
      console.error('Error fetching department:', error);
      res.status(500).json({ message: 'Failed to fetch department', error: error.message });
    }
  },
 
  // Get department staff
  async getDepartmentStaff(req, res) {
    try {
      const { id } = req.params;
      const department = await DepartmentModel.getDepartmentById(id);
      if (!department) return res.status(404).json({ message: `Department with id ${id} not found` });
 
      const query = `
        SELECT s.id, s.first_name, s.last_name, s.full_name, s.role,
               s.status, s.shift, s.specialty, s.experience, s.rating
        FROM staff s
        WHERE s.department_id = ?
        ORDER BY s.role, s.last_name;
      `;
 
      const [rows] = await db.query(query, [id]);
      const staff = rows.map(s => ({
        id: s.id,
        firstName: s.first_name,
        lastName: s.last_name,
        fullName: s.full_name,
        role: s.role,
        status: s.status,
        shift: s.shift,
        specialty: s.specialty,
        experience: Number(s.experience),
        patients: Number(s.patients || 0),
        rating: Number(s.rating || 0)
      }));
 
      res.json(staff);
    } catch (error) {
      console.error('Error fetching department staff:', error);
      res.status(500).json({ message: 'Failed to fetch department staff', error: error.message });
    }
  },
 
  // Get department patients
  async getDepartmentPatients(req, res) {
    try {
      const { id } = req.params;
      const department = await DepartmentModel.getDepartmentById(id);
      if (!department) return res.status(404).json({ message: `Department with id ${id} not found` });
 
      const query = `
        SELECT p.id, p.first_name, p.last_name, p.full_name,
               p.status, p.severity, p.diagnosis, p.room,
               p.admission_date, p.last_visit, p.next_appointment,
               s.full_name AS doctor_name
        FROM patients p
        LEFT JOIN staff s ON p.doctor_id = s.id
        WHERE p.department_id = ?
        ORDER BY p.last_name;
      `;
 
      const [rows] = await db.query(query, [id]);
      const patients = rows.map(p => ({
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        fullName: p.full_name,
        status: p.status,
        severity: p.severity,
        diagnosis: p.diagnosis,
        room: p.room,
        admissionDate: p.admission_date,
        lastVisit: p.last_visit,
        nextAppointment: p.next_appointment,
        doctor: p.doctor_name || 'Unassigned'
      }));
 
      res.json(patients);
    } catch (error) {
      console.error('Error fetching department patients:', error);
      res.status(500).json({ message: 'Failed to fetch department patients', error: error.message });
    }
  },

  // 🆕 Get department appointments
  async getDepartmentAppointments(req, res) {
    try {
      const { id } = req.params;
      const department = await DepartmentModel.getDepartmentById(id);
      if (!department) return res.status(404).json({ message: `Department with id ${id} not found` });

      const query = `
        SELECT 
          a.appointment_id, 
          a.date, 
          a.status,  
          p.full_name AS patient_name, 
          s.full_name AS doctor_name
        FROM appointments a
        LEFT JOIN patients p ON a.patient_id = p.id
        LEFT JOIN staff s ON a.staff_id = s.id
        WHERE a.department_id = ?
        ORDER BY a.date DESC;
      `;

      const [rows] = await db.query(query, [id]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching department appointments:', error);
      res.status(500).json({ message: 'Failed to fetch department appointments', error: error.message });
    }
  }
};
