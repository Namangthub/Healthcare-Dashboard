import { QualityModel } from '../models/qualityModel.js';

const QualityController = {
  // ✅ Get all quality metrics
  async getQualityMetrics(req, res) {
    try {
      const data = await QualityModel.getAllQualityMetrics();
      res.json(data);
    } catch (err) {
      console.error('❌ Error fetching quality metrics:', err);
      res.status(500).json({
        message: 'Failed to fetch quality metrics',
        error: err.message,
      });
    }
  },

  // ✅ Get quality metrics for a specific department
  async getDepartmentQualityMetrics(req, res) {
    try {
      const { departmentId } = req.params;
      const metrics = await QualityModel.getDepartmentQualityMetrics(departmentId);

      if (!metrics) {
        return res.status(404).json({
          error: `Quality metrics for department ID ${departmentId} not found`,
        });
      }

      const formattedData = {
        department: metrics.department_name,
        satisfaction: {
          score: metrics.satisfaction_score,
          responses: metrics.satisfaction_responses,
        },
        waitTime: {
          avgWait: metrics.avg_wait_time,
          target: metrics.wait_time_target,
        },
        readmission: {
          rate: metrics.readmission_rate,
          target: metrics.readmission_target,
        },
      };

      res.json(formattedData);
    } catch (err) {
      console.error(
        `❌ Error fetching quality metrics for department ${req.params.departmentId}:`,
        err
      );
      res.status(500).json({
        message: 'Failed to fetch department quality metrics',
        error: err.message,
      });
    }
  },
};

export default QualityController;
