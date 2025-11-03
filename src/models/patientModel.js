// src/models/patientModel.js
import db from '../config/db.js';
import { maskPII, maskPatientId } from '../utils/privacyUtils.js';

export class PatientModel {
  // Get all patients
  static async getAllPatients() {
    try {
      const query = `
        SELECT 
          p.*,
          d.name as department_name,
          s.full_name as doctor_name
        FROM patients p
        LEFT JOIN departments d ON p.department_id = d.id
        LEFT JOIN staff s ON p.doctor_id = s.id
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting all patients:', error);
      throw error;
    }
  }

  // Get patient by ID - with normalized ID handling
  static async getPatientById(id) {
    try {
      console.log(`Fetching full patient data for ID: ${id}`);
      
      const normalizedId = this.normalizePatientId(id);
      const possibleIds = [id, normalizedId];
      
      for (const patId of possibleIds) {
        const query = `
          SELECT 
            p.*,
            d.name as department_name,
            s.full_name as doctor_name,
            COALESCE(
              json_build_object(
                'bloodPressure', pv.blood_pressure,
                'heartRate', pv.heart_rate,
                'temperature', pv.temperature,
                'oxygenSaturation', pv.oxygen_saturation
              ),
              '{}'::json
            ) as vitals,
            COALESCE(
              (SELECT json_agg(m.medication_name) FROM patient_medications m WHERE m.patient_id = p.id),
              '[]'::json
            ) as medications,
            COALESCE(
              (SELECT json_agg(a.allergy_name) FROM patient_allergies a WHERE a.patient_id = p.id),
              '[]'::json
            ) as allergies
          FROM patients p
          LEFT JOIN departments d ON p.department_id = d.id
          LEFT JOIN staff s ON p.doctor_id = s.id
          LEFT JOIN patient_vitals_current pv ON pv.patient_id = p.id
          WHERE p.id = $1
        `;
        
        const result = await db.query(query, [patId]);
        if (result.rows.length > 0) {
          return result.rows[0];
        }
      }
      
      console.log(`Patient ${id} not found in database, returning sample data`);
      return this.generateSamplePatient(normalizedId);
    } catch (error) {
      console.error(`Error getting patient with id ${id}:`, error);
      throw error;
    }
  }
  
  // Get secure patient by ID (with PII masked)
  static async getSecurePatientById(id) {
    try {
      console.log(`Looking up patient with ID: ${id}`);
      
      const query = `
        SELECT 
          p.id,
          p.full_name,
          p.age,
          p.gender,
          d.name as department_name,
          s.full_name as doctor_name,
          p.status,
          p.severity,
          p.admission_date,
          p.last_visit,
          p.next_appointment,
          p.room,
          p.diagnosis,
          COALESCE(json_agg(DISTINCT pa.allergy_name) FILTER (WHERE pa.allergy_name IS NOT NULL), '[]') AS allergies,
          COALESCE(json_agg(DISTINCT pm.medication_name) FILTER (WHERE pm.medication_name IS NOT NULL), '[]') AS medications,
          jsonb_build_object(
            'bloodPressure', pv.blood_pressure,
            'heartRate', pv.heart_rate,
            'temperature', pv.temperature,
            'oxygenSaturation', pv.oxygen_saturation
          ) as vitals
        FROM patients p
        LEFT JOIN departments d ON p.department_id = d.id
        LEFT JOIN staff s ON p.doctor_id = s.id
        LEFT JOIN patient_allergies pa ON pa.patient_id = p.id
        LEFT JOIN patient_medications pm ON pm.patient_id = p.id
        LEFT JOIN patient_vitals_current pv ON pv.patient_id = p.id
        WHERE p.id = $1
        GROUP BY p.id, d.name, s.full_name, pv.blood_pressure, pv.heart_rate, pv.temperature, pv.oxygen_saturation
      `;
      
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        console.log(`Patient ${id} not found in database`);
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error(`Error getting secure patient with id ${id}:`, error);
      throw error;
    }
  }
  
  // Get all secure patients
  static async getAllSecurePatients() {
    try {
      const query = `
        SELECT 
          p.id,
          p.full_name,
          p.age,
          p.gender,
          d.name as department_name,
          s.full_name as doctor_name,
          p.status,
          p.severity,
          p.admission_date,
          p.last_visit,
          p.next_appointment,
          p.room,
          p.diagnosis,
          jsonb_build_object(
            'bloodPressure', pv.blood_pressure,
            'heartRate', pv.heart_rate,
            'temperature', pv.temperature,
            'oxygenSaturation', pv.oxygen_saturation
          ) as vitals
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
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting all secure patients:', error);
      throw error;
    }
  }
  
  // Normalize patient IDs (P1 → P001)
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
  
  // Generate sample patient data
  static generateSamplePatient(id) {
    const normalizedId = this.normalizePatientId(id);
    const idNum = parseInt(normalizedId.substring(1), 10); 
    
    const ageBase = (idNum * 13) % 50;
    const genderOptions = ['Male', 'Female'];
    const genderIndex = idNum % genderOptions.length;
    const statusOptions = ['Active', 'Scheduled', 'Discharged', 'In Treatment'];
    const statusIndex = idNum % statusOptions.length;
    const severityOptions = ['Low', 'Medium', 'High', 'Critical'];
    const severityIndex = idNum % severityOptions.length;
    
    const departments = [
      'Cardiology', 'Neurology', 'Orthopedics', 
      'Pediatrics', 'Emergency', 'Oncology'
    ];
    const departmentIndex = idNum % departments.length;
    
    const firstNameOptions = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer'];
    const lastNameOptions = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    const firstNameIndex = (idNum * 3) % firstNameOptions.length;
    const lastNameIndex = (idNum * 7) % lastNameOptions.length;
    
    const firstName = firstNameOptions[firstNameIndex];
    const lastName = lastNameOptions[lastNameIndex];
    
    const heartRate = 60 + (idNum % 40);
    const systolic = 110 + (idNum % 30);
    const diastolic = 70 + (idNum % 20);
    
    return {
      id: normalizedId,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      age: 35 + ageBase,
      gender: genderOptions[genderIndex],
      dateOfBirth: `${1960 + (idNum % 40)}-${(idNum % 12) + 1}-${(idNum % 28) + 1}`,
      phone: `(555) ${100 + idNum}-${1000 + (idNum * 3) % 9000}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      address: `${100 + idNum} Main St, Anytown, USA`,
      insurance: ['Private', 'Medicare', 'Medicaid'][idNum % 3],
      department: departments[departmentIndex],
      doctor: `Dr. ${lastNameOptions[(lastNameIndex + 3) % lastNameOptions.length]}`,
      admissionDate: `2024-${((idNum % 3) + 4).toString().padStart(2, '0')}-${((idNum % 27) + 1).toString().padStart(2, '0')}`,
      status: statusOptions[statusIndex],
      severity: severityOptions[severityIndex],
      room: `${departments[departmentIndex].charAt(0)}-${100 + (idNum % 100)}`,
      diagnosis: `Sample diagnosis for ${normalizedId}`,
      vitals: {
        bloodPressure: `${systolic}/${diastolic}`,
        heartRate,
        temperature: 97.5 + ((idNum * 13) % 30) / 10,
        oxygenSaturation: 95 + ((idNum * 17) % 5)
      },
      medications: [`Medication ${idNum % 10 + 1}`, `Medication ${(idNum * 3) % 10 + 1}`],
      allergies: idNum % 3 === 0 ? [`Allergy ${idNum % 5 + 1}`] : []
    };
  }
}
