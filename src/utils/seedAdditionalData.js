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

async function seedAdditionalData() {
  const client = await db.pool.connect();
  
  try {
    console.log('Starting additional data seeding...');
    
    await client.query('BEGIN');

    // 1. Seed Patient Vital History
    console.log('Seeding patient vital history...');
    let vitalHistoryCount = 0;

    for (const patientId in healthcareData.patientVitals) {
      const patientVitals = healthcareData.patientVitals[patientId];
      
      if (Array.isArray(patientVitals)) {
        for (const record of patientVitals) {
          try {
            const query = `
              INSERT INTO patient_vital_history
              (patient_id, date, heart_rate, blood_pressure, temperature, oxygen_saturation)
              VALUES ($1, $2, $3, $4, $5, $6)
              ON CONFLICT (patient_id, date) DO NOTHING
            `;
            
            await client.query(query, [
              patientId,
              record.date,
              record.heartRate,
              record.bloodPressure,
              record.temperature,
              record.oxygenSaturation
            ]);
            
            vitalHistoryCount++;
          } catch (error) {
            console.error(`Error adding vital history for patient ${patientId}:`, error.message);
          }
        }
      }
    }
    console.log(`Added ${vitalHistoryCount} vital history records`);

    // 2. Seed Vital Sign Alerts
    console.log('Seeding vital sign alerts...');
    let alertCount = 0;
    
    if (Array.isArray(healthcareData.vitalSignsAlerts)) {
      for (const alert of healthcareData.vitalSignsAlerts) {
        try {
          const query = `
            INSERT INTO vital_sign_alerts
            (id, patient_id, type, message, severity, date, resolved)
            VALUES ($1, $2, $3, $4, $5::patient_severity, $6, $7)
            ON CONFLICT (id) DO NOTHING
          `;
          
          await client.query(query, [
            alert.id,
            alert.patientId,
            alert.type,
            alert.message,
            alert.severity,
            alert.date,
            alert.resolved
          ]);
          
          alertCount++;
        } catch (error) {
          console.error(`Error adding vital alert ${alert.id}:`, error.message);
        }
      }
    }
    console.log(`Added ${alertCount} vital alerts`);

    // 3. Seed Patient Timelines
    console.log('Seeding patient timelines...');
    let timelineCount = 0;
    
    for (const patientId in healthcareData.patientTimelines) {
      const events = healthcareData.patientTimelines[patientId];
      
      if (Array.isArray(events)) {
        for (const event of events) {
          try {
            const query = `
              INSERT INTO timeline_events
              (id, patient_id, date, title, description, type)
              VALUES ($1, $2, $3, $4, $5, $6::timeline_event_type)
              ON CONFLICT (id) DO NOTHING
            `;
            
            await client.query(query, [
              event.id,
              patientId,
              event.date,
              event.title,
              event.description,
              event.type
            ]);
            
            timelineCount++;
          } catch (error) {
            console.error(`Error adding timeline event ${event.id}:`, error.message);
          }
        }
      }
    }
    console.log(`Added ${timelineCount} timeline events`);

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
    
    // Seed with appointments from weekly schedule
    if (healthcareData.appointments && healthcareData.appointments.weeklySchedule) {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      // Get all patients
      const patientsResult = await client.query('SELECT id, full_name FROM patients');
      const patients = patientsResult.rows;
      
      // Get all staff
      const staffResult = await client.query('SELECT id, full_name FROM staff WHERE role LIKE \'%Doctor%\' OR role LIKE \'%Physician%\'');
      const doctors = staffResult.rows;
      
      // Get all departments
      const deptResult = await client.query('SELECT id, name FROM departments');
      const departments = deptResult.rows;
      
      for (let i = 0; i < healthcareData.appointments.weeklySchedule.length; i++) {
        const dayData = healthcareData.appointments.weeklySchedule[i];
        const dayOfWeek = daysOfWeek.indexOf(dayData.day);
        if (dayOfWeek === -1) continue;
        
        const appointmentDate = currentWeek[dayOfWeek];
        const totalAppointments = dayData.scheduled;
        
        // Create appointments for this day
        for (let j = 0; j < totalAppointments; j++) {
          try {
            // Randomly select patient, doctor and department
            const patient = patients[Math.floor(Math.random() * patients.length)];
            const doctor = doctors[Math.floor(Math.random() * doctors.length)];
            const department = departments[Math.floor(Math.random() * departments.length)];
            
            // Generate time between 8 AM and 5 PM
            const hour = 8 + Math.floor(Math.random() * 9);
            const minute = Math.floor(Math.random() * 4) * 15;
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            
            // Generate appointment types
            const types = ['Routine Checkup', 'Follow-up', 'Emergency', 'Consultation', 'Procedure', 'Vaccination'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            // Determine status
            let status;
            if (j < dayData.completed) status = 'Completed';
            else if (j < dayData.completed + dayData.inProgress) status = 'In Progress';
            else if (j < dayData.completed + dayData.inProgress + dayData.cancelled) status = 'Cancelled';
            else status = 'Scheduled';
            
            const appointmentId = `APT-${patient.id}-${appointmentDate.replace(/-/g, '')}${j.toString().padStart(2, '0')}`;
            
            const query = `
              INSERT INTO appointments
              (id, patient_id, staff_id, date, time, department_id, type, status, duration, notes)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
              ON CONFLICT (id) DO NOTHING
            `;
            
            await client.query(query, [
              appointmentId,
              patient.id,
              doctor.id,
              appointmentDate,
              time,
              department.id,
              type,
              status,
              30, // Default duration
              `Appointment for ${patient.full_name} with ${doctor.full_name}`
            ]);
            
            appointmentCount++;
          } catch (error) {
            console.error(`Error creating appointment for day ${dayData.day}:`, error.message);
          }
        }
      }
    }
    console.log(`Added ${appointmentCount} appointments`);

    // 5. Seed Inventory
    console.log('Seeding inventory data...');
    
    // Create inventory tables if they don't exist
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS inventory_supplies (
          id SERIAL PRIMARY KEY,
          item_name VARCHAR(100) NOT NULL UNIQUE,
          current_quantity INTEGER NOT NULL DEFAULT 0,
          minimum_quantity INTEGER NOT NULL DEFAULT 0,
          unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS inventory_equipment (
          id SERIAL PRIMARY KEY,
          equipment_name VARCHAR(100) NOT NULL UNIQUE,
          status VARCHAR(50) NOT NULL DEFAULT 'Operational',
          last_maintenance DATE,
          next_maintenance DATE,
          notes TEXT,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      console.error('Error creating inventory tables:', error.message);
    }
    
    // Seed medical supplies
    if (healthcareData.inventory && Array.isArray(healthcareData.inventory.medical_supplies)) {
      for (const item of healthcareData.inventory.medical_supplies) {
        try {
          const query = `
            INSERT INTO inventory_supplies
            (item_name, current_quantity, minimum_quantity, unit_cost)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (item_name) DO UPDATE 
            SET current_quantity = $2, minimum_quantity = $3, unit_cost = $4
          `;
          
          await client.query(query, [
            item.item,
            item.current,
            item.minimum,
            item.cost
          ]);
        } catch (error) {
          console.error(`Error adding inventory item ${item.item}:`, error.message);
        }
      }
      console.log(`Added ${healthcareData.inventory.medical_supplies.length} medical supply items`);
    }
    
    // Seed equipment
    if (healthcareData.inventory && Array.isArray(healthcareData.inventory.equipment)) {
      for (const item of healthcareData.inventory.equipment) {
        try {
          const query = `
            INSERT INTO inventory_equipment
            (equipment_name, status, last_maintenance, next_maintenance)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (equipment_name) DO UPDATE 
            SET status = $2, last_maintenance = $3, next_maintenance = $4
          `;
          
          await client.query(query, [
            item.equipment,
            item.status,
            item.lastMaintenance,
            item.nextMaintenance
          ]);
        } catch (error) {
          console.error(`Error adding equipment ${item.equipment}:`, error.message);
        }
      }
      console.log(`Added ${healthcareData.inventory.equipment.length} equipment items`);
    }

    // 6. Seed Recent Activities
    console.log('Seeding recent activities...');
    
    if (Array.isArray(healthcareData.recentActivities)) {
      for (const activity of healthcareData.recentActivities) {
        try {
          const query = `
            INSERT INTO recent_activities
            (type, message, timestamp, priority)
            VALUES ($1, $2, $3::timestamp, $4)
          `;
          
          await client.query(query, [
            activity.type,
            activity.message,
            activity.timestamp,
            activity.priority
          ]);
        } catch (error) {
          console.error(`Error adding activity:`, error.message);
        }
      }
      console.log(`Added ${healthcareData.recentActivities.length} recent activities`);
    }

    await client.query('COMMIT');
    console.log('Additional data seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding additional data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run directly if called from command line
if (require.main === module) {
  seedAdditionalData()
    .then(() => {
      console.log('Additional seeding process complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('Additional seed error:', err);
      process.exit(1);
    });
}

module.exports = seedAdditionalData;