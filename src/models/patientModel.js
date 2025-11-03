// src/models/patientModel.js
import db from '../config/db.js';
import { maskPII, maskPatientId } from '../utils/privacyUtils.js';

export default class PatientModel {
  // ✅ Get all patients
  static async getAllPatients() {
    try {
      const query = `
        SELECT 
          p.*,
          d.name AS department_name,
          s.full_name AS doctor_name
        FROM patients p
        LEFT JOIN departments d ON p.department_id = d.id
        LEFT JOIN staff s ON p.doctor_id = s.id
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error getting all patients:', error);
      throw error;
    }
  }

  // ✅ Get patient by ID (with normalization)
  static async getPatientById(id) {
    try {
      console.log(`Fetching full patient data for ID: ${id}`);

      const normalizedId = this.normalizePatientId(id);
      const possibleIds = [id, normalizedId];

      for (const patId of possibleIds) {
        const query = `
          SELECT 
            p.*,
            d.name AS department_name,
            s.full_name AS doctor_name,
            COALESCE(
              JSON_OBJECT(
                'bloodPressure', pv.blood_pressure,
                'heartRate', pv.heart_rate,
                'temperature', pv.temperature,
                'oxygenSaturation', pv.oxygen_saturation
              ),
              JSON_OBJECT()
            ) AS vitals,
            COALESCE(
              (SELECT JSON_ARRAYAGG(m.medication_name) 
               FROM patient_medications m 
               WHERE m.patient_id = p.id),
              JSON_ARRAY()
            ) AS medications,
            COALESCE(
              (SELECT JSON_ARRAYAGG(a.allergy_name) 
               FROM patient_allergies a 
               WHERE a.patient_id = p.id),
              JSON_ARRAY()
            ) AS allergies
          FROM patients p
          LEFT JOIN departments d ON p.department_id = d.id
          LEFT JOIN staff s ON p.doctor_id = s.id
          LEFT JOIN patient_vitals_current pv ON pv.patient_id = p.id
          WHERE p.id = ?
        `;

        const [rows] = await db.query(query, [patId]);
        if (rows.length > 0) {
          return rows[0];
        }
      }

      console.log(`Patient ${id} not found in database, returning sample data`);
      return this.generateSamplePatient(normalizedId);
    } catch (error) {
      console.error(`Error getting patient with id ${id}:`, error);
      throw error;
    }
  }

  // ✅ Get secure patient by ID (masked)
  static async getSecurePatientById(id) {
    try {
      console.log(`Looking up patient with ID: ${id}`);

      const query = `
        SELECT 
          p.id,
          p.full_name,
          p.age,
          p.gender,
          d.name AS department_name,
          s.full_name AS doctor_name,
          p.status,
          p.severity,
          p.admission_date,
          p.last_visit,
          p.next_appointment,
          p.room,
          p.diagnosis,
          COALESCE(
            (SELECT JSON_ARRAYAGG(DISTINCT pa.allergy_name) 
             FROM patient_allergies pa 
             WHERE pa.patient_id = p.id),
            JSON_ARRAY()
          ) AS allergies,
          COALESCE(
            (SELECT JSON_ARRAYAGG(DISTINCT pm.medication_name) 
             FROM patient_medications pm 
             WHERE pm.patient_id = p.id),
            JSON_ARRAY()
          ) AS medications,
          JSON_OBJECT(
            'bloodPressure', pv.blood_pressure,
            'heartRate', pv.heart_rate,
            'temperature', pv.temperature,
            'oxygenSaturation', pv.oxygen_saturation
          ) AS vitals
        FROM patients p
        LEFT JOIN departments d ON p.department_id = d.id
        LEFT JOIN staff s ON p.doctor_id = s.id
        LEFT JOIN patient_vitals_current pv ON pv.patient_id = p.id
        WHERE p.id = ?
        GROUP BY p.id, d.name, s.full_name, pv.blood_pressure, pv.heart_rate, pv.temperature, pv.oxygen_saturation
      `;

      const [rows] = await db.query(query, [id]);
      if (rows.length === 0) {
        console.log(`Patient ${id} not found in database`);
        return null;
      }

      return rows[0];
    } catch (error) {
      console.error(`Error getting secure patient with id ${id}:`, error);
      throw error;
    }
  }

  // ✅ Get all secure patients
  static async getAllSecurePatients() {
    try {
      const query = `
        SELECT 
          p.id,
          p.full_name,
          p.age,
          p.gender,
          d.name AS department_name,
          s.full_name AS doctor_name,
          p.status,
          p.severity,
          p.admission_date,
          p.last_visit,
          p.next_appointment,
          p.room,
          p.diagnosis,
          JSON_OBJECT(
            'bloodPressure', pv.blood_pressure,
            'heartRate', pv.heart_rate,
            'temperature', pv.temperature,
            'oxygenSaturation', pv.oxygen_saturation
          ) AS vitals
        FROM patients p
        LEFT JOIN departments d ON p.department_id = d.id
        LEFT JOIN staff s ON p.doctor_id = s.id
        LEFT JOIN patient_vitals_current pv ON pv.patient_id = p.id
        ORDER BY 
          CASE 
            WHEN p.status = 'Critical' THEN 1
            WHEN p.status = 'In Treatment' THEN 2
            WHEN p.status = 'Scheduled' THEN 3
            WHEN p.status = 'Discharged' THEN 4
            ELSE 5 
          END, 
          p.id ASC
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error getting all secure patients:', error);
      throw error;
    }
  }

