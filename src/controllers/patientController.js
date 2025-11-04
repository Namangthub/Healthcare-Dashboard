import { maskPII } from '../utils/privacyUtils.js';
import PatientModel from '../models/patientModel.js';

const PatientController = {
  // ✅ Get all patients (includes discharged + active)
  async getAllPatients(req, res) {
    try {
      const patients = await PatientModel.getAllPatients();

      const formatted = patients.map((p) => ({
        id: p.id,
        fullName: p.full_name || 'Unknown',
        age: p.age,
        gender: p.gender,
        department: p.department_name || 'Unassigned',
        doctor: p.doctor_name || 'Unassigned',
        status: p.status,
        severity: p.severity,
        admissionDate: p.admission_date
          ? new Date(p.admission_date).toISOString().split('T')[0]
          : null,
        lastVisit: p.last_visit
          ? new Date(p.last_visit).toISOString().split('T')[0]
          : null,
        nextAppointment: p.next_appointment
          ? new Date(p.next_appointment).toISOString().split('T')[0]
          : null,
        room: p.room || '',
        diagnosis: p.diagnosis || '',
        vitals: typeof p.vitals === 'string' ? JSON.parse(p.vitals) : p.vitals || {},
      }));

      res.json(formatted);
    } catch (error) {
      console.error('❌ Error fetching all patients:', error);
      res.status(500).json({ message: 'Failed to fetch patients' });
    }
  },

  // ✅ Get only active patients (old default behavior)
  async getActivePatients(req, res) {
    try {
      const patients = await PatientModel.getActivePatients();

      const formatted = patients.map((p) => ({
        id: p.id,
        fullName: p.full_name || 'Unknown',
        age: p.age,
        gender: p.gender,
        department: p.department_name || 'Unassigned',
        doctor: p.doctor_name || 'Unassigned',
        status: p.status,
        severity: p.severity,
        admissionDate: p.admission_date
          ? new Date(p.admission_date).toISOString().split('T')[0]
          : null,
        lastVisit: p.last_visit
          ? new Date(p.last_visit).toISOString().split('T')[0]
          : null,
        nextAppointment: p.next_appointment
          ? new Date(p.next_appointment).toISOString().split('T')[0]
          : null,
        room: p.room || '',
        diagnosis: p.diagnosis || '',
        vitals: typeof p.vitals === 'string' ? JSON.parse(p.vitals) : p.vitals || {},
      }));

      res.json(formatted);
    } catch (error) {
      console.error('❌ Error fetching active patients:', error);
      res.status(500).json({ message: 'Failed to fetch active patients' });
    }
  },

  // ✅ Rest of existing controller unchanged
  async getPatientById(req, res) {
    try {
      const { id } = req.params;
      const patient = await PatientModel.getPatientById(id);
      if (!patient) return res.status(404).json({ message: `Patient ${id} not found` });
      res.json(patient);
    } catch (error) {
      console.error(`❌ Error fetching patient ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch patient' });
    }
  },

  async getSecurePatientById(req, res) {
    try {
      const { id } = req.params;
      const patient = await PatientModel.getSecurePatientById(id);
      if (!patient) return res.status(404).json({ message: `Patient ${id} not found` });
      res.json(patient);
    } catch (error) {
      console.error(`❌ Error fetching secure patient ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch secure patient' });
    }
  },

  async getPatientsByDepartment(req, res) {
    try {
      const { departmentId } = req.params;
      const patients = await PatientModel.getPatientsByDepartment(departmentId);
      res.json(patients);
    } catch (error) {
      console.error('❌ Error fetching by department:', error);
      res.status(500).json({ message: 'Failed to fetch department patients' });
    }
  },

  async getDemographics(req, res) {
    try {
      const demographics = await PatientModel.getDemographics();
      res.json(demographics);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch demographics' });
    }
  },

  async getPatientTimeline(req, res) {
    try {
      const timeline = await PatientModel.getPatientTimeline(req.params.id);
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch timeline' });
    }
  },

  async getPatientVitals(req, res) {
    try {
      const { id } = req.params;
      res.redirect(302, `/api/vitals/patient/${id}`);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch vitals' });
    }
  }
};

export default PatientController;
