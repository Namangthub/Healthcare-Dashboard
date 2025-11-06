import db from '../config/db.js';

// ✅ Only define logic here — no router.get()
const OverviewController = {
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

      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching overview statistics:', error);
      res.status(500).json({
        message: 'Failed to fetch overview statistics',
        error: error.message,
      });
    }
  },

  async getAllPatients(req, res) {
    try {
      const query = `
        SELECT id, full_name, age, gender, department, doctor, status, severity, admission_date
        FROM patients
        ORDER BY admission_date DESC
      `;
      const [rows] = await db.query(query);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No patients found' });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({
        message: 'Failed to fetch patients',
        error: error.message,
      });
    }
  },
};

export default OverviewController;