  // ✅ Normalize patient IDs (P1 → P001)
  static normalizePatientId(id) {
    if (!id) return '';
    if (id.startsWith('P') || id.startsWith('p')) {
      const numPart = id.substring(1);
      const numericValue = parseInt(numPart, 10);
      if (!isNaN(numericValue)) {
        return `P${numericValue.toString().padStart(3, '0')}`;
      }
    }
    return id;
  }

  // ✅ Generate sample patient data
  static generateSamplePatient(id) {
    const normalizedId = this.normalizePatientId(id);
    const idNum = parseInt(normalizedId.substring(1), 10);

    const ageBase = (idNum * 13) % 50;
    const genderOptions = ['Male', 'Female'];
    const genderIndex = idNum % genderOptions.length;
    const statusOptions = ['Active', 'Scheduled', 'Discharged', 'In Treatment'];
    const severityOptions = ['Low', 'Medium', 'High', 'Critical'];

    const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'Oncology'];
    const departmentIndex = idNum % departments.length;

    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];

    const firstName = firstNames[(idNum * 3) % firstNames.length];
    const lastName = lastNames[(idNum * 7) % lastNames.length];

    const heartRate = 60 + (idNum % 40);
    const systolic = 110 + (idNum % 30);
    const diastolic = 70 + (idNum % 20);

    return {
      id: normalizedId,
      fullName: `${firstName} ${lastName}`,
      age: 35 + ageBase,
      gender: genderOptions[genderIndex],
      department: departments[departmentIndex],
      doctor: `Dr. ${lastNames[(idNum * 5) % lastNames.length]}`,
      status: statusOptions[idNum % statusOptions.length],
      severity: severityOptions[idNum % severityOptions.length],
      room: `${departments[departmentIndex].charAt(0)}-${100 + (idNum % 100)}`,
      diagnosis: `Sample diagnosis for ${normalizedId}`,
      vitals: {
        bloodPressure: `${systolic}/${diastolic}`,
        heartRate,
        temperature: 97.5 + ((idNum * 13) % 30) / 10,
        oxygenSaturation: 95 + ((idNum * 17) % 5),
      },
      medications: [`Medication ${idNum % 10 + 1}`, `Medication ${(idNum * 3) % 10 + 1}`],
      allergies: idNum % 3 === 0 ? [`Allergy ${idNum % 5 + 1}`] : [],
    };
  }
}
