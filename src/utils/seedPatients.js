// src/scripts/dropAndCreateAllTables.js
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// For __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading healthcareData.js dynamically
let healthcareData;
try {
  const frontendPath = path.join(__dirname, '../../../healthcare-dashboard/src/data/healthcareData.js');
  if (fs.existsSync(frontendPath)) {
    healthcareData = (await import(frontendPath)).default;
    console.log('✅ Using healthcareData.js from frontend project');
  } else {
    healthcareData = (await import('../../data/healthcareData.js')).default;
    console.log('✅ Using local healthcareData.js');
  }
} catch (error) {
  console.error('❌ Error loading healthcareData.js:', error.message);
  process.exit(1);
}

export async function dropAndCreateAllTables() {
  const client = await db.pool.connect();

  try {
    console.log('🚀 Starting database reset and seeding...');
    await client.query('BEGIN');

    console.log('🧹 Dropping all existing tables and types...');
    await client.query(`
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
      DROP TYPE IF EXISTS patient_status CASCADE;
      DROP TYPE IF EXISTS patient_severity CASCADE;
      DROP TYPE IF EXISTS staff_status CASCADE;
      DROP TYPE IF EXISTS timeline_event_type CASCADE;
    `);

    console.log('📦 Creating custom ENUM types...');
    await client.query(`
      CREATE TYPE patient_status AS ENUM ('In Treatment', 'Scheduled', 'Critical', 'Discharged');
      CREATE TYPE patient_severity AS ENUM ('High', 'Medium', 'Low');
      CREATE TYPE staff_status AS ENUM ('On Duty', 'Off Duty', 'On Call', 'On Leave', 'Available', 'In Surgery');
      CREATE TYPE timeline_event_type AS ENUM ('admission', 'visit', 'test', 'medication', 'discharge', 'surgery', 'other');
    `);

    console.log('🏥 Creating departments table...');
    await client.query(`
      CREATE TABLE departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(10) NOT NULL UNIQUE,
        total_patients INTEGER DEFAULT 0,
        today_patients INTEGER DEFAULT 0,
        avg_wait_time INTEGER DEFAULT 0,
        satisfaction DECIMAL(3,1) DEFAULT 0,
        revenue NUMERIC(12,2) DEFAULT 0,
        capacity INTEGER DEFAULT 0,
        current_occupancy INTEGER DEFAULT 0,
        critical_cases INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('🌱 Seeding departments...');
    for (const dept of healthcareData.departments) {
      await client.query(
        `
        INSERT INTO departments
        (id, name, code, total_patients, today_patients, avg_wait_time, satisfaction, revenue, capacity, current_occupancy, critical_cases)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
        [
          dept.id,
          dept.name,
          dept.code || dept.name.substring(0, 3).toUpperCase(),
          dept.totalPatients || 0,
          dept.todayPatients || 0,
          dept.avgWaitTime || 0,
          dept.satisfaction || 0,
          dept.revenue || 0,
          dept.capacity || 0,
          dept.currentOccupancy || 0,
          dept.criticalCases || 0
        ]
      );
    }
    console.log(`✅ Seeded ${healthcareData.departments.length} departments`);

    console.log('👨‍⚕️ Creating staff table...');
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
        patient_count INTEGER DEFAULT 0,
        phone VARCHAR(20),
        email VARCHAR(100),
        specialty VARCHAR(100),
        rating DECIMAL(3,1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('🌱 Seeding staff...');
    const deptMap = {};
    const depts = await client.query('SELECT id, name FROM departments');
    depts.rows.forEach(d => (deptMap[d.name] = d.id));

    for (const staffMember of healthcareData.staff) {
      const deptId = deptMap[staffMember.department] || null;
      let firstName = staffMember.firstName?.replace(/^Dr\. /, '');
      let lastName = staffMember.lastName;
      let fullName = staffMember.fullName?.replace(/^Dr\. /, '');

      await client.query(
        `
        INSERT INTO staff
        (id, first_name, last_name, full_name, role, department_id, status, shift, experience, patient_count, phone, email, specialty, rating)
        VALUES ($1, $2, $3, $4, $5, $6, $7::staff_status, $8, $9, $10, $11, $12, $13, $14)
        `,
        [
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
        ]
      );
    }
    console.log(`✅ Seeded ${healthcareData.staff.length} staff members`);

    // ... (keep rest of your patient, vitals, alerts, timeline, and meds/allergies creation + seeding as-is)

    await client.query('COMMIT');
    console.log('🎉 Database reset and seeding complete!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error in database reset and seeding:', error);
    throw error;
  } finally {
    client.release();
  }
}

// ✅ Run directly if executed from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  dropAndCreateAllTables()
    .then(() => {
      console.log('✅ Database reset and seeding completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Database reset and seeding failed:', err);
      process.exit(1);
    });
}
