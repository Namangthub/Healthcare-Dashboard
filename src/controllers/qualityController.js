const db = require('../config/db');

const QualityController = {
  // Get all quality metrics
  getQualityMetrics: (req, res) => {
    const query = `
      SELECT 
        department_name AS departmentName,
        satisfaction_score AS satisfactionScore,
        satisfaction_responses AS satisfactionResponses,
        avg_wait_time AS avgWaitTime,
        wait_time_target AS waitTimeTarget,
        readmission_rate AS readmissionRate,
        readmission_target AS readmissionTarget
      FROM quality_metrics
      ORDER BY id
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching quality metrics:', err);
        return res.status(500).json({ message: 'Failed to fetch quality metrics', error: err.message });
      }
      res.json(results);
    });
  },

  // Get quality metrics for a specific department
  getDepartmentQualityMetrics: (req, res) => {
    const { departmentId } = req.params;

    const query = `
      SELECT 
        department_name AS departmentName,
        satisfaction_score AS satisfactionScore,
        satisfaction_responses AS satisfactionResponses,
        avg_wait_time AS avgWaitTime,
        wait_time_target AS waitTimeTarget,
        readmission_rate AS readmissionRate,
        readmission_target AS readmissionTarget
      FROM quality_metrics
      WHERE department_id = ?
      LIMIT 1
    `;

    db.query(query, [departmentId], (err, results) => {
      if (err) {
        console.error(`Error fetching quality metrics for department ${departmentId}:`, err);
        return res.status(500).json({ message: 'Failed to fetch department quality metrics', error: err.message });
      }

      if (!results.length) {
        return res.status(404).json({ error: `Quality metrics for department ID ${departmentId} not found` });
      }

      const metrics = results[0];
      const formattedData = {
        department: metrics.departmentName,
        satisfaction: {
          score: metrics.satisfactionScore,
          responses: metrics.satisfactionResponses
        },
        waitTime: {
          avgWait: metrics.avgWaitTime,
          target: metrics.waitTimeTarget
        },
        readmission: {
          rate: metrics.readmissionRate,
          target: metrics.readmissionTarget
        }
      };

      res.json(formattedData);
    });
  }
};

module.exports = QualityController;
