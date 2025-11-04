import db from '../config/db.js';

export const VitalsModel = {
  // ✅ Get all vitals for all patients (overview)
  async getAllVitals() {
    const query = `
      SELECT 
        p.id AS patientId,
        p.full_name AS patientName,
        pvc.blood_pressure AS bloodPressure,
        pvc.heart_rate AS heartRate,
        pvc.temperature,
        pvc.oxygen_saturation AS oxygenSaturation,
        pvc.weight,
        pvc.height,
        pvc.updated_at AS lastUpdated,
        COALESCE((
          SELECT COUNT(*) 
          FROM vital_sign_alerts va 
          WHERE va.patient_id = p.id AND va.resolved = FALSE
        ), 0) AS activeAlerts
      FROM patients p
      LEFT JOIN patient_vitals_current pvc ON pvc.patient_id = p.id
      ORDER BY p.id ASC;
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // ✅ Get current vitals for a single patient
  async getCurrentVitals(patientId) {
    const query = `
      SELECT 
        patient_id AS patientId,
        blood_pressure AS bloodPressure,
        heart_rate AS heartRate,
        temperature,
        oxygen_saturation AS oxygenSaturation,
        weight,
        height,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM patient_vitals_current
      WHERE patient_id = ?
    `;
    const [rows] = await db.query(query, [patientId]);
    return rows[0] || null;
  },

  // ✅ Get vitals history for a patient
  async getVitalHistory(patientId) {
    const query = `
      SELECT 
        id,
        patient_id AS patientId,
        date,
        heart_rate AS heartRate,
        blood_pressure AS bloodPressure,
        temperature,
        oxygen_saturation AS oxygenSaturation,
        created_at AS createdAt
      FROM patient_vital_history
      WHERE patient_id = ?
      ORDER BY date DESC
    `;
    const [rows] = await db.query(query, [patientId]);
    return rows;
  },

  // ✅ Get alerts for a patient
  async getVitalAlerts(patientId) {
    const query = `
      SELECT 
        id,
        patient_id AS patientId,
        type,
        message,
        severity,
        date,
        resolved,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM vital_sign_alerts
      WHERE patient_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query, [patientId]);
    return rows;
  },

  // ✅ Record new vitals
  async recordVitals(patientId, data) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const { bloodPressure, heartRate, temperature, oxygenSaturation, weight, height } = data;

      const [updateResult] = await conn.query(
        `UPDATE patient_vitals_current 
         SET blood_pressure = ?, heart_rate = ?, temperature = ?, oxygen_saturation = ?, weight = ?, height = ?, updated_at = NOW()
         WHERE patient_id = ?`,
        [bloodPressure, heartRate, temperature, oxygenSaturation, weight, height, patientId]
      );

      if (updateResult.affectedRows === 0) {
        await conn.query(
          `INSERT INTO patient_vitals_current 
          (patient_id, blood_pressure, heart_rate, temperature, oxygen_saturation, weight, height)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [patientId, bloodPressure, heartRate, temperature, oxygenSaturation, weight, height]
        );
      }

      await conn.query(
        `INSERT INTO patient_vital_history 
         (patient_id, date, heart_rate, blood_pressure, temperature, oxygen_saturation)
         VALUES (?, CURDATE(), ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           heart_rate = VALUES(heart_rate),
           blood_pressure = VALUES(blood_pressure),
           temperature = VALUES(temperature),
           oxygen_saturation = VALUES(oxygen_saturation)`,
        [patientId, heartRate, bloodPressure, temperature, oxygenSaturation]
      );

      await conn.commit();
      return { message: 'Vitals recorded successfully' };
    } catch (error) {
      await conn.rollback();
      throw new Error(`Error recording vitals: ${error.message}`);
    } finally {
      conn.release();
    }
  },

  // ✅ Resolve alert
  async resolveAlert(alertId) {
    const query = `
      UPDATE vital_sign_alerts
      SET resolved = TRUE, updated_at = NOW()
      WHERE id = ?
    `;
    await db.query(query, [alertId]);

    const [rows] = await db.query(`SELECT * FROM vital_sign_alerts WHERE id = ?`, [alertId]);
    return rows[0];
  }
};
