import db from '../config/db.js';

const OverviewController = {
  // ✅ Get latest overview statistics (complete record)
  async getOverviewStatistics(req, res) {
    try {
      const query = `
        SELECT *
        FROM overview_statistics
        ORDER BY date DESC
        LIMIT 1
      `;
      const [rows] = await db.query(query);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No statistics found' });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching overview statistics:', error);
      res.status(500).json({
        message: 'Failed to fetch overview statistics',
        error: error.message,
      });
    }
  },

  // ✅ Get only total patients (JSON)
  async getTotalPatients(req, res) {
    try {
      const query = `
        SELECT total_patients
        FROM overview_statistics
        ORDER BY date DESC
        LIMIT 1
      `;
      const [rows] = await db.query(query);

      if (rows.length === 0) {
        return res.status(404).json({ total_patients: 0 });
      }

      res.status(200).json({ total_patients: rows[0].total_patients });
    } catch (error) {
      console.error('Error fetching total patients:', error);
      res.status(500).json({
        message: 'Failed to fetch total patients',
        error: error.message,
      });
    }
  },

  // ✅ Get only active patients (JSON)
  async getActivePatients(req, res) {
    try {
      const query = `
        SELECT active_patients
        FROM overview_statistics
        ORDER BY date DESC
        LIMIT 1
      `;
      const [rows] = await db.query(query);

      if (rows.length === 0) {
        return res.status(404).json({ active_patients: 0 });
      }

      res.status(200).json({ active_patients: rows[0].active_patients });
    } catch (error) {
      console.error('Error fetching active patients:', error);
      res.status(500).json({
        message: 'Failed to fetch active patients',
        error: error.message,
      });
    }
  },

  // ✅ Get only total appointments (JSON)
  async getTotalAppointments(req, res) {
    try {
      const query = `
        SELECT total_appointments
        FROM overview_statistics
        ORDER BY date DESC
        LIMIT 1
      `;
      const [rows] = await db.query(query);

      if (rows.length === 0) {
        return res.status(404).json({ total_appointments: 0 });
      }

      res.status(200).json({ total_appointments: rows[0].total_appointments });
    } catch (error) {
      console.error('Error fetching total appointments:', error);
      res.status(500).json({
        message: 'Failed to fetch total appointments',
        error: error.message,
      });
    }
  },

  // ✅ Get only critical cases (JSON)
  async getCriticalCases(req, res) {
    try {
      const query = `
        SELECT critical_alerts
        FROM overview_statistics
        ORDER BY date DESC
        LIMIT 1
      `;
      const [rows] = await db.query(query);

      if (rows.length === 0) {
        return res.status(404).json({ critical_cases: 0 });
      }

      res.status(200).json({ critical_cases: rows[0].critical_alerts });
    } catch (error) {
      console.error('Error fetching critical cases:', error);
      res.status(500).json({
        message: 'Failed to fetch critical cases',
        error: error.message,
      });
    }
  },
};

export default OverviewController;
