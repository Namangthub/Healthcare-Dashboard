const db = require('../config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get imported data from healthcareData.js
const healthcareDataPath = path.resolve(__dirname, '../../../healthcare-dashboard/src/data/healthcareData.js');
let healthcareData;

try {
  const importedData = require(healthcareDataPath);
  // Handle ES Module
  if (importedData.__esModule && importedData.default) {
    healthcareData = importedData.default;
  } else {
    healthcareData = importedData;
  }
  console.log('Successfully loaded healthcare data');
} catch (error) {
  console.error('Error loading healthcare data:', error.message);
  process.exit(1);
}

async function seedAppointments() {
  const client = await db.pool.connect();
  
  try {
    console.log('Starting appointments seeding...');
    
    await client.query('BEGIN');

    // First, check if appointments table exists
    try {
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'appointments'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        console.log('Creating appointments table...');
        await client.query(`
          CREATE TABLE IF NOT EXISTS appointments (
            id VARCHAR(50) PRIMARY KEY,
            patient_id VARCHAR(50) NOT NULL,
            staff_id VARCHAR(50),
            department_id INTEGER,
            date DATE NOT NULL,
            time VARCHAR(20) NOT NULL, 
            type VARCHAR(50) NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
            duration INTEGER NOT NULL DEFAULT 30,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
      }
    } catch (error) {
      console.error('Error checking/creating appointments table:', error.message);
    }

    // 4. Seed Appointments
    console.log('Seeding appointments...');
    let appointmentCount = 0;
    
    // Generate current week dates
    const today = new Date();
    const currentWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + i);
      currentWeek.push(date.toISOString().split('T')[0]);
    }
    
    // Get sample appointments directly if they exist
    if (healthcareData.appointments && Array.isArray(healthcareData.appointments.upcoming)) {
      console.log(`Found ${healthcareData.appointments.upcoming.length} sample appointments in data`);
      
      for (const appointment of healthcareData.appointments.upcoming) {
        try {
          // Find patient ID
          let patientId = null;
          if (appointment.patientName) {
            const patientQuery = `SELECT id FROM patients WHERE full_name LIKE $1 LIMIT 1`;
            const patientResult = await client.query(patientQuery, [`%${appointment.patientName}%`]);
            if (patientResult.rows.length > 0) {
              patientId = patientResult.rows[0].id;
            } else {
              // Use first patient as fallback
              const fallbackPatient = await client.query(`SELECT id FROM patients LIMIT 1`);
              patientId = fallbackPatient.rows[0]?.id;
            }
          }
          
          // Find staff ID (doctor)
          let staffId = null;
          if (appointment.doctor) {
            const staffQuery = `SELECT id FROM staff WHERE full_name LIKE $1 LIMIT 1`;
            const staffResult = await client.query(staffQuery, [`%${appointment.doctor}%`]);
            if (staffResult.rows.length > 0) {
              staffId = staffResult.rows[0].id;
            }
          }
          
          // Find department ID
          let departmentId = null;
          if (appointment.department) {
            const deptQuery = `SELECT id FROM departments WHERE name LIKE $1 LIMIT 1`;
            const deptResult = await client.query(deptQuery, [`%${appointment.department}%`]);
            if (deptResult.rows.length > 0) {
              departmentId = deptResult.rows[0].id;
            }
          }
          
          if (!patientId) {
            console.error(`Cannot find patient for appointment: ${appointment.patientName}`);
            continue;
          }
          
          // Generate unique ID
          const appointmentId = `APT-${Date.now()}-${appointmentCount}`;
          
          // Prepare date and time
          const date = appointment.date || currentWeek[Math.floor(Math.random() * currentWeek.length)];
          const time = appointment.time || '09:00';
          
          const query = `
            INSERT INTO appointments
            (id, patient_id, staff_id, department_id, date, time, type, status, duration, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO NOTHING
          `;
          
          await client.query(query, [
            appointmentId,
            patientId,
            staffId,
            departmentId,
            date,
            time,
            appointment.type || 'Checkup',
            appointment.status || 'Scheduled',
            appointment.duration || 30,
            appointment.notes || ''
          ]);
          
          appointmentCount++;
        } catch (error) {
          console.error(`Error creating appointment:`, error.message);
        }
      }
    }
    // Generate synthetic appointments if no sample data
    else {
      console.log('No sample appointments found, generating synthetic data...');
      
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      // Get all patients
      const patientsResult = await client.query('SELECT id, full_name FROM patients');
      const patients = patientsResult.rows;
      
      // Get all staff
      const staffResult = await client.query('SELECT id, full_name FROM staff WHERE role LIKE $1', ['%Doctor%']);
      const doctors = staffResult.rows.length > 0 ? staffResult.rows : [{ id: null, full_name: 'Unassigned' }];
      
      // Get all departments
      const deptResult = await client.query('SELECT id, name FROM departments');
      const departments = deptResult.rows;
      
      // Create 20 appointments spread across the week
      for (let i = 0; i < 20; i++) {
        try {
          // Randomly select patient, doctor and department
          const patient = patients[Math.floor(Math.random() * patients.length)];
          const doctor = doctors[Math.floor(Math.random() * doctors.length)];
          const department = departments[Math.floor(Math.random() * departments.length)];
          
          // Select day and generate time
          const dayIndex = Math.floor(Math.random() * 7);
          const appointmentDate = currentWeek[dayIndex];
          
          // Generate time between 8 AM and 5 PM
          const hour = 8 + Math.floor(Math.random() * 9);
          const minute = Math.floor(Math.random() * 4) * 15;
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Generate appointment types
          const types = ['Routine Checkup', 'Follow-up', 'Emergency', 'Consultation', 'Procedure', 'Vaccination'];
          const type = types[Math.floor(Math.random() * types.length)];
          
          // Determine status
          const statuses = ['Scheduled', 'Completed', 'Cancelled', 'In Progress'];
          const statusWeights = [0.5, 0.3, 0.1, 0.1]; // 50% scheduled, 30% completed, etc.
          
          let statusIndex = 0;
          const rand = Math.random();
          let cumulativeWeight = 0;
          
          for (let j = 0; j < statuses.length; j++) {
            cumulativeWeight += statusWeights[j];
            if (rand < cumulativeWeight) {
              statusIndex = j;
              break;
            }
          }
          
          const status = statuses[statusIndex];
          
          const appointmentId = `APT-${patient.id.replace('PAT', '')}-${appointmentDate.replace(/-/g, '')}${i}`;
          
          const query = `
            INSERT INTO appointments
            (id, patient_id, staff_id, department_id, date, time, type, status, duration, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO NOTHING
          `;
          
          await client.query(query, [
            appointmentId,
            patient.id,
            doctor.id,
            department.id,
            appointmentDate,
            time,
            type,
            status,
            30, // Default duration
            `Appointment for ${patient.full_name}${doctor.id ? ` with ${doctor.full_name}` : ''}`
          ]);
          
          appointmentCount++;
        } catch (error) {
          console.error(`Error creating synthetic appointment:`, error.message);
        }
      }
    }
    
    console.log(`Added ${appointmentCount} appointments`);

    await client.query('COMMIT');
    console.log('Appointments seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding appointments:', error);
  } finally {
    client.release();
  }
}

// Run directly if called from command line
if (require.main === module) {
  seedAppointments()
    .then(() => {
      console.log('Appointments seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('Appointments seeding error:', err);
      process.exit(1);
    });
}

module.exports = seedAppointments;