// ✅ src/controllers/patientController.js
import { maskPII } from '../utils/privacyUtils.js';
import PatientModel from '../models/patientModel.js';

const PatientController = {
  // ✅ Get all patients (unmasked, for internal use)
  async getAllPatients(req, res) {
    try {
      const patients = await PatientModel.getAllPatients();

      // Format & clean patient data
      const formattedPatients = patients.map((p) => ({
        id: p.id,
        fullName: p.full_name || 'Unknown',
        age: p.age,
        gender: p.gender,
        department: p.department_name || 'Unassigned',
        doctor: p.doctor_name || 'Unassigned',
        status: p.status,
        severity: p.severity,
        admissionDate: p.admission_date ? new Date(p.admission_date).toISOString().split('T')[0] : null,
        lastVisit: p.last_visit ? new Date(p.last_visit).toISOString().split('T')[0] : null,
        nextAppointment: p.next_appointment ? new Date(p.next_appointment).toISOString().split('T')[0] : null,
        room: p.room || '',
        diagnosis: p.diagnosis || '',
        vitals: typeof p.vitals === 'string' ? JSON.parse(p.vitals) : p.vitals || null,
        allergies: Array.isArray(p.allergies) ? p.allergies.length : 0,
        medications: Array.isArray(p.medications) ? p.medications.length : 0
      }));

      res.json(formattedPatients);
    } catch (error) {
      console.error('❌ Error fetching all patients:', error);
      res.status(500).json({ message: 'Failed to fetch patients' });
    }
  },

  // ✅ Get secure patients (masked PII for dashboard)
 async getSecurePatients(req, res) {
  try {
    const patients = await PatientModel.getAllSecurePatients();
    const isSecure = req.query.secure === 'true'; // Add query toggle

    const securePatients = patients.map((patient) => {
      const formatDate = (dateStr) =>
        dateStr ? new Date(dateStr).toISOString().split('T')[0] : null;

      let vitalsData = null;
      try {
        vitalsData =
          typeof patient.vitals === 'string'
            ? JSON.parse(patient.vitals)
            : patient.vitals || null;
      } catch {
        vitalsData = null;
      }

      return {
        id: patient.id,
        fullName: isSecure
          ? maskPII(patient.full_name)
          : patient.full_name || 'Unknown',
        age: patient.age,
        gender: patient.gender,
        department: patient.department_name || 'Unassigned',
        doctor: isSecure
          ? maskPII(patient.doctor_name)
          : patient.doctor_name || 'Unassigned',
        status: patient.status,
        severity: patient.severity,
        admissionDate: formatDate(patient.admission_date),
        lastVisit: formatDate(patient.last_visit),
        nextAppointment: formatDate(patient.next_appointment),
        room: patient.room || '',
        diagnosis: patient.diagnosis || '',
        vitals: vitalsData,
        allergies: Array.isArray(patient.allergies)
          ? patient.allergies.length
          : 0,
        medications: Array.isArray(patient.medications)
          ? patient.medications.length
          : 0
      };
    });

    res.json(securePatients);
  } catch (error) {
    console.error('❌ Error fetching secure patients:', error);
    res.status(500).json({ message: 'Failed to fetch secure patients' });
  }
},

  // ✅ Get patient by ID (unmasked)
  async getPatientById(req, res) {
    try {
      const { id } = req.params;
      const patient = await PatientModel.getPatientById(id);

      if (!patient) {
        return res
          .status(404)
          .json({ message: `Patient with id ${id} not found` });
      }

      // Handle vitals safely
      let vitalsData = null;
      try {
        vitalsData =
          typeof patient.vitals === 'string'
            ? JSON.parse(patient.vitals)
            : patient.vitals || null;
      } catch {
        vitalsData = {
          bloodPressure: '120/80',
          heartRate: 75,
          temperature: 98.6,
          oxygenSaturation: 98
        };
      }

      const formattedPatient = {
        id: patient.id,
        firstName: patient.first_name || '',
        lastName: patient.last_name || '',
        fullName: patient.full_name || 'Unknown',
        age: patient.age,
        gender: patient.gender,
        dateOfBirth: patient.date_of_birth || null,
        phone: patient.phone,
        email: patient.email,
        address: patient.address,
        insurance: patient.insurance,
        emergencyContact: patient.emergency_contact,
        department: patient.department_name || 'Unassigned',
        doctor: patient.doctor_name || 'Unassigned',
        admissionDate: patient.admission_date,
        status: patient.status,
        severity: patient.severity,
        room: patient.room,
        diagnosis: patient.diagnosis,
        lastVisit: patient.last_visit,
        nextAppointment: patient.next_appointment,
        vitals: vitalsData,
        medications:
          typeof patient.medications === 'string'
            ? JSON.parse(patient.medications)
            : patient.medications || [],
        allergies:
          typeof patient.allergies === 'string'
            ? JSON.parse(patient.allergies)
            : patient.allergies || [],
        notes: patient.notes
      };

      res.json(formattedPatient);
    } catch (error) {
      console.error(`❌ Error fetching patient ${req.params.id}:`, error);
      res.status(500).json({
        message: 'Failed to fetch patient',
        error: error.message
      });
    }
  },

  // ✅ Get secure (masked) patient by ID
  async getSecurePatientById(req, res) {
    try {
      const { id } = req.params;
      const patient = await PatientModel.getSecurePatientById(id);

      if (!patient) {
        return res
          .status(404)
          .json({ message: `Patient with id ${id} not found` });
      }

      // Safe vitals parsing
      let vitalsData = null;
      try {
        vitalsData =
          typeof patient.vitals === 'string'
            ? JSON.parse(patient.vitals)
            : patient.vitals || {};
      } catch {
        vitalsData = {};
      }

      const securePatient = {
        id: patient.id,
        fullName: maskPII(patient.full_name),
        age: patient.age,
        gender: patient.gender,
        department: patient.department_name || 'Unassigned',
        doctor: patient.doctor_name
          ? maskPII(patient.doctor_name)
          : 'Unassigned',
        status: patient.status,
        severity: patient.severity,
        admissionDate: patient.admission_date,
        lastVisit: patient.last_visit,
        nextAppointment: patient.next_appointment || 'TBD',
        room: patient.room || '---',
        diagnosis: patient.diagnosis || 'Unknown',
        vitals: vitalsData,
        allergies: patient.allergies || [],
        medications: patient.medications || []
      };

      res.json(securePatient);
    } catch (error) {
      console.error(`❌ Error fetching secure patient ${req.params.id}:`, error);
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
      console.error(
        `❌ Error fetching patients for department ${req.params.departmentId}:`,
        error
      );
      res.status(500).json({ message: 'Failed to fetch patients by department' });
    }
  },

  // ✅ Get demographics summary
  async getDemographics(req, res) {
    try {
      const demographics = {
        byAge: [
          { ageGroup: '0-17', count: 120 },
          { ageGroup: '18-34', count: 210 },
          { ageGroup: '35-50', count: 335 },
          { ageGroup: '51-65', count: 180 },
          { ageGroup: '65+', count: 155 }
        ],
        byGender: [
          { gender: 'Male', count: 480 },
          { gender: 'Female', count: 515 },
          { gender: 'Other', count: 5 }
        ]
      };
      res.json(demographics);
    } catch (error) {
      console.error('❌ Error fetching demographics:', error);
      res.status(500).json({ message: 'Failed to fetch demographics' });
    }
  },

  // ✅ Get patient timeline (mock)
  async getPatientTimeline(req, res) {
    try {
      const { id } = req.params;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);

      const timelineEvents = [
        {
          id: `${id}-1`,
          date: yesterday.toISOString().split('T')[0],
          type: 'visit',
          title: 'Doctor Visit',
          description: 'Routine check-up'
        },
        {
          id: `${id}-2`,
          date: lastWeek.toISOString().split('T')[0],
          type: 'test',
          title: 'Blood Test',
          description: 'Routine lab test'
        }
      ];

      res.json(timelineEvents);
    } catch (error) {
      console.error(`❌ Error fetching timeline for patient ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch timeline' });
    }
  },

  // ✅ Redirect vitals request
  async getPatientVitals(req, res) {
    try {
      const { id } = req.params;
      res.redirect(302, `/api/vitals/patient/${id}`);
    } catch (error) {
      console.error(`❌ Error redirecting vitals request for patient ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch patient vitals' });
    }
  }
};

export default PatientController;
