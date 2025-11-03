// seeders/seedDatabase.js
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Fallback data in case external data not found
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
      staff: { doctors: 12, nurses: 20, support: 8 },
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
      staff: { doctors: 8, nurses: 15, support: 5 },
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
      staff: { doctors: 10, nurses: 22, support: 7 },
    },
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
      rating: 4.8,
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
      rating: 4.6,
    },
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
      diagnosis: 'Coronary Artery Disease',
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
      diagnosis: 'Seizure Disorder',
    },
  ],
};

// Try to load healthcare data from frontend, fallback to built-in data
let healthcareData;
try {
  const healthcareDataPath = path.resolve(
    './src/data/healthcareData.js'
  );
  console.log('Looking for healthcareData.js at:', healthcareDataPath);

  if (fs.existsSync(healthcareDataPath)) {
    console.log('Healthcare data file found!');
    const importedModule = await import(healthcareDataPath);
    healthcareData = importedModule.default || importedModule;

    if (!healthcareData.departments || !Array.isArray(healthcareData.departments)) {
      console.warn('Invalid structure in imported data. Using fallback.');
      healthcareData = fallbackData;
    } else {
      console.log('Healthcare data loaded successfully.');
    }
  } else {
    console.log('Healthcare data file not found, using fallback data.');
    healthcareData = fallbackData;
  }
} catch (err) {
  console.error('Error loading healthcare data:', err.message);
  console.log('Using fallback data instead.');
  healthcareData = fallbackData;
}

