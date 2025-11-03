import StaffModel from '../models/staffModel.js';
import { maskPII, maskEmail, maskPhoneNumber } from '../utils/privacyUtils.js';

const StaffController = {
  // Get all staff
  async getAllStaff(req, res) {
    try {
      const staff = await StaffModel.getAllStaff();

      const secureStaff = staff.map(member => ({
        id: member.id,
        fullName: maskPII(member.full_name),
        role: member.role,
        department: member.department_name,
        status: member.status,
        shift: member.shift,
        specialty: member.specialty,
        experience: Number(member.experience),
        patients: Number(member.patients || member.patient_count || 0),
        rating: Number(member.rating)
      }));

      res.json(secureStaff);
    } catch (error) {
      console.error('❌ Error fetching staff:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get staff by ID
  async getStaffById(req, res) {
    try {
      const { id } = req.params;
      const staff = await StaffModel.getStaffById(id);

      if (!staff) {
        return res.status(404).json({ message: `Staff member with ID ${id} not found` });
      }

      const secureStaff = {
        id: staff.id,
        fullName: maskPII(staff.full_name),
        role: staff.role,
        department: staff.department_name,
        status: staff.status,
        shift: staff.shift || 'Day Shift',
        specialty: staff.specialty || 'General',
        experience: Number(staff.experience || 0),
        patients: Number(staff.patients || staff.patient_count || 0),
        rating: Number(staff.rating || 4.0)
      };

      res.json(secureStaff);
    } catch (error) {
      console.error('❌ Error fetching staff member:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get staff by department
  async getStaffByDepartmentId(req, res) {
    try {
      const { departmentId } = req.params;
      const staff = await StaffModel.getStaffByDepartmentId(departmentId);

      const secureStaff = staff.map(member => ({
        id: member.id,
        fullName: maskPII(member.full_name),
        role: member.role,
        department: member.department_name,
        status: member.status,
        shift: member.shift,
        specialty: member.specialty,
        experience: Number(member.experience || 0),
        patients: Number(member.patient_count || 0),
        rating: Number(member.rating || 0)
      }));

      res.json(secureStaff);
    } catch (error) {
      console.error('❌ Error fetching staff by department:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update staff status
  async updateStaffStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updatedStaff = await StaffModel.updateStaffStatus(id, status);

      if (!updatedStaff) {
        return res.status(404).json({ error: `Staff member with ID ${id} not found` });
      }

      res.json({ success: true, message: `Staff ${id} status updated to ${status}` });
    } catch (error) {
      console.error('❌ Error updating staff status:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get patients by staff
  async getPatientsByStaffId(req, res) {
    try {
      const { id } = req.params;
      const patients = await StaffModel.getPatientsByStaffId(id);

      const securePatients = patients.map(patient => ({
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
    } catch (error) {
      console.error('❌ Error fetching patients by staff:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get staff count by role
  async getStaffCountByRole(req, res) {
    try {
      const counts = await StaffModel.getStaffCountByRole();
      res.json(counts);
    } catch (error) {
      console.error('❌ Error fetching staff count by role:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get staff count by department
  async getStaffCountByDepartment(req, res) {
    try {
      const counts = await StaffModel.getStaffCountByDepartment();
      res.json(counts);
    } catch (error) {
      console.error('❌ Error fetching staff count by department:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default StaffController;
