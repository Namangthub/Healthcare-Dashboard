// src/controllers/overviewController.js
import db from '../config/db.js';

export const OverviewController = {
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

      const stats = rows[0]; // The latest record
      res.json(stats);

    } catch (error) {
      console.error('Error fetching overview statistics:', error);
      res.status(500).json({
        message: 'Failed to fetch overview statistics',
        error: error.message
      });
    }
  }
};

export default OverviewController;
