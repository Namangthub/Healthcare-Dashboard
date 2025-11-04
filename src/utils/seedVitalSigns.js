import db from '../config/db.js';

const patientVitals = { /* same as before */ };
const vitalSignsAlerts = [ /* same as before */ ];

export const seedVitalSigns = async () => {
  const conn = await db.getConnection();

  try {
    console.log('🚀 Starting vital signs seeding...');
    await conn.beginTransaction();

    // Drop and recreate tables
    await conn.query(`
      DROP TABLE IF EXISTS patient_vitals_current;
      CREATE TABLE patient_vitals_current (
        patient_id VARCHAR(10) PRIMARY KEY,
        heart_rate INT,
        blood_pressure VARCHAR(20),
        temperature DECIMAL(5,2),
        oxygen_saturation DECIMAL(5,2),
        weight DECIMAL(5,2) NULL,
        height DECIMAL(5,2) NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      DROP TABLE IF EXISTS patient_vital_history;
      CREATE TABLE patient_vital_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id VARCHAR(10) NOT NULL,
        date DATE NOT NULL,
        heart_rate INT,
        blood_pressure VARCHAR(20),
        temperature DECIMAL(5,2),
        oxygen_saturation DECIMAL(5,2),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      DROP TABLE IF EXISTS vital_sign_alerts;
      CREATE TABLE vital_sign_alerts (
        id VARCHAR(20) PRIMARY KEY,
        patient_id VARCHAR(10) NOT NULL,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        severity VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        resolved BOOLEAN DEFAULT FALSE
      );
    `);

    console.log('✅ Tables created successfully');

    let vitalHistoryCount = 0;
    for (const [patientId, vitals] of Object.entries(patientVitals)) {
      if (vitals.length) {
        const current = vitals[vitals.length - 1];
        await conn.query(
          `INSERT INTO patient_vitals_current (patient_id, heart_rate, blood_pressure, temperature, oxygen_saturation)
           VALUES (?, ?, ?, ?, ?)`,
          [patientId, current.heartRate, current.bloodPressure, current.temperature, current.oxygenSaturation]
        );
      }

      for (const v of vitals) {
        await conn.query(
          `INSERT INTO patient_vital_history (patient_id, date, heart_rate, blood_pressure, temperature, oxygen_saturation)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [patientId, v.date, v.heartRate, v.bloodPressure, v.temperature, v.oxygenSaturation]
        );
        vitalHistoryCount++;
      }
    }

    console.log(`📊 Inserted ${vitalHistoryCount} vital history records`);

    for (const alert of vitalSignsAlerts) {
      await conn.query(
        `INSERT INTO vital_sign_alerts (id, patient_id, type, message, severity, date, resolved)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [alert.id, alert.patientId, alert.type, alert.message, alert.severity, alert.date, alert.resolved]
      );
    }

    await conn.commit();
    console.log('✅ Vital signs data committed successfully');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error seeding vital signs:', err);
    throw err;
  } finally {
    conn.release();
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  seedVitalSigns()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
