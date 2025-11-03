// src/utils/transformData.js
/**
 * Utility functions for transforming data between database and frontend formats
 */

// Helper function to ensure values are numeric
function ensureNumber(value, defaultValue = 0) {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

// Mask PII (Personally Identifiable Information) for secure endpoints
function maskPII(text) {
  if (!text) return '';
  const parts = text.split(' ');
  return parts.map(part => part.charAt(0) + '*'.repeat(part.length - 1)).join(' ');
}

// Department transformations
exports.transformDepartment = function(dept) {
  if (!dept) return null;
  
  return {
    id: dept.id,
    name: dept.name,
    code: dept.code,
    totalPatients: ensureNumber(dept.total_patients),
    todayPatients: ensureNumber(dept.today_patients),
    avgWaitTime: ensureNumber(dept.avg_wait_time),
    satisfaction: ensureNumber(dept.satisfaction), 
    staff: {
      doctors: ensureNumber(dept.doctors || 0),
      nurses: ensureNumber(dept.nurses || 0),
      support: ensureNumber(dept.support || 0)
    },
    revenue: ensureNumber(dept.revenue),
    capacity: ensureNumber(dept.capacity),
    currentOccupancy: ensureNumber(dept.current_occupancy),
    criticalCases: ensureNumber(dept.critical_cases)
  };
};

// Patient transformations
exports.transformPatient = function(patient) {
  if (!patient) return null;
  
  return {
    id: patient.id,
    firstName: patient.first_name,
    lastName: patient.last_name,
    fullName: patient.full_name,
    age: patient.age,
    gender: patient.gender,
    dateOfBirth: patient.date_of_birth,
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    insurance: patient.insurance,
    emergencyContact: patient.emergency_contact,
    department: patient.department_name || 'Unassigned',
    departmentId: patient.department_id,
    doctor: patient.doctor_name || 'Unassigned',
    doctorId: patient.doctor_id,
    admissionDate: patient.admission_date,
    status: patient.status,
    severity: patient.severity,
    room: patient.room,
    diagnosis: patient.diagnosis,
    lastVisit: patient.last_visit,
    nextAppointment: patient.next_appointment,
    notes: patient.notes
  };
};

// Secure patient transformation (with PII masked)
exports.transformSecurePatient = function(patient) {
  if (!patient) return null;
  
  const transformed = exports.transformPatient(patient);
  
  return {
    ...transformed,
    firstName: maskPII(transformed.firstName),
    lastName: maskPII(transformed.lastName),
    fullName: maskPII(transformed.fullName),
    phone: maskPII(transformed.phone),
    email: maskPII(transformed.email),
    address: maskPII(transformed.address),
    emergencyContact: maskPII(transformed.emergencyContact)
  };
};

// Staff transformations
exports.transformStaff = function(staff) {
  if (!staff) return null;
  
  return {
    id: staff.id,
    firstName: staff.first_name,
    lastName: staff.last_name,
    fullName: staff.full_name,
    role: staff.role,
    department: staff.department_name || 'Unassigned',
    departmentId: staff.department_id,
    status: staff.status,
    shift: staff.shift,
    experience: ensureNumber(staff.experience),
    patients: ensureNumber(staff.patients),
    phone: staff.phone,
    email: staff.email,
    specialty: staff.specialty,
    rating: ensureNumber(staff.rating) // Ensure rating is a number
  };
};

// Department quality metrics transformation
exports.transformQualityMetrics = function(quality) {
  if (!quality) return null;
  
  return {
    satisfaction: quality.satisfaction_score ? {
      score: ensureNumber(quality.satisfaction_score), // Ensure it's a number
      responses: ensureNumber(quality.satisfaction_responses)
    } : null,
    waitTime: quality.wait_time_avg ? {
      avgWait: ensureNumber(quality.wait_time_avg),
      target: ensureNumber(quality.wait_time_target)
    } : null,
    readmission: quality.readmission_rate ? {
      rate: ensureNumber(quality.readmission_rate),
      target: ensureNumber(quality.readmission_target)
    } : null
  };
};

// Financial data transformation
exports.transformFinancial = function(financial) {
  if (!financial) return null;
  
  return {
    revenue: ensureNumber(financial.revenue),
    percentage: ensureNumber(financial.percentage)
  };
};