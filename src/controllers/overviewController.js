// src/controllers/overviewController.js
import db from '../config/db.js';

export const OverviewController = {
  // ✅ Get all overview statistics
  async getOverviewStatistics(req, res) {
    try {
      const query = `
        SELECT name, value, unit, category
        FROM overview_statistics
        ORDER BY id
      `;

      const result = await db.query(query);

      // Transform to object structure matching frontend expectations
      const stats = {};
      result.rows.forEach(row => {
        stats[row.name] = parseFloat(row.value);
      });

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