export async function seedDatabase() {
  const client = await db.pool.connect();

  try {
    console.log('🌱 Starting database seeding...');
    await client.query('BEGIN');

    // ---------------------------
    // DEPARTMENTS
    // ---------------------------
    if (Array.isArray(healthcareData.departments)) {
      for (const dept of healthcareData.departments) {
        try {
          const deptQuery = `
            INSERT INTO departments
            (name, code, total_patients, today_patients, avg_wait_time,
            satisfaction, revenue, capacity, current_occupancy, critical_cases)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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
            dept.criticalCases,
          ];
          const { rows } = await client.query(deptQuery, deptValues);
          const deptId = rows[0].id;

          // Department staff
          const staff = dept.staff || { doctors: 5, nurses: 10, support: 5 };
          await client.query(
            `INSERT INTO department_staff (department_id, doctors, nurses, support)
             VALUES ($1, $2, $3, $4)`,
            [deptId, staff.doctors, staff.nurses, staff.support]
          );
          console.log(`✅ Department "${dept.name}" added.`);
        } catch (err) {
          console.error(`❌ Failed to insert department ${dept.name}:`, err.message);
        }
      }
    }

    // ---------------------------
    // STAFF
    // ---------------------------
    const staffData = healthcareData.staff?.length ? healthcareData.staff : fallbackData.staff;
    for (const member of staffData) {
      try {
        const [firstName, ...rest] = member.fullName.replace('Dr. ', '').split(' ');
        const lastName = rest.join(' ');
        const deptRes = await client.query('SELECT id FROM departments WHERE name = $1', [member.department]);
        const deptId = deptRes.rows[0]?.id || null;

        await client.query(
          `INSERT INTO staff
          (id, first_name, last_name, full_name, role, department_id, status, shift,
           experience, patient_count, phone, email, specialty, rating)
           VALUES ($1,$2,$3,$4,$5,$6,$7::staff_status,$8,$9,$10,$11,$12,$13,$14)`,
          [
            member.id,
            firstName,
            lastName,
            member.fullName,
            member.role,
            deptId,
            member.status || 'On Duty',
            member.shift || 'Day',
            member.experience || 1,
            member.patients || 0,
            member.phone,
            member.email,
            member.specialty,
            member.rating || 4.0,
          ]
        );
        console.log(`👨‍⚕️ Added staff: ${member.fullName}`);
      } catch (err) {
        console.error(`❌ Error adding staff ${member.fullName}:`, err.message);
      }
    }

    // ---------------------------
    // PATIENTS
    // ---------------------------
    const patients = healthcareData.patients?.length ? healthcareData.patients : fallbackData.patients;
    for (const p of patients) {
      try {
        const deptRes = await client.query('SELECT id FROM departments WHERE name = $1', [p.department]);
        const doctorRes = await client.query('SELECT id FROM staff WHERE full_name = $1', [p.doctor]);
        const deptId = deptRes.rows[0]?.id || null;
        const doctorId = doctorRes.rows[0]?.id || null;

        const result = await client.query(
          `INSERT INTO patients
           (id, first_name, last_name, full_name, age, gender, date_of_birth, phone,
            email, address, insurance, emergency_contact, department_id, doctor_id,
            admission_date, status, severity, room, diagnosis)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::patient_status,$17::patient_severity,$18,$19)
           RETURNING id`,
          [
            p.id,
            p.firstName,
            p.lastName,
            p.fullName,
            p.age,
            p.gender,
            p.dateOfBirth,
            p.phone,
            p.email,
            p.address,
            p.insurance,
            p.emergencyContact,
            deptId,
            doctorId,
            p.admissionDate,
            p.status,
            p.severity,
            p.room,
            p.diagnosis,
          ]
        );
        const patientId = result.rows[0].id;

        // Vitals
        const severityMap = {
          Low: { bp: '110/70', hr: 75, temp: 98.6, ox: 98 },
          Medium: { bp: '120/80', hr: 85, temp: 99.1, ox: 95 },
          High: { bp: '140/90', hr: 95, temp: 100.2, ox: 92 },
        };
        const defaults = severityMap[p.severity] || severityMap.Medium;

        await client.query(
          `INSERT INTO patient_vitals_current
          (patient_id, blood_pressure, heart_rate, temperature, oxygen_saturation, weight, height)
          VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            patientId,
            p.vitals?.bloodPressure || defaults.bp,
            p.vitals?.heartRate || defaults.hr,
            p.vitals?.temperature || defaults.temp,
            p.vitals?.oxygenSaturation || defaults.ox,
            p.vitals?.weight || 70,
            p.vitals?.height || 170,
          ]
        );
        console.log(`🏥 Added patient: ${p.fullName}`);
      } catch (err) {
        console.error(`❌ Error adding patient ${p.fullName}:`, err.message);
      }
    }

    // ---------------------------
    // QUALITY METRICS
    // ---------------------------
    console.log('📊 Seeding quality metrics...');
    const deptRes = await client.query('SELECT id, name, satisfaction, avg_wait_time, revenue FROM departments');
    for (const d of deptRes.rows) {
      try {
        await client.query(
          `INSERT INTO quality_patient_satisfaction (department_id, score, responses)
           VALUES ($1, $2, $3)`,
          [d.id, d.satisfaction, Math.floor(Math.random() * 100) + 50]
        );
        await client.query(
          `INSERT INTO quality_wait_times (department_id, avg_wait, target)
           VALUES ($1, $2, $3)`,
          [d.id, d.avg_wait_time, 20]
        );
        await client.query(
          `INSERT INTO quality_readmission_rates (department_id, rate, target)
           VALUES ($1, $2, $3)`,
          [d.id, (Math.random() * 5).toFixed(2), 3.0]
        );
        await client.query(
          `INSERT INTO department_financials (department_id, revenue, percentage)
           VALUES ($1, $2, $3)`,
          [d.id, d.revenue, (d.revenue / 1000000 * 100).toFixed(2)]
        );
        console.log(`✅ Metrics for ${d.name} inserted.`);
      } catch (err) {
        console.error(`❌ Error inserting metrics for ${d.name}:`, err.message);
      }
    }

    await client.query('COMMIT');
    console.log('🎉 Database seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
  } finally {
    client.release();
  }
}

// Run directly via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding process complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seed process failed:', err);
      process.exit(1);
    });
}
