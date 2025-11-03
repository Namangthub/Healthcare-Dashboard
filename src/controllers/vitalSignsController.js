import db from '../config/db.js';

export const VitalSignsController = {
  // 🩺 Get all vital signs
  getAllVitalSigns: async (req, res) => {
    try {
      const query = `
        SELECT 
          id,
          patient_id AS patientId,
          type,
          message,
          severity,
          date,
          resolved
        FROM vital_sign_alerts
        ORDER BY date DESC
      `;
      
      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('❌ Error fetching vital signs:', error);
      res.status(500).json({ message: 'Failed to fetch vital signs', error: error.message });
    }
  },

  // 👨‍⚕️ Get vital signs for a specific patient
  getPatientVitals: async (req, res) => {
    try {
      const { id } = req.params;

      // Queries for different vital data
      const currentQuery = `
        SELECT 
          heart_rate AS heartRate,
          blood_pressure AS bloodPressure,
          temperature,
          oxygen_saturation AS oxygenSaturation,
          weight,
          height
        FROM patient_vitals_current
        WHERE patient_id = $1
      `;

      const historyQuery = `
        SELECT 
          id,
          patient_id AS patientId,
          date,
          heart_rate AS heartRate,
          blood_pressure AS bloodPressure,
          temperature,
          oxygen_saturation AS oxygenSaturation
        FROM patient_vital_history
        WHERE patient_id = $1
        ORDER BY date DESC
      `;

      const alertsQuery = `
        SELECT 
          id,
          patient_id AS patientId,
          type,
          message,
          severity,
          date,
          resolved
        FROM vital_sign_alerts
        WHERE patient_id = $1
        ORDER BY date DESC
      `;

      // Execute all 3 queries in parallel
      const [currentResult, historyResult, alertsResult] = await Promise.all([
        db.query(currentQuery, [id]),
        db.query(historyQuery, [id]),
        db.query(alertsQuery, [id])
      ]);

      const response = {
        currentReading: currentResult.rows[0] || null,
        vitals: historyResult.rows || [],
        alerts: alertsResult.rows || []
      };

      res.json(response);
    } catch (error) {
      console.error(`❌ Error fetching vitals for patient ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch patient vitals', error: error.message });
    }
  },

  // 💾 Optional — Create a new vital sign record
  /*
  createVitalSign: async (req, res) => {
    try {
      const { patientId, heartRate, bloodPressure, temperature, oxygenSaturation } = req.body;

      if (!patientId || !heartRate || !bloodPressure || !temperature || !oxygenSaturation) {
        return res.status(400).json({ message: 'Missing required vital sign data' });
      }

      const insertResult = await db.query(
        `INSERT INTO patient_vital_history 
         (patient_id, heart_rate, blood_pressure, temperature, oxygen_saturation, date)
         VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
         RETURNING id`,
        [patientId, heartRate, bloodPressure, temperature, oxygenSaturation]
      );

      await db.query(
        `INSERT INTO patient_vitals_current
         (patient_id, heart_rate, blood_pressure, temperature, oxygen_saturation)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (patient_id)
         DO UPDATE SET
           heart_rate = $2,
           blood_pressure = $3,
           temperature = $4,
           oxygen_saturation = $5,
           timestamp = CURRENT_TIMESTAMP`,
        [patientId, heartRate, bloodPressure, temperature, oxygenSaturation]
      );

      res.status(201).json({
        id: insertResult.rows[0].id,
        message: 'Vital signs recorded successfully'
      });
    } catch (error) {
      console.error('❌ Error creating vital sign:', error);
      res.status(500).json({ message: 'Failed to create vital sign', error: error.message });
    }
  }
  */
};

export default VitalSignsController;
