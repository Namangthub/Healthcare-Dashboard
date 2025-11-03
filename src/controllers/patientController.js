// src/controllers/patientController.js
import { maskPII, maskPatientId } from '../utils/privacyUtils.js';
import PatientModel from '../models/patientModel.js';
import db from '../config/db.js';

export const PatientController = {
  // ✅ Get all patients
  async getAllPatients(req, res) {
    try {
      const patients = await PatientModel.getAllPatients();
      res.json(patients);
    } catch (error) {
      console.error('Error fetching all patients:', error);
      res.status(500).json({ message: 'Failed to fetch patients' });
    }
  },

  // ✅ Get secure patients (with PII masked)
  async getSecurePatients(req, res) {
    try {
      const patients = await PatientModel.getAllSecurePatients();

      console.log('Raw database patient result:', patients[0] ? {
        id: patients[0].id,
        full_name: patients[0].full_name,
        department_name: patients[0].department_name,
        doctor_name: patients[0].doctor_name
      } : 'No patients');

      const securePatients = patients.map(patient => {
        const formatDate = (dateStr) => {
          if (!dateStr) return null;
          try {
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
          } catch {
            return null;
          }
        };

        return {
          id: patient.id,
          fullName: patient.full_name ? maskPII(patient.full_name) : 'Unknown',
          age: patient.age,
          gender: patient.gender,
          department: patient.department_name || 'Unassigned',
          doctor: maskPII(patient.doctor_name) || 'Unassigned',
          status: patient.status,
          severity: patient.severity,
          admissionDate: formatDate(patient.admission_date),
          lastVisit: formatDate(patient.last_visit),
          nextAppointment: formatDate(patient.next_appointment),
          room: patient.room || '',
          diagnosis: patient.diagnosis || '',
          vitals: patient.vitals || null,
          allergies: patient.allergies ? patient.allergies.length : 0,
          medications: patient.medications ? patient.medications.length : 0
        };
      });

      console.log('Transformed patient result:', securePatients[0] ? {
        id: securePatients[0].id,
        fullName: securePatients[0].fullName,
        department: securePatients[0].department,
        doctor: securePatients[0].doctor
      } : 'No patients');

      res.json(securePatients);
    } catch (error) {
      console.error('Error fetching secure patients:', error);
      res.status(500).json({ message: 'Failed to fetch patients' });
    }
  },

  // ✅ Get patient by ID
  async getPatientById(req, res) {
    try {
      const { id } = req.params;
      const patient = await PatientModel.getPatientById(id);

      if (!patient) {
        return res.status(404).json({ message: `Patient with id ${id} not found` });
      }

      const formattedPatient = {
        id: patient.id,
        firstName: patient.firstName || patient.first_name,
        lastName: patient.lastName || patient.last_name,
        fullName: patient.fullName || patient.full_name,
        age: patient.age,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth || patient.date_of_birth,
        phone: patient.phone,
        email: patient.email,
        address: patient.address,
        insurance: patient.insurance,
        emergencyContact: patient.emergencyContact || patient.emergency_contact,
        department: patient.department || patient.department_name,
        doctor: patient.doctor || patient.doctor_name,
        admissionDate: patient.admissionDate || patient.admission_date,
        status: patient.status,
        severity: patient.severity,
        room: patient.room,
        diagnosis: patient.diagnosis,
        lastVisit: patient.lastVisit || patient.last_visit,
        nextAppointment: patient.nextAppointment || patient.next_appointment,
        vitals: patient.vitals || {
          bloodPressure: '120/80',
          heartRate: 75,
          temperature: 98.6,
          oxygenSaturation: 98
        },
        medications: patient.medications || [],
        allergies: patient.allergies || [],
        notes: patient.notes
      };

      res.json(formattedPatient);
    } catch (error) {
      console.error(`Error fetching patient ${req.params.id}:`, error);
      res.status(500).json({
        message: 'Failed to fetch patient',
        error: error.message
      });
    }
  },

  // ✅ Get secure patient by ID
  async getSecurePatientById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Looking up patient with ID: ${id}`);

      const patient = await PatientModel.getSecurePatientById(id);
      if (!patient) {
        return res.status(404).json({ message: `Patient with id ${id} not found` });
      }

      const securePatient = {
        id: patient.id,
        fullName: maskPII(patient.full_name),
        age: patient.age,
        gender: patient.gender,
        department: patient.department_name || 'Unassigned',
        doctor: maskPII(patient.doctor_name) || 'Unassigned',
        status: patient.status,
        severity: patient.severity,
        admissionDate: patient.admission_date || patient.admissiondate,
        lastVisit: patient.last_visit || patient.lastvisit,
        nextAppointment: patient.next_appointment || patient.nextappointment || 'TBD',
        room: patient.room || '---',
        diagnosis: patient.diagnosis || 'Unknown',
        vitals: patient.vitals || {},
        allergies: patient.allergies || [],
        medications: patient.medications || []
      };

      console.log(`Fetched secure patient ${id}:`, {
        id: securePatient.id,
        fullName: securePatient.fullName,
        department: securePatient.department,
        allergies: securePatient.allergies.length,
        medications: securePatient.medications.length
      });

      res.json(securePatient);
    } catch (error) {
      console.error(`Error fetching secure patient ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch patient' });
    }
  },

  // ✅ Get patients by department
  async getPatientsByDepartment(req, res) {
    try {
      const { departmentId } = req.params;
      const patients = await PatientModel.getPatientsByDepartment(departmentId);
      res.json(patients);
    } catch (error) {
      console.error(`Error fetching patients for department ${req.params.departmentId}:`, error);
      res.status(500).json({ message: 'Failed to fetch patients by department' });
    }
  },

  // ✅ Get patient demographics
  async getDemographics(req, res) {
    try {
      const demographics = {
        byAge: [
          { ageGroup: '0-17', label: '0-17', count: 120, percentage: 12, color: '#4285F4' },
          { ageGroup: '18-34', label: '18-34', count: 210, percentage: 21, color: '#34A853' },
          { ageGroup: '35-50', label: '35-50', count: 335, percentage: 33.5, color: '#FBBC05' },
          { ageGroup: '51-65', label: '51-65', count: 180, percentage: 18, color: '#EA4335' },
          { ageGroup: '65+', label: '65+', count: 155, percentage: 15.5, color: '#FF6D01' }
        ],
        byGender: [
          { gender: 'Male', count: 480, percentage: 48, color: '#4285F4' },
          { gender: 'Female', count: 515, percentage: 51.5, color: '#34A853' },
          { gender: 'Other', count: 5, percentage: 0.5, color: '#FBBC05' }
        ],
        byInsurance: [
          { type: 'Private', count: 450, percentage: 45, color: '#4285F4' },
          { type: 'Medicare', count: 280, percentage: 28, color: '#34A853' },
          { type: 'Medicaid', count: 180, percentage: 18, color: '#FBBC05' },
          { type: 'Uninsured', count: 90, percentage: 9, color: '#EA4335' }
        ]
      };

      res.json(demographics);
    } catch (error) {
      console.error('Error fetching patient demographics:', error);
      res.status(500).json({ message: 'Failed to fetch demographics' });
    }
  },

  // ✅ Get patient timeline
  async getPatientTimeline(req, res) {
    try {
      const { id } = req.params;
      console.log(`Fetching timeline for patient ${id}`);

      let timelineEvents = [];

      try {
        // Example placeholder: replace with actual DB call later
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        timelineEvents = [
          {
            id: `${id}-timeline-1`,
            date: yesterday.toISOString().split('T')[0],
            type: 'visit',
            title: 'Doctor Visit',
            description: 'Regular check-up with Dr. Smith'
          },
          {
            id: `${id}-timeline-2`,
            date: lastWeek.toISOString().split('T')[0],
            type: 'test',
            title: 'Blood Test',
            description: 'Routine blood work completed'
          },
          {
            id: `${id}-timeline-3`,
            date: '2024-06-01',
            type: 'admission',
            title: 'Hospital Admission',
            description: 'Admitted for observation'
          }
        ];
      } catch (dbError) {
        console.error(`Database error fetching timeline for patient ${id}:`, dbError);
      }

      console.log(`Returning ${timelineEvents.length} timeline events for patient ${id}`);
      res.json(timelineEvents);
    } catch (error) {
      console.error(`Error fetching timeline for patient ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch patient timeline' });
    }
  },

  // ✅ Redirect to vitals controller
  async getPatientVitals(req, res) {
    try {
      const { id } = req.params;
      res.redirect(302, `/api/vitals/patient/${id}`);
    } catch (error) {
      console.error(`Error redirecting vitals request for patient ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch patient vitals' });
    }
  }
};

export default PatientController;
