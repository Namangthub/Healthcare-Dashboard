const db = require('../config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Define fallback data in case import fails
const fallbackData = {
  departments: [
    {
      id: 1,
      name: 'Cardiology',
      code: 'CARD',
      totalPatients: 120,
      todayPatients: 15,
      avgWaitTime: 25,
      satisfaction: 4.2,
      revenue: 230500,
      capacity: 50,
      currentOccupancy: 42,
      criticalCases: 8,
      staff: { doctors: 12, nurses: 20, support: 8 }
    },
    {
      id: 2,
      name: 'Neurology',
      code: 'NEUR', 
      totalPatients: 85,
      todayPatients: 12,
      avgWaitTime: 30,
      satisfaction: 4.0,
      revenue: 185000,
      capacity: 40,
      currentOccupancy: 28,
      criticalCases: 5,
      staff: { doctors: 8, nurses: 15, support: 5 }
    },
    {
      id: 3,
      name: 'Pediatrics',
      code: 'PEDI',
      totalPatients: 95,
      todayPatients: 20,
      avgWaitTime: 20,
      satisfaction: 4.5,
      revenue: 145000,
      capacity: 45,
      currentOccupancy: 30,
      criticalCases: 3,
      staff: { doctors: 10, nurses: 22, support: 7 }
    }
  ],
  staff: [
    {
      id: 'STF001',
      fullName: 'Dr. John Smith',
      role: 'Doctor',
      department: 'Cardiology',
      status: 'On Duty',
      shift: 'Morning',
      experience: 10,
      patients: 25,
      phone: '555-123-4567',
      email: 'john.smith@hospital.com',
      specialty: 'Cardiac Surgery',
      rating: 4.8
    },
    {
      id: 'STF002',
      fullName: 'Dr. Sarah Johnson',
      role: 'Doctor',
      department: 'Neurology',
      status: 'On Call',
      shift: 'Evening',
      experience: 8,
      patients: 18,
      phone: '555-234-5678',
      email: 'sarah.johnson@hospital.com',
      specialty: 'Neurosurgery',
      rating: 4.6
    }
  ],
  patients: [
    {
      id: 'PAT001',
      firstName: 'Robert',
      lastName: 'Davis', 
      fullName: 'Robert Davis',
      age: 65,
      gender: 'Male',
      dateOfBirth: '1958-03-15',
      phone: '555-987-6543',
      email: 'robert.davis@example.com',
      address: '123 Oak St, Springfield',
      insurance: 'Medicare',
      emergencyContact: 'Jane Davis: 555-456-7890',
      department: 'Cardiology',
      doctor: 'Dr. John Smith',
      admissionDate: '2023-05-10',
      status: 'In Treatment',
      severity: 'Medium',
      room: 'C-105',
      diagnosis: 'Coronary Artery Disease'
    },
    {
      id: 'PAT002',
      firstName: 'Emily',
      lastName: 'Wilson',
      fullName: 'Emily Wilson',
      age: 42,
      gender: 'Female',
      dateOfBirth: '1981-07-22',
      phone: '555-876-5432',
      email: 'emily.wilson@example.com',
      address: '456 Elm St, Springfield',
      insurance: 'BlueCross',
      emergencyContact: 'Mark Wilson: 555-567-8901',
      department: 'Neurology',
      doctor: 'Dr. Sarah Johnson',
      admissionDate: '2023-05-12',
      status: 'Critical',
      severity: 'High',
      room: 'N-205',
      diagnosis: 'Seizure Disorder'
    }
  ]
};

// Try to load healthcare data from frontend, fallback to built-in data if fails
let healthcareData;
try {
  const healthcareDataPath = path.resolve(__dirname, '../../../healthcare-dashboard/src/data/healthcareData.js');
  console.log('Looking for healthcareData.js at:', healthcareDataPath);
  
  if (fs.existsSync(healthcareDataPath)) {
    console.log('Healthcare data file found!');
    const importedData = require(healthcareDataPath);
    
    // Handle ES Modules (check if it has a default export)
    if (importedData.__esModule && importedData.default) {
      console.log('ES Module detected, using default export');
      healthcareData = importedData.default;
    } else {
      console.log('Using CommonJS module data');
      healthcareData = importedData;
    }
    
    console.log('Healthcare data structure:', 
      Object.keys(healthcareData).join(', '));
    
    // Check if the data has the expected structure
    if (!healthcareData.departments || !Array.isArray(healthcareData.departments)) {
      console.log('Warning: Imported data does not have the expected structure. Using fallback data.');
      healthcareData = fallbackData;
    }
  } else {
    console.log('Healthcare data file not found, using fallback data');
    healthcareData = fallbackData;
  }
} catch (error) {
  console.error('Error loading healthcare data:', error.message);
  console.log('Using fallback data instead');
  healthcareData = fallbackData;
}

async function seedDatabase() {
  const client = await db.pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Seed departments
    if (healthcareData.departments && Array.isArray(healthcareData.departments) && healthcareData.departments.length > 0) {
      console.log(`Seeding ${healthcareData.departments.length} departments...`);
      
      for (const dept of healthcareData.departments) {
        try {
          // Insert department
          const deptQuery = `
            INSERT INTO departments 
            (name, code, total_patients, today_patients, avg_wait_time, 
            satisfaction, revenue, capacity, current_occupancy, critical_cases)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
          `;
          
          const deptValues = [
            dept.name,
            dept.code,
            dept.totalPatients,
            dept.todayPatients,
            dept.avgWaitTime,
            dept.satisfaction,
            dept.revenue,
            dept.capacity,
            dept.currentOccupancy,
            dept.criticalCases
          ];
          
          const deptResult = await client.query(deptQuery, deptValues);
          const deptId = deptResult.rows[0].id;
          
          // Check if staff property exists and has the expected structure
          if (dept.staff && typeof dept.staff === 'object') {
            // Insert department staff counts
            const staffQuery = `
              INSERT INTO department_staff
              (department_id, doctors, nurses, support)
              VALUES ($1, $2, $3, $4)
            `;
            
            const staffValues = [
              deptId,
              dept.staff.doctors || 0,
              dept.staff.nurses || 0,
              dept.staff.support || 0
            ];
            
            await client.query(staffQuery, staffValues);
          } else {
            console.log(`Department ${dept.name} has no staff data, using defaults`);
            // Insert default staff counts
            const defaultStaffQuery = `
              INSERT INTO department_staff
              (department_id, doctors, nurses, support)
              VALUES ($1, $2, $3, $4)
            `;
            
            await client.query(defaultStaffQuery, [
              deptId, 
              Math.floor(Math.random() * 10) + 5, // 5-15 doctors
              Math.floor(Math.random() * 15) + 10, // 10-25 nurses
              Math.floor(Math.random() * 8) + 3 // 3-10 support staff
            ]);
          }
          
          console.log(`Department ${dept.name} added successfully`);
        } catch (deptError) {
          console.error(`Error adding department ${dept.name}:`, deptError.message);
          // Continue with other departments even if one fails
        }
      }
    } else {
      console.error('No valid departments data found, using fallback data');
      
      // Seed with fallback departments data
      for (const dept of fallbackData.departments) {
        try {
          // Insert department
          const deptQuery = `
            INSERT INTO departments 
            (name, code, total_patients, today_patients, avg_wait_time, 
            satisfaction, revenue, capacity, current_occupancy, critical_cases)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
          `;
          
          const deptValues = [
            dept.name,
            dept.code,
            dept.totalPatients,
            dept.todayPatients,
            dept.avgWaitTime,
            dept.satisfaction,
            dept.revenue,
            dept.capacity,
            dept.currentOccupancy,
            dept.criticalCases
          ];
          
          const deptResult = await client.query(deptQuery, deptValues);
          const deptId = deptResult.rows[0].id;
          
          // Insert department staff counts
          const staffQuery = `
            INSERT INTO department_staff
            (department_id, doctors, nurses, support)
            VALUES ($1, $2, $3, $4)
          `;
          
          const staffValues = [
            deptId,
            dept.staff.doctors,
            dept.staff.nurses,
            dept.staff.support
          ];
          
          await client.query(staffQuery, staffValues);
          console.log(`Fallback department ${dept.name} added successfully`);
        } catch (deptError) {
          console.error(`Error adding fallback department ${dept.name}:`, deptError.message);
          // Continue with other departments even if one fails
        }
      }
    }
    
    // Seed staff
    const staffData = healthcareData.staff && Array.isArray(healthcareData.staff) && healthcareData.staff.length > 0 
      ? healthcareData.staff 
      : fallbackData.staff;
    
    console.log(`Seeding ${staffData.length} staff members...`);
    
    for (const member of staffData) {
      try {
        // Parse name into first and last name
        let firstName, lastName;
        const fullName = member.fullName;
        
        if (fullName.startsWith('Dr.')) {
          const nameParts = fullName.replace('Dr. ', '').split(' ');
          firstName = nameParts[0];
          lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        } else {
          const nameParts = fullName.split(' ');
          firstName = nameParts[0];
          lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        }
        
        // Find department ID based on department name
        const deptQuery = `SELECT id FROM departments WHERE name = $1`;
        const deptResult = await client.query(deptQuery, [member.department]);
        const departmentId = deptResult.rows.length > 0 ? deptResult.rows[0].id : null;
        
        if (!departmentId) {
          console.log(`Warning: Department ${member.department} not found for ${member.fullName}`);
        }
        
        const staffQuery = `
          INSERT INTO staff
          (id, first_name, last_name, full_name, role, department_id, status,
          shift, experience, patient_count, phone, email, specialty, rating)
          VALUES ($1, $2, $3, $4, $5, $6, $7::staff_status, $8, $9, $10, $11, $12, $13, $14)
        `;
        
        const staffValues = [
          member.id,
          firstName,
          lastName,
          member.fullName,
          member.role,
          departmentId,
          member.status || 'On Duty', // Default to On Duty if not provided
          member.shift || 'Day',
          member.experience || 1,
          member.patients || 0,
          member.phone || '555-000-0000',
          member.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospital.com`,
          member.specialty || 'General',
          member.rating || 4.0
        ];
        
        await client.query(staffQuery, staffValues);
        console.log(`Staff member ${member.fullName} added successfully`);
      } catch (staffError) {
        console.error(`Error adding staff ${member.fullName}:`, staffError.message);
        // Continue with other staff even if one fails
      }
    }
    
    // Seed patients
    const patientData = healthcareData.patients && Array.isArray(healthcareData.patients) && healthcareData.patients.length > 0 
      ? healthcareData.patients 
      : fallbackData.patients;
      
    console.log(`Seeding ${patientData.length} patients...`);
    
    for (const patient of patientData) {
      try {
        // Find department ID based on department name
        const deptQuery = `SELECT id FROM departments WHERE name = $1`;
        const deptResult = await client.query(deptQuery, [patient.department]);
        const departmentId = deptResult.rows.length > 0 ? deptResult.rows[0].id : null;
        
        if (!departmentId) {
          console.log(`Warning: Department ${patient.department} not found for patient ${patient.fullName}`);
        }
        
        // Find doctor ID based on name
        const doctorQuery = `SELECT id FROM staff WHERE full_name = $1`;
        const doctorResult = await client.query(doctorQuery, [patient.doctor]);
        const doctorId = doctorResult.rows.length > 0 ? doctorResult.rows[0].id : null;
        
        if (!doctorId) {
          console.log(`Warning: Doctor ${patient.doctor} not found for patient ${patient.fullName}`);
        }
        
        const patientQuery = `
          INSERT INTO patients
          (id, first_name, last_name, full_name, age, gender, date_of_birth,
          phone, email, address, insurance, emergency_contact, department_id,
          doctor_id, admission_date, status, severity, room, diagnosis)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::patient_status, $17::patient_severity, $18, $19)
          RETURNING id
        `;
        
        const patientValues = [
          patient.id,
          patient.firstName,
          patient.lastName,
          patient.fullName,
          patient.age,
          patient.gender,
          patient.dateOfBirth,
          patient.phone || '555-000-0000',
          patient.email || `patient${patient.id}@example.com`,
          patient.address || 'Unknown Address',
          patient.insurance || 'Unknown',
          patient.emergencyContact || 'None',
          departmentId,
          doctorId,
          patient.admissionDate,
          patient.status,
          patient.severity,
          patient.room || 'Unassigned',
          patient.diagnosis || 'Under evaluation'
        ];
        
        const patientResult = await client.query(patientQuery, patientValues);
        const patientId = patientResult.rows[0].id;
        
        // Add vitals for each patient
        const vitalsQuery = `
          INSERT INTO patient_vitals_current
          (patient_id, blood_pressure, heart_rate, temperature, oxygen_saturation, weight, height)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        
        // Generate some plausible vitals based on patient severity
        const severityMap = {
          'Low': { bp: '110/70', hr: 75, temp: 98.6, ox: 98 },
          'Medium': { bp: '120/80', hr: 85, temp: 99.1, ox: 95 },
          'High': { bp: '140/90', hr: 95, temp: 100.2, ox: 92 }
        };
        
        const defaultVitals = severityMap[patient.severity] || severityMap.Medium;
        
        const vitalsValues = [
          patientId,
          patient.vitals?.bloodPressure || defaultVitals.bp,
          patient.vitals?.heartRate || defaultVitals.hr,
          patient.vitals?.temperature || defaultVitals.temp,
          patient.vitals?.oxygenSaturation || defaultVitals.ox,
          patient.vitals?.weight || (patient.age > 18 ? 70 : 30),
          patient.vitals?.height || (patient.age > 18 ? 170 : 120)
        ];
        
        await client.query(vitalsQuery, vitalsValues);
        console.log(`Patient ${patient.fullName} added successfully`);
      } catch (patientError) {
        console.error(`Error adding patient ${patient.fullName}:`, patientError.message);
        // Continue with other patients even if one fails
      }
    }
    
    // Seed quality metrics for departments
    console.log('Seeding quality metrics...');
    
    // Get all departments from the database
    const deptQuery = `SELECT id, name FROM departments`;
    const departments = (await client.query(deptQuery)).rows;
    
    for (const dept of departments) {
      try {
        const departmentId = dept.id;
        
        // Get department details from the database
        const deptDetailsQuery = `
          SELECT satisfaction, avg_wait_time, revenue
          FROM departments
          WHERE id = $1
        `;
        const deptDetails = (await client.query(deptDetailsQuery, [departmentId])).rows[0];
        
        // Insert patient satisfaction
        const satisfactionQuery = `
          INSERT INTO quality_patient_satisfaction
          (department_id, score, responses)
          VALUES ($1, $2, $3)
        `;
        
        const satisfactionValues = [
          departmentId,
          deptDetails.satisfaction,
          Math.floor(Math.random() * 100) + 50 // Random number of responses between 50-150
        ];
        
        await client.query(satisfactionQuery, satisfactionValues);
        
        // Insert wait times
        const waitTimeQuery = `
          INSERT INTO quality_wait_times
          (department_id, avg_wait, target)
          VALUES ($1, $2, $3)
        `;
        
        const waitTimeValues = [
          departmentId,
          deptDetails.avg_wait_time,
          20 // Target wait time
        ];
        
        await client.query(waitTimeQuery, waitTimeValues);
        
        // Insert readmission rates
        const readmissionQuery = `
          INSERT INTO quality_readmission_rates
          (department_id, rate, target)
          VALUES ($1, $2, $3)
        `;
        
        const readmissionValues = [
          departmentId,
          (Math.random() * 5).toFixed(2), // Random readmission rate between 0-5%
          3.0 // Target readmission rate
        ];
        
        await client.query(readmissionQuery, readmissionValues);
        
        // Insert department financials
        const financialsQuery = `
          INSERT INTO department_financials
          (department_id, revenue, percentage)
          VALUES ($1, $2, $3)
        `;
        
        const financialsValues = [
          departmentId,
          deptDetails.revenue,
          (deptDetails.revenue / 1000000 * 100).toFixed(2) // Calculate percentage of total revenue
        ];
        
        await client.query(financialsQuery, financialsValues);
        
        console.log(`Quality metrics for ${dept.name} added successfully`);
      } catch (metricsError) {
        console.error(`Error adding metrics for department ${dept.name}:`, metricsError.message);
        // Continue with other departments even if one fails
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Database seeded successfully!');
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Release client
    client.release();
  }
}

// Run directly if called from command line
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding process complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;