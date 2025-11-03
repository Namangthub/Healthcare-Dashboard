const db = require('../config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import healthcareData from frontend project
let healthcareData;
try {
  // Try to import from the frontend project directory
  const frontendPath = path.join(__dirname, '../../../healthcare-dashboard/src/data/healthcareData.js');
  
  if (fs.existsSync(frontendPath)) {
    // Handle ESM vs CommonJS format
    const importedData = require(frontendPath);
    
    // Detect if the import is ES module or CommonJS
    if (importedData.__esModule && importedData.default) {
      healthcareData = importedData.default;
      console.log('Loaded healthcareData.js as ES module');
    } else {
      healthcareData = importedData;
      console.log('Loaded healthcareData.js as CommonJS module');
    }
    
    console.log('Using healthcareData.js from frontend project');
  } else {
    throw new Error('Could not find healthcareData.js in frontend project');
  }
} catch (error) {
  console.error('Error loading healthcareData.js:', error.message);
  process.exit(1);
}


async function reseedDatabase() {
  const client = await db.pool.connect();
  
  // Add this helper function at the beginning of the reseedDatabase function
  function validateDate(dateStr) {
    if (!dateStr || dateStr === 'TBD' || dateStr === 'N/A') {
      return null;
    }
    
    // Try to parse the date, return null if invalid
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return null;
      }
      return dateStr;
    } catch (e) {
      return null;
    }
  }

  try {
    console.log('Starting complete database reset and reseeding...');
    
    // Start transaction for atomicity
    await client.query('BEGIN');

    // 1. Drop all existing tables
    console.log('Dropping all existing tables and types...');
    await client.query(`
      -- Drop tables with foreign key dependencies first
      DROP TABLE IF EXISTS patient_allergies CASCADE;
      DROP TABLE IF EXISTS allergies CASCADE;
      DROP TABLE IF EXISTS patient_medications CASCADE;
      DROP TABLE IF EXISTS medications CASCADE;
      DROP TABLE IF EXISTS timeline_events CASCADE;
      DROP TABLE IF EXISTS vital_sign_alerts CASCADE;
      DROP TABLE IF EXISTS patient_vital_history CASCADE;
      DROP TABLE IF EXISTS patient_vitals_current CASCADE;
      DROP TABLE IF EXISTS appointments CASCADE;
      DROP TABLE IF EXISTS patients CASCADE;
      DROP TABLE IF EXISTS staff_schedule CASCADE;
      DROP TABLE IF EXISTS staff CASCADE;
      DROP TABLE IF EXISTS department_financials CASCADE;
      DROP TABLE IF EXISTS quality_patient_satisfaction CASCADE;
      DROP TABLE IF EXISTS quality_wait_times CASCADE;
      DROP TABLE IF EXISTS quality_readmission_rates CASCADE;
      DROP TABLE IF EXISTS department_staff CASCADE;
      DROP TABLE IF EXISTS departments CASCADE;
      DROP TABLE IF EXISTS financial_monthly CASCADE;
      DROP TABLE IF EXISTS payment_methods CASCADE;
      DROP TABLE IF EXISTS overview_statistics CASCADE;
      DROP TABLE IF EXISTS demographics_age CASCADE;
      DROP TABLE IF EXISTS demographics_gender CASCADE; 
      DROP TABLE IF EXISTS demographics_insurance CASCADE;
      DROP TABLE IF EXISTS recent_activities CASCADE;
      
      -- Drop custom types
      DROP TYPE IF EXISTS patient_status CASCADE;
      DROP TYPE IF EXISTS patient_severity CASCADE;
      DROP TYPE IF EXISTS staff_status CASCADE;
      DROP TYPE IF EXISTS timeline_event_type CASCADE;
    `);
    
    // 2. Create new types
    console.log('Creating custom types...');
    await client.query(`
      CREATE TYPE patient_status AS ENUM ('In Treatment', 'Scheduled', 'Critical', 'Discharged');
      CREATE TYPE patient_severity AS ENUM ('High', 'Medium', 'Low');
      CREATE TYPE staff_status AS ENUM ('On Duty', 'Off Duty', 'On Call', 'On Leave', 'Available', 'In Surgery');
      CREATE TYPE timeline_event_type AS ENUM ('admission', 'visit', 'test', 'medication', 'discharge', 'surgery', 'other');
    `);

    // 3. Create all tables with proper column names
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
    
    console.log('Creating department_staff table...');
    await client.query(`
      CREATE TABLE department_staff (
        department_id INTEGER PRIMARY KEY REFERENCES departments(id) ON DELETE CASCADE,
        doctors INTEGER NOT NULL DEFAULT 0,
        nurses INTEGER NOT NULL DEFAULT 0,
        support INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
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
        patients INTEGER NOT NULL DEFAULT 0,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        specialty VARCHAR(100) NOT NULL,
        rating DECIMAL(3,1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
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
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        insurance VARCHAR(50) NOT NULL,
        emergency_contact TEXT NOT NULL,
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        doctor_id VARCHAR(10) REFERENCES staff(id) ON DELETE SET NULL,
        admission_date DATE NOT NULL,
        status patient_status NOT NULL,
        severity patient_severity NOT NULL,
        room VARCHAR(20) NOT NULL,
        diagnosis TEXT NOT NULL,
        last_visit DATE,
        next_appointment DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
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
    
    console.log('Creating medications table...');
    await client.query(`
      CREATE TABLE medications (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating patient_medications table...');
    await client.query(`
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
    
    console.log('Creating allergies table...');
    await client.query(`
      CREATE TABLE allergies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating patient_allergies table...');
    await client.query(`
      CREATE TABLE patient_allergies (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(10) REFERENCES patients(id) ON DELETE CASCADE,
        allergy_name VARCHAR(100) NOT NULL,
        severity VARCHAR(20),
        reaction TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating appointments table...');
    await client.query(`
      CREATE TABLE appointments (
        id VARCHAR(20) PRIMARY KEY,
        patient_id VARCHAR(10) REFERENCES patients(id) ON DELETE CASCADE,
        staff_id VARCHAR(10) REFERENCES staff(id) ON DELETE SET NULL,
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        patient_name VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(20) NOT NULL,
        department VARCHAR(50) NOT NULL,
        doctor VARCHAR(100),
        type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        duration INTEGER NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating financial tables...');
    await client.query(`
      CREATE TABLE financial_monthly (
        id SERIAL PRIMARY KEY,
        month VARCHAR(20) NOT NULL,
        revenue NUMERIC(12,2) NOT NULL,
        expenses NUMERIC(12,2) NOT NULL,
        profit NUMERIC(12,2) NOT NULL,
        patients INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE department_financials (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        department VARCHAR(100) NOT NULL,
        revenue NUMERIC(12,2) NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE payment_methods (
        id SERIAL PRIMARY KEY,
        method VARCHAR(50) NOT NULL,
        amount NUMERIC(12,2) NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating quality metrics tables...');
    await client.query(`
      CREATE TABLE quality_patient_satisfaction (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        department VARCHAR(100) NOT NULL,
        score DECIMAL(3,1) NOT NULL,
        responses INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE quality_wait_times (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        department VARCHAR(100) NOT NULL,
        avg_wait INTEGER NOT NULL,
        target INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE quality_readmission_rates (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        department VARCHAR(100) NOT NULL,
        rate DECIMAL(5,2) NOT NULL,
        target DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating demographics tables...');
    await client.query(`
      CREATE TABLE demographics_age (
        id SERIAL PRIMARY KEY,
        age_group VARCHAR(30) NOT NULL,
        label VARCHAR(30) NOT NULL,
        count INTEGER NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        color VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE demographics_gender (
        id SERIAL PRIMARY KEY,
        gender VARCHAR(30) NOT NULL,
        count INTEGER NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        color VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE demographics_insurance (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        count INTEGER NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        color VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating overview_statistics table...');
    await client.query(`
      CREATE TABLE overview_statistics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        value NUMERIC(12,2) NOT NULL,
        category VARCHAR(50),
        description TEXT,
        unit VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating recent_activities table...');
    await client.query(`
      CREATE TABLE recent_activities (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        timestamp VARCHAR(50) NOT NULL,
        priority VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 4. Seed departments
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
        dept.code,
        dept.totalPatients,
        dept.todayPatients,
        dept.avgWaitTime,
        dept.satisfaction,
        dept.revenue,
        dept.capacity,
        dept.currentOccupancy,
        dept.criticalCases
      ]);

      // Add department staff counts
      if (dept.staff) {
        await client.query(`
          INSERT INTO department_staff
            (department_id, doctors, nurses, support)
          VALUES ($1, $2, $3, $4)
        `, [
          dept.id,
          dept.staff.doctors,
          dept.staff.nurses,
          dept.staff.support
        ]);
      }
    }
    
    // 5. Seed staff
    console.log('Seeding staff...');
    for (const staff of healthcareData.staff) {
      // Get department ID for staff
      const deptQuery = await client.query(
        'SELECT id FROM departments WHERE name = $1',
        [staff.department]
      );
      
      const deptId = deptQuery.rows.length > 0 ? deptQuery.rows[0].id : null;
      
      // Parse name components correctly
      const fullName = staff.fullName;
      let firstName = staff.firstName;
      let lastName = staff.lastName;
      
      // Remove 'Dr.' prefix from firstName if it exists
      if (firstName.startsWith('Dr. ')) {
        firstName = firstName.substring(4);
      }
      
      await client.query(`
        INSERT INTO staff
          (id, first_name, last_name, full_name, role, department_id, status,
          shift, experience, patients, phone, email, specialty, rating)
        VALUES ($1, $2, $3, $4, $5, $6, $7::staff_status, $8, $9, $10, $11, $12, $13, $14)
      `, [
        staff.id,
        firstName,
        lastName,
        fullName,
        staff.role,
        deptId,
        staff.status || 'Available',
        staff.shift,
        staff.experience,
        staff.patients || 0,
        staff.phone,
        staff.email,
        staff.specialty,
        staff.rating
      ]);
    }
    
    // 6. Seed patients
    console.log('Seeding patients...');
    for (const patient of healthcareData.patients) {
      // Get department ID
      const deptQuery = await client.query(
        'SELECT id FROM departments WHERE name = $1',
        [patient.department]
      );
      const deptId = deptQuery.rows.length > 0 ? deptQuery.rows[0].id : null;
      
      // Get doctor ID
      const doctorQuery = await client.query(
        'SELECT id FROM staff WHERE full_name = $1',
        [patient.doctor]
      );
      const doctorId = doctorQuery.rows.length > 0 ? doctorQuery.rows[0].id : null;
      
      // Validate status and severity for ENUM types
      let status = patient.status;
      if (!['In Treatment', 'Scheduled', 'Critical', 'Discharged'].includes(status)) {
        status = 'In Treatment'; // Default
      }
      
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
        patient.fullName,
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
        patient.nextAppointment === 'TBD' ? null : (patient.nextAppointment || null),
        patient.notes || null
      ]);
      
      // Add patient vitals
      if (patient.vitals) {
        await client.query(`
          INSERT INTO patient_vitals_current
            (patient_id, blood_pressure, heart_rate, temperature, oxygen_saturation, 
             weight, height)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          patient.id,
          patient.vitals.bloodPressure,
          patient.vitals.heartRate,
          patient.vitals.temperature,
          patient.vitals.oxygenSaturation,
          patient.vitals.weight || null,
          patient.vitals.height || null
        ]);
      }
      
      // Add medications
      if (patient.medications && Array.isArray(patient.medications)) {
        for (const medication of patient.medications) {
          // Add to medications table if not exists
          await client.query(`
            INSERT INTO medications (name)
            VALUES ($1)
            ON CONFLICT (name) DO NOTHING
          `, [medication]);
          
          // Add patient-medication relationship
          await client.query(`
            INSERT INTO patient_medications 
              (patient_id, medication_name)
            VALUES ($1, $2)
          `, [patient.id, medication]);
        }
      }
      
      // Add allergies
      if (patient.allergies && Array.isArray(patient.allergies)) {
        for (const allergy of patient.allergies) {
          if (allergy !== 'None known' && allergy !== 'None') {
            // Add to allergies table if not exists
            await client.query(`
              INSERT INTO allergies (name)
              VALUES ($1)
              ON CONFLICT (name) DO NOTHING
            `, [allergy]);
            
            // Add patient-allergy relationship
            await client.query(`
              INSERT INTO patient_allergies 
                (patient_id, allergy_name)
              VALUES ($1, $2)
            `, [patient.id, allergy]);
          }
        }
      }
    }
    
    // 7. Seed patient vital history
    console.log('Seeding patient vital history...');
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
        } catch (error) {
          if (error.code === '23505') { // Duplicate key error
            console.log(`Skipping duplicate vital record for ${patientId} on ${record.date}`);
          } else {
            throw error;
          }
        }
      }
    }
    
    // 8. Seed vital sign alerts
    console.log('Seeding vital sign alerts...');
    if (healthcareData.vitalSignsAlerts) {
      for (const alert of healthcareData.vitalSignsAlerts) {
        // Validate severity for ENUM type
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
    }
    
    // 9. Seed patient timelines
    console.log('Seeding patient timelines...');
    for (const patientId in healthcareData.patientTimelines) {
      const timeline = healthcareData.patientTimelines[patientId];
      
      for (const event of timeline) {
        // Validate event type for ENUM type
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
      }
    }
    
    // 10. Seed demographics
    console.log('Seeding demographics...');
    // Age demographics
    for (const item of healthcareData.demographics.byAge) {
      await client.query(`
        INSERT INTO demographics_age
          (age_group, label, count, percentage, color)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        item.ageGroup,
        item.label,
        item.count,
        item.percentage,
        item.color
      ]);
    }
    
    // Gender demographics
    for (const item of healthcareData.demographics.byGender) {
      await client.query(`
        INSERT INTO demographics_gender
          (gender, count, percentage, color)
        VALUES ($1, $2, $3, $4)
      `, [
        item.gender,
        item.count,
        item.percentage,
        item.color
      ]);
    }
    
    // Insurance demographics
    for (const item of healthcareData.demographics.byInsurance) {
      await client.query(`
        INSERT INTO demographics_insurance
          (type, count, percentage, color)
        VALUES ($1, $2, $3, $4)
      `, [
        item.type,
        item.count,
        item.percentage,
        item.color
      ]);
    }
    
    // 11. Seed financial data
    console.log('Seeding financial data...');
    // Monthly financial data
    for (const item of healthcareData.financial.monthly) {
      await client.query(`
        INSERT INTO financial_monthly
          (month, revenue, expenses, profit, patients)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        item.month,
        item.revenue,
        item.expenses,
        item.profit,
        item.patients
      ]);
    }
    
    // Department financials
    for (const item of healthcareData.financial.byDepartment) {
      // Get department ID
      const deptQuery = await client.query(
        'SELECT id FROM departments WHERE name = $1',
        [item.department]
      );
      const deptId = deptQuery.rows.length > 0 ? deptQuery.rows[0].id : null;
      
      await client.query(`
        INSERT INTO department_financials
          (department_id, department, revenue, percentage)
        VALUES ($1, $2, $3, $4)
      `, [
        deptId,
        item.department,
        item.revenue,
        item.percentage
      ]);
    }
    
    // Payment methods
    for (const item of healthcareData.financial.paymentMethods) {
      await client.query(`
        INSERT INTO payment_methods
          (method, amount, percentage)
        VALUES ($1, $2, $3)
      `, [
        item.method,
        item.amount,
        item.percentage
      ]);
    }
    
    // 12. Seed quality metrics
    console.log('Seeding quality metrics...');
    // Patient satisfaction
    for (const item of healthcareData.quality.patientSatisfaction.byDepartment) {
      // Get department ID
      const deptQuery = await client.query(
        'SELECT id FROM departments WHERE name = $1',
        [item.department]
      );
      const deptId = deptQuery.rows.length > 0 ? deptQuery.rows[0].id : null;
      
      await client.query(`
        INSERT INTO quality_patient_satisfaction
          (department_id, department, score, responses)
        VALUES ($1, $2, $3, $4)
      `, [
        deptId,
        item.department,
        item.score,
        item.responses
      ]);
    }
    
    // Wait times
    for (const item of healthcareData.quality.waitTimes.byDepartment) {
      // Get department ID
      const deptQuery = await client.query(
        'SELECT id FROM departments WHERE name = $1',
        [item.department]
      );
      const deptId = deptQuery.rows.length > 0 ? deptQuery.rows[0].id : null;
      
      await client.query(`
        INSERT INTO quality_wait_times
          (department_id, department, avg_wait, target)
        VALUES ($1, $2, $3, $4)
      `, [
        deptId,
        item.department,
        item.avgWait,
        item.target
      ]);
    }
    
    // Readmission rates
    for (const item of healthcareData.quality.readmissionRates.byDepartment) {
      // Get department ID
      const deptQuery = await client.query(
        'SELECT id FROM departments WHERE name = $1',
        [item.department]
      );
      const deptId = deptQuery.rows.length > 0 ? deptQuery.rows[0].id : null;
      
      await client.query(`
        INSERT INTO quality_readmission_rates
          (department_id, department, rate, target)
        VALUES ($1, $2, $3, $4)
      `, [
        deptId,
        item.department,
        item.rate,
        item.target
      ]);
    }
    
    // 13. Seed overview statistics
    console.log('Seeding overview statistics...');
    const stats = [
      { name: 'totalPatients', value: healthcareData.overview.totalPatients, category: 'patients', description: 'Total registered patients', unit: null },
      { name: 'activePatients', value: healthcareData.overview.activePatients, category: 'patients', description: 'Currently active patients', unit: null },
      { name: 'newPatientsToday', value: healthcareData.overview.newPatientsToday, category: 'patients', description: 'New patients registered today', unit: null },
      { name: 'totalAppointments', value: healthcareData.overview.totalAppointments, category: 'appointments', description: 'Total scheduled appointments', unit: null },
      { name: 'todayAppointments', value: healthcareData.overview.todayAppointments, category: 'appointments', description: 'Appointments scheduled for today', unit: null },
      { name: 'completedAppointments', value: healthcareData.overview.completedAppointments, category: 'appointments', description: 'Appointments completed today', unit: null },
      { name: 'cancelledAppointments', value: healthcareData.overview.cancelledAppointments, category: 'appointments', description: 'Appointments cancelled today', unit: null },
      { name: 'pendingResults', value: healthcareData.overview.pendingResults, category: 'results', description: 'Test results pending', unit: null },
      { name: 'criticalAlerts', value: healthcareData.overview.criticalAlerts, category: 'alerts', description: 'Critical patient alerts', unit: null },
      { name: 'totalBeds', value: healthcareData.overview.totalBeds, category: 'capacity', description: 'Total available beds', unit: null },
      { name: 'occupiedBeds', value: healthcareData.overview.occupiedBeds, category: 'capacity', description: 'Currently occupied beds', unit: null },
      { name: 'availableBeds', value: healthcareData.overview.availableBeds, category: 'capacity', description: 'Currently available beds', unit: null },
      { name: 'bedOccupancyRate', value: healthcareData.overview.bedOccupancyRate, category: 'capacity', description: 'Percentage of beds occupied', unit: '%' },
      { name: 'totalStaff', value: healthcareData.overview.totalStaff, category: 'staff', description: 'Total staff members', unit: null },
      { name: 'staffOnDuty', value: healthcareData.overview.staffOnDuty, category: 'staff', description: 'Staff currently on duty', unit: null },
      { name: 'doctorsAvailable', value: healthcareData.overview.doctorsAvailable, category: 'staff', description: 'Doctors available', unit: null },
      { name: 'nursesOnDuty', value: healthcareData.overview.nursesOnDuty, category: 'staff', description: 'Nurses on duty', unit: null },
      { name: 'averageWaitTime', value: healthcareData.overview.averageWaitTime, category: 'performance', description: 'Average patient wait time', unit: 'minutes' },
      { name: 'patientSatisfactionScore', value: healthcareData.overview.patientSatisfactionScore, category: 'performance', description: 'Overall patient satisfaction score', unit: 'rating' },
      { name: 'revenue', value: healthcareData.overview.revenue, category: 'financial', description: 'Monthly revenue', unit: '$' },
      { name: 'expenses', value: healthcareData.overview.expenses, category: 'financial', description: 'Monthly expenses', unit: '$' }
    ];
    
    for (const stat of stats) {
      await client.query(`
        INSERT INTO overview_statistics
          (name, value, category, description, unit)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        stat.name,
        stat.value,
        stat.category,
        stat.description,
        stat.unit
      ]);
    }
    
    // 14. Seed recent activities
    console.log('Seeding recent activities...');
    for (const activity of healthcareData.recentActivities) {
      await client.query(`
        INSERT INTO recent_activities
          (id, type, message, timestamp, priority)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        activity.id,
        activity.type,
        activity.message,
        activity.timestamp,
        activity.priority
      ]);
    }
    
    // 15. Generate synthetic appointments
    console.log('Creating synthetic appointments from patient data...');
    // Use last_visit and next_appointment to generate appointments
    const patients = await client.query('SELECT * FROM patients');
    
    for (const patient of patients.rows) {
      // Get doctor info based on doctor_id
      const doctorQuery = await client.query(
        'SELECT * FROM staff WHERE id = $1',
        [patient.doctor_id]
      );
      const doctor = doctorQuery.rows.length > 0 ? doctorQuery.rows[0] : null;
      
      // Create appointment from last_visit if it exists
      if (patient.last_visit) {
        // Calculate a consistent time based on patient ID
        // This ensures the same patient always gets the same appointment time
        const patientIdSum = patient.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const hour = 8 + (patientIdSum % 8);
        const minute = (patientIdSum * 3) % 60;
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour > 12 ? hour - 12 : hour;
        const time = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
        
        await client.query(`
          INSERT INTO appointments
            (id, patient_id, staff_id, department_id, patient_name, date, time, department, doctor,
             type, status, duration, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          `APT-${patient.id}-LV`,
          patient.id,
          doctor ? doctor.id : null,
          patient.department_id,
          patient.full_name,
          patient.last_visit,
          time,
          patient.department_name || patient.department_id,
          doctor ? doctor.full_name : 'Unassigned',
          'Check-up',
          'Completed',
          30 + (patientIdSum % 30),
          `Regular check-up for ${patient.diagnosis}`
        ]);
      }
      
      // Create appointment from next_appointment if it exists
      if (patient.next_appointment) {
        // Similar time calculation but offset by 2 hours
        const patientIdSum = patient.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const hour = 10 + (patientIdSum % 6);
        const minute = (patientIdSum * 7) % 60;
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour > 12 ? hour - 12 : hour;
        const time = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
        
        await client.query(`
          INSERT INTO appointments
            (id, patient_id, staff_id, department_id, patient_name, date, time, department, doctor,
             type, status, duration, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          `APT-${patient.id}-NA`,
          patient.id,
          doctor ? doctor.id : null,
          patient.department_id,
          patient.full_name,
          patient.next_appointment,
          time,
          patient.department_name || patient.department_id,
          doctor ? doctor.full_name : 'Unassigned',
          'Follow-up',
          'Scheduled',
          30 + (patientIdSum % 45),
          `Follow-up for ${patient.diagnosis}`
        ]);
      }
    }

    // Commit all changes
    await client.query('COMMIT');
    
    // Print stats
    const stats_query = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM departments) as departments,
        (SELECT COUNT(*) FROM staff) as staff,
        (SELECT COUNT(*) FROM patients) as patients,
        (SELECT COUNT(*) FROM appointments) as appointments,
        (SELECT COUNT(*) FROM timeline_events) as timeline_events,
        (SELECT COUNT(*) FROM patient_vital_history) as vital_history,
        (SELECT COUNT(*) FROM vital_sign_alerts) as alerts
    `);
    
    console.log('Database reseeding complete!');
    console.log('Seeded entities:', stats_query.rows[0]);
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error during database reseeding:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run directly if called from command line
if (require.main === module) {
  reseedDatabase()
    .then(() => {
      console.log('Database reseeding completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('Database reseeding failed:', err);
      process.exit(1);
    });
}

module.exports = reseedDatabase;