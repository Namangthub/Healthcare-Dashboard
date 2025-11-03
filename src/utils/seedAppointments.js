import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();

// Resolve healthcare data file path
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const healthcareDataPath = path.resolve(__dirname, '../../../healthcare-dashboard/src/data/healthcareData.js');

let healthcareData;

try {
  const importedModule = await import(healthcareDataPath);
  healthcareData = importedModule.default || importedModule;
  console.log('✅ Successfully loaded healthcare data');
} catch (error) {
  console.error('❌ Error loading healthcare data:', error.message);
  process.exit(1);
}

export async function seedAppointments() {
  const client = await db.pool.connect();

  try {
    console.log('🚀 Starting appointments seeding...');
    await client.query('BEGIN');

    // 🧱 Check if appointments table exists, create if not
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('🧩 Creating appointments table...');
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

    console.log('🩺 Seeding appointments...');
    let appointmentCount = 0;

    // Generate current week dates
    const today = new Date();
    const currentWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + i);
      return date.toISOString().split('T')[0];
    });

    // If sample data exists in healthcareData.js
    if (healthcareData.appointments && Array.isArray(healthcareData.appointments.upcoming)) {
      console.log(`📅 Found ${healthcareData.appointments.upcoming.length} sample appointments`);
      for (const appointment of healthcareData.appointments.upcoming) {
        try {
          let patientId = null;
          if (appointment.patientName) {
            const result = await client.query(
              `SELECT id FROM patients WHERE full_name ILIKE $1 LIMIT 1`,
              [`%${appointment.patientName}%`]
            );
            patientId = result.rows[0]?.id || (await client.query(`SELECT id FROM patients LIMIT 1`)).rows[0]?.id;
          }

          let staffId = null;
          if (appointment.doctor) {
            const result = await client.query(
              `SELECT id FROM staff WHERE full_name ILIKE $1 LIMIT 1`,
              [`%${appointment.doctor}%`]
            );
            staffId = result.rows[0]?.id || null;
          }

          let departmentId = null;
          if (appointment.department) {
            const result = await client.query(
              `SELECT id FROM departments WHERE name ILIKE $1 LIMIT 1`,
              [`%${appointment.department}%`]
            );
            departmentId = result.rows[0]?.id || null;
          }

          if (!patientId) {
            console.warn(`⚠️ No patient found for ${appointment.patientName}, skipping.`);
            continue;
          }

          const appointmentId = `APT-${Date.now()}-${appointmentCount}`;
          const date = appointment.date || currentWeek[Math.floor(Math.random() * currentWeek.length)];
          const time = appointment.time || '09:00';

          await client.query(
            `
            INSERT INTO appointments
            (id, patient_id, staff_id, department_id, date, time, type, status, duration, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO NOTHING
          `,
            [
              appointmentId,
              patientId,
              staffId,
              departmentId,
              date,
              time,
              appointment.type || 'Checkup',
              appointment.status || 'Scheduled',
              appointment.duration || 30,
              appointment.notes || '',
            ]
          );

          appointmentCount++;
        } catch (error) {
          console.error('❌ Error creating appointment:', error.message);
        }
      }
    } else {
      console.log('⚙️ No sample data found — generating synthetic appointments...');
      const patients = (await client.query('SELECT id, full_name FROM patients')).rows;
      const doctors = (await client.query(`SELECT id, full_name FROM staff WHERE role ILIKE '%Doctor%'`)).rows;
      const departments = (await client.query('SELECT id, name FROM departments')).rows;

      const appointmentTypes = ['Routine Checkup', 'Follow-up', 'Emergency', 'Consultation', 'Procedure', 'Vaccination'];
      const statuses = ['Scheduled', 'Completed', 'Cancelled', 'In Progress'];
      const statusWeights = [0.5, 0.3, 0.1, 0.1]; // 50%, 30%, etc.

      for (let i = 0; i < 20; i++) {
        try {
          const patient = patients[Math.floor(Math.random() * patients.length)];
          const doctor = doctors[Math.floor(Math.random() * doctors.length)] || {};
          const department = departments[Math.floor(Math.random() * departments.length)];

          const appointmentDate = currentWeek[Math.floor(Math.random() * 7)];
          const hour = 8 + Math.floor(Math.random() * 9);
          const minute = Math.floor(Math.random() * 4) * 15;
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

          const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];

          const rand = Math.random();
          let cumulative = 0;
          let status = statuses[0];
          for (let j = 0; j < statuses.length; j++) {
            cumulative += statusWeights[j];
            if (rand < cumulative) {
              status = statuses[j];
              break;
            }
          }

          const appointmentId = `APT-${patient.id.replace('PAT', '')}-${appointmentDate.replace(/-/g, '')}${i}`;

          await client.query(
            `
            INSERT INTO appointments
            (id, patient_id, staff_id, department_id, date, time, type, status, duration, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO NOTHING
          `,
            [
              appointmentId,
              patient.id,
              doctor.id || null,
              department.id,
              appointmentDate,
              time,
              type,
              status,
              30,
              `Appointment for ${patient.full_name}${doctor.full_name ? ` with ${doctor.full_name}` : ''}`,
            ]
          );

          appointmentCount++;
        } catch (error) {
          console.error('❌ Error creating synthetic appointment:', error.message);
        }
      }
    }

    await client.query('COMMIT');
    console.log(`✅ Added ${appointmentCount} appointments successfully!`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('💥 Error seeding appointments:', error);
  } finally {
    client.release();
  }
}

// Run directly from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAppointments()
    .then(() => {
      console.log('🎉 Appointments seeding complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Appointments seeding error:', err);
      process.exit(1);
    });
}
