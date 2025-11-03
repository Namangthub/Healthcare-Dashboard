const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// If you're using the healthcareData.js from the frontend, import it this way
let healthcareData;
try {
  // Try to import from the frontend project directory
  const frontendPath = path.join(__dirname, '../../../healthcare-dashboard/src/data/healthcareData.js');
  if (fs.existsSync(frontendPath)) {
    healthcareData = require(frontendPath);
    console.log('Using healthcareData.js from frontend project');
  } else {
    // Fallback to local data if available
    healthcareData = require('../../data/healthcareData');
    console.log('Using local healthcareData.js');
  }
} catch (error) {
  console.error('Error loading healthcareData.js:', error.message);
  process.exit(1);
}

async function dropAndCreateAllTables() {
  const client = await db.pool.connect();
  
  try {
    console.log('Starting database reset and seeding...');
    
    // Start transaction
    await client.query('BEGIN');

    console.log('Dropping all existing tables and types...');
    
    // Drop all related tables in the correct order (reverse dependency order)
    await client.query(`
      -- Drop tables with foreign key dependencies first
      DROP TABLE IF EXISTS patient_allergies CASCADE;
      DROP TABLE IF EXISTS patient_medications CASCADE;
      DROP TABLE IF EXISTS timeline_events CASCADE;
      DROP TABLE IF EXISTS vital_sign_alerts CASCADE;
      DROP TABLE IF EXISTS patient_vital_history CASCADE;
      DROP TABLE IF EXISTS patient_vitals_current CASCADE;
      DROP TABLE IF EXISTS patients CASCADE;
      DROP TABLE IF EXISTS staff CASCADE;
      DROP TABLE IF EXISTS departments CASCADE;
      DROP TABLE IF EXISTS allergies CASCADE;
      DROP TABLE IF EXISTS medications CASCADE;
      
      -- Drop custom types
      DROP TYPE IF EXISTS patient_status CASCADE;
      DROP TYPE IF EXISTS patient_severity CASCADE;
      DROP TYPE IF EXISTS staff_status CASCADE;
      DROP TYPE IF EXISTS timeline_event_type CASCADE;
    `);
    
    console.log('Creating custom types...');
    await client.query(`
      CREATE TYPE patient_status AS ENUM ('In Treatment', 'Scheduled', 'Critical', 'Discharged');
      CREATE TYPE patient_severity AS ENUM ('High', 'Medium', 'Low');
      CREATE TYPE staff_status AS ENUM ('On Duty', 'Off Duty', 'On Call', 'On Leave', 'Available', 'In Surgery');
      CREATE TYPE timeline_event_type AS ENUM ('admission', 'visit', 'test', 'medication', 'discharge', 'surgery', 'other');
    `);
    
    console.log('Creating departments table...');
    await client.query(`
      CREATE TABLE departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(10) NOT NULL UNIQUE,
        total_patients INTEGER NOT NULL DEFAULT 0,
        today_patients INTEGER NOT NULL DEFAULT 0,
        avg_wait_time INTEGER NOT NULL DEFAULT 0,
        satisfaction DECIMAL(3,1) NOT NULL DEFAULT 0,
        revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
        capacity INTEGER NOT NULL DEFAULT 0,
        current_occupancy INTEGER NOT NULL DEFAULT 0,
        critical_cases INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Seeding departments...');
    for (const dept of healthcareData.departments) {
      await client.query(`
        INSERT INTO departments 
        (id, name, code, total_patients, today_patients, avg_wait_time, 
         satisfaction, revenue, capacity, current_occupancy, critical_cases)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        dept.id, 
        dept.name, 
        dept.code || dept.name.substring(0,3).toUpperCase(), 
        dept.totalPatients || 0, 
        dept.todayPatients || 0, 
        dept.avgWaitTime || 0, 
        dept.satisfaction || 0, 
        dept.revenue || 0, 
        dept.capacity || 0, 
        dept.currentOccupancy || 0, 
        dept.criticalCases || 0
      ]);
    }
    console.log(`Seeded ${healthcareData.departments.length} departments`);
    
    console.log('Creating staff table...');
    await client.query(`
      CREATE TABLE staff (
        id VARCHAR(10) PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        status staff_status NOT NULL,
        shift VARCHAR(50) NOT NULL,
        experience INTEGER NOT NULL,
        patient_count INTEGER NOT NULL DEFAULT 0,
        phone VARCHAR(20),
        email VARCHAR(100),
        specialty VARCHAR(100),
        rating DECIMAL(3,1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Seeding staff...');
    // Map department names to IDs for staff assignment
    const deptsResult = await client.query('SELECT id, name FROM departments');
    const deptMap = {};
    deptsResult.rows.forEach(dept => {
      deptMap[dept.name] = dept.id;
    });
    
    for (const staffMember of healthcareData.staff) {
      // Find department ID based on name
      const deptId = deptMap[staffMember.department] || null;
      
      // Extract first and last name
      let firstName = staffMember.firstName;
      let lastName = staffMember.lastName;
      
      // If firstName starts with "Dr.", remove it
      if (firstName && firstName.startsWith('Dr. ')) {
        firstName = firstName.substring(4);
      }
      
      // If full name contains "Dr.", remove it for consistency
      let fullName = staffMember.fullName;
      if (fullName && fullName.startsWith('Dr. ')) {
        fullName = fullName.substring(4);
      }
      
      await client.query(`
        INSERT INTO staff 
        (id, first_name, last_name, full_name, role, department_id, status, shift, 
         experience, patient_count, phone, email, specialty, rating)
        VALUES ($1, $2, $3, $4, $5, $6, $7::staff_status, $8, $9, $10, $11, $12, $13, $14)
      `, [
        staffMember.id,
        firstName,
        lastName,
        fullName,
        staffMember.role || 'Doctor',
        deptId,
        staffMember.status || 'Available',
        staffMember.shift || 'Day',
        staffMember.experience || 5,
        staffMember.patients || 0,
        staffMember.phone || `(555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        staffMember.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospital.example.com`,
        staffMember.specialty || 'General',
        staffMember.rating || (3.5 + Math.random() * 1.5).toFixed(1)
      ]);
    }
    console.log(`Seeded ${healthcareData.staff.length} staff members`);
    
    console.log('Creating patients table...');
    await client.query(`
      CREATE TABLE patients (
        id VARCHAR(10) PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        gender VARCHAR(20) NOT NULL,
        date_of_birth DATE NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        insurance VARCHAR(50),
        emergency_contact TEXT,
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        doctor_id VARCHAR(10) REFERENCES staff(id) ON DELETE SET NULL,
        admission_date DATE NOT NULL,
        status patient_status NOT NULL,
        severity patient_severity NOT NULL,
        room VARCHAR(20),
        diagnosis TEXT,
        last_visit DATE,
        next_appointment DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Seeding patients...');
    // Map department names to IDs
    const deptResult = await client.query('SELECT id, name FROM departments');
    const departmentMap = {};
    deptResult.rows.forEach(dept => {
      departmentMap[dept.name] = dept.id;
    });
    
    // Map doctor names to IDs
    const staffResult = await client.query('SELECT id, full_name FROM staff');
    const staffMap = {};
    staffResult.rows.forEach(staff => {
      staffMap[staff.full_name] = staff.id;
      // Also map with "Dr. " prefix for frontend data format
      staffMap[`Dr. ${staff.full_name}`] = staff.id;
    });
    
    for (const patient of healthcareData.patients) {
      // Find department ID based on name
      const deptId = departmentMap[patient.department] || null;
      
      // Find doctor ID based on name
      const doctorId = staffMap[patient.doctor] || null;
      
      // Handle status enum validation
      let status = patient.status;
      if (!['In Treatment', 'Scheduled', 'Critical', 'Discharged'].includes(status)) {
        status = 'In Treatment'; // Default
      }
      
      // Handle severity enum validation
      let severity = patient.severity;
      if (!['High', 'Medium', 'Low'].includes(severity)) {
        severity = 'Medium'; // Default
      }
      
      await client.query(`
        INSERT INTO patients 
        (id, first_name, last_name, full_name, age, gender, date_of_birth, 
         phone, email, address, insurance, emergency_contact, department_id,
         doctor_id, admission_date, status, severity, room, diagnosis, 
         last_visit, next_appointment, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
               $15, $16::patient_status, $17::patient_severity, $18, $19, $20, $21, $22)
      `, [
        patient.id,
        patient.firstName,
        patient.lastName,
        patient.fullName || `${patient.firstName} ${patient.lastName}`,
        patient.age,
        patient.gender,
        patient.dateOfBirth,
        patient.phone,
        patient.email,
        patient.address,
        patient.insurance,
        patient.emergencyContact,
        deptId,
        doctorId,
        patient.admissionDate,
        status,
        severity,
        patient.room,
        patient.diagnosis,
        patient.lastVisit || null,
        patient.nextAppointment || null,
        patient.notes || null
      ]);
    }
    console.log(`Seeded ${healthcareData.patients.length} patients`);
    
    console.log('Creating patient_vitals_current table...');
    await client.query(`
      CREATE TABLE patient_vitals_current (
        patient_id VARCHAR(10) PRIMARY KEY REFERENCES patients(id) ON DELETE CASCADE,
        blood_pressure VARCHAR(10) NOT NULL,
        heart_rate INTEGER NOT NULL,
        temperature DECIMAL(4,1) NOT NULL,
        oxygen_saturation INTEGER NOT NULL,
        weight NUMERIC(5,1),
        height NUMERIC(5,1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Seeding current vitals data...');
    for (const patient of healthcareData.patients) {
      if (patient.vitals) {
        // Set default values if missing
        const vitals = {
          bloodPressure: patient.vitals.bloodPressure || '120/80',
          heartRate: patient.vitals.heartRate || 75,
          temperature: patient.vitals.temperature || 98.6,
          oxygenSaturation: patient.vitals.oxygenSaturation || 98,
          weight: patient.vitals.weight || null,
          height: patient.vitals.height || null
        };
        
        await client.query(`
          INSERT INTO patient_vitals_current
          (patient_id, blood_pressure, heart_rate, temperature, oxygen_saturation, weight, height)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          patient.id,
          vitals.bloodPressure,
          vitals.heartRate,
          vitals.temperature,
          vitals.oxygenSaturation,
          vitals.weight,
          vitals.height
        ]);
      }
    }
    console.log('Seeded current vitals data');
    
    console.log('Creating patient_vital_history table...');
    await client.query(`
      CREATE TABLE patient_vital_history (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(10) REFERENCES patients(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        heart_rate INTEGER NOT NULL,
        blood_pressure VARCHAR(10) NOT NULL,
        temperature DECIMAL(4,1) NOT NULL,
        oxygen_saturation INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(patient_id, date)
      );
    `);
    
    console.log('Seeding vital signs history...');
    if (healthcareData.patientVitals) {
      let vitalHistoryCount = 0;
      for (const patientId in healthcareData.patientVitals) {
        const vitals = healthcareData.patientVitals[patientId];
        
        for (const record of vitals) {
          try {
            await client.query(`
              INSERT INTO patient_vital_history
              (patient_id, date, heart_rate, blood_pressure, temperature, oxygen_saturation)
              VALUES ($1, $2, $3, $4, $5, $6)
            `, [
              patientId,
              record.date,
              record.heartRate,
              record.bloodPressure,
              record.temperature,
              record.oxygenSaturation
            ]);
            vitalHistoryCount++;
          } catch (error) {
            if (error.code === '23505') { // Duplicate key error
              console.log(`Skipping duplicate vital record for ${patientId} on ${record.date}`);
            } else {
              throw error;
            }
          }
        }
      }
      console.log(`Seeded ${vitalHistoryCount} vital history records`);
    }
    
    console.log('Creating vital_sign_alerts table...');
    await client.query(`
      CREATE TABLE vital_sign_alerts (
        id VARCHAR(10) PRIMARY KEY,
        patient_id VARCHAR(10) REFERENCES patients(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        severity patient_severity NOT NULL,
        date DATE NOT NULL,
        resolved BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Seeding vital sign alerts...');
    if (healthcareData.vitalSignsAlerts) {
      for (const alert of healthcareData.vitalSignsAlerts) {
        // Handle severity enum validation
        let severity = alert.severity;
        if (!['High', 'Medium', 'Low'].includes(severity)) {
          severity = 'Medium'; // Default
        }
        
        await client.query(`
          INSERT INTO vital_sign_alerts
          (id, patient_id, type, message, severity, date, resolved)
          VALUES ($1, $2, $3, $4, $5::patient_severity, $6, $7)
        `, [
          alert.id,
          alert.patientId,
          alert.type,
          alert.message,
          severity,
          alert.date,
          alert.resolved
        ]);
      }
      console.log(`Seeded ${healthcareData.vitalSignsAlerts.length} vital sign alerts`);
    }
    
    console.log('Creating timeline_events table...');
    await client.query(`
      CREATE TABLE timeline_events (
        id VARCHAR(15) PRIMARY KEY,
        patient_id VARCHAR(10) REFERENCES patients(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        type timeline_event_type NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Seeding timeline events...');
    if (healthcareData.patientTimelines) {
      let eventCount = 0;
      for (const patientId in healthcareData.patientTimelines) {
        const events = healthcareData.patientTimelines[patientId];
        
        for (const event of events) {
          // Handle event type enum validation
          let eventType = event.type;
          if (!['admission', 'visit', 'test', 'medication', 'discharge', 'surgery', 'other'].includes(eventType)) {
            eventType = 'other'; // Default
          }
          
          await client.query(`
            INSERT INTO timeline_events
            (id, patient_id, date, title, description, type)
            VALUES ($1, $2, $3, $4, $5, $6::timeline_event_type)
          `, [
            event.id,
            patientId,
            event.date,
            event.title,
            event.description,
            eventType
          ]);
          eventCount++;
        }
      }
      console.log(`Seeded ${eventCount} timeline events`);
    }
    
    console.log('Creating medications and patient_medications tables...');
    await client.query(`
      CREATE TABLE medications (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE patient_medications (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(10) REFERENCES patients(id) ON DELETE CASCADE,
        medication_name VARCHAR(100) NOT NULL,
        dosage VARCHAR(50),
        frequency VARCHAR(50),
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Seeding medications and patient medications...');
    // Collect all unique medications and create the patient-medication relationships
    const uniqueMeds = new Set();
    let patientMedCount = 0;
    
    for (const patient of healthcareData.patients) {
      if (patient.medications && Array.isArray(patient.medications)) {
        for (const med of patient.medications) {
          uniqueMeds.add(med);
          
          await client.query(`
            INSERT INTO medications (name)
            VALUES ($1)
            ON CONFLICT (name) DO NOTHING
          `, [med]);
          
          await client.query(`
            INSERT INTO patient_medications 
            (patient_id, medication_name)
            VALUES ($1, $2)
          `, [patient.id, med]);
          
          patientMedCount++;
        }
      }
    }
    console.log(`Seeded ${uniqueMeds.size} medications and ${patientMedCount} patient medication records`);
    
    console.log('Creating allergies and patient_allergies tables...');
    await client.query(`
      CREATE TABLE allergies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE patient_allergies (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(10) REFERENCES patients(id) ON DELETE CASCADE,
        allergy_name VARCHAR(100) NOT NULL,
        severity VARCHAR(20),
        reaction TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Seeding allergies and patient allergies...');
    // Collect all unique allergies and create the patient-allergy relationships
    const uniqueAllergies = new Set();
    let patientAllergyCount = 0;
    
    for (const patient of healthcareData.patients) {
      if (patient.allergies && Array.isArray(patient.allergies)) {
        for (const allergy of patient.allergies) {
          if (allergy !== 'None known' && allergy !== 'None') {
            uniqueAllergies.add(allergy);
            
            await client.query(`
              INSERT INTO allergies (name)
              VALUES ($1)
              ON CONFLICT (name) DO NOTHING
            `, [allergy]);
            
            await client.query(`
              INSERT INTO patient_allergies 
              (patient_id, allergy_name)
              VALUES ($1, $2)
            `, [patient.id, allergy]);
            
            patientAllergyCount++;
          }
        }
      }
    }
    console.log(`Seeded ${uniqueAllergies.size} allergies and ${patientAllergyCount} patient allergy records`);

    await client.query('COMMIT');
    console.log('Database reset and seeding complete!');
    
    // Final check - verify all patients have data
    const patientCount = await client.query('SELECT COUNT(*) FROM patients');
    console.log(`Total patients in database: ${patientCount.rows[0].count}`);
    
    // Check patient relationships
    const patientStats = await client.query(`
      SELECT 
        COUNT(DISTINCT p.id) AS total_patients,
        COUNT(DISTINCT pvc.patient_id) AS patients_with_vitals,
        COUNT(DISTINCT pvh.patient_id) AS patients_with_vital_history,
        COUNT(DISTINCT vsa.patient_id) AS patients_with_alerts,
        COUNT(DISTINCT pm.patient_id) AS patients_with_medications,
        COUNT(DISTINCT pa.patient_id) AS patients_with_allergies,
        COUNT(DISTINCT te.patient_id) AS patients_with_timeline
      FROM 
        patients p
        LEFT JOIN patient_vitals_current pvc ON p.id = pvc.patient_id
        LEFT JOIN patient_vital_history pvh ON p.id = pvh.patient_id
        LEFT JOIN vital_sign_alerts vsa ON p.id = vsa.patient_id
        LEFT JOIN patient_medications pm ON p.id = pm.patient_id
        LEFT JOIN patient_allergies pa ON p.id = pa.patient_id
        LEFT JOIN timeline_events te ON p.id = te.patient_id
    `);
    
    console.log('Patient data statistics:');
    console.log(patientStats.rows[0]);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in database reset and seeding:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run directly if called from command line
if (require.main === module) {
  dropAndCreateAllTables()
    .then(() => {
      console.log('Database reset and seeding completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('Database reset and seeding failed:', err);
      process.exit(1);
    });
}

module.exports = dropAndCreateAllTables;