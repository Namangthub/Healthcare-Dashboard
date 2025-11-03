import db from '../config/db.js';

export const ActivitiesController = {
  // Get recent activities
  getRecentActivities: async (req, res) => {
    try {
      const query = `
        SELECT 
          id,
          type,
          message,
          timestamp,
          priority
        FROM recent_activities
        ORDER BY timestamp DESC
      `;

      // MySQL case handle (mysql2 or mysql) vs Postgres (pg)
      const [rows] = await db.query(query); // ✅ for MySQL
      // const result = await db.query(query); // ✅ for Postgres
      // res.json(result.rows);

      res.json(rows);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      res.status(500).json({
        message: 'Failed to fetch recent activities',
        error: error.message
      });
    }
  }
};
