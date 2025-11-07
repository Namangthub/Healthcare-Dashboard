import db from '../config/db.js';

// ✅ Quality Metrics Model (MySQL-compatible)
export const QualityModel = {
  // Get all quality metrics
  async getAllQualityMetrics() {
    try {
      const satisfactionQuery = `
        SELECT AVG(score) AS overall_satisfaction
        FROM quality_patient_satisfaction;
      `;
      const waitTimesQuery = `
        SELECT AVG(avg_wait) AS overall_wait_time
        FROM quality_wait_times;
      `;
      const readmissionQuery = `
        SELECT AVG(rate) AS overall_readmission
        FROM quality_readmission_rates;
      `;
      const deptSatisfactionQuery = `
        SELECT d.name AS department, qps.score, qps.responses
        FROM quality_patient_satisfaction qps
        JOIN departments d ON d.department_id = qps.department_id
        ORDER BY qps.score DESC;
      `;
      const deptWaitTimesQuery = `
        SELECT d.name AS department, qwt.avg_wait, qwt.target
        FROM quality_wait_times qwt
        JOIN departments d ON d.department_id = qwt.department_id
        ORDER BY qwt.avg_wait ASC;
      `;
      const deptReadmissionQuery = `
        SELECT d.name AS department, qrr.rate, qrr.target
        FROM quality_readmission_rates qrr
        JOIN departments d ON d.department_id = qrr.department_id
        ORDER BY qrr.rate ASC;
      `;

      // MySQL returns [rows, fields], so use destructuring for each
      const [
        [satisfactionResult],
        [waitTimesResult],
        [readmissionResult],
        [deptSatisfactionResult],
        [deptWaitTimesResult],
        [deptReadmissionResult],
      ] = await Promise.all([
        db.query(satisfactionQuery),
        db.query(waitTimesQuery),
        db.query(readmissionQuery),
        db.query(deptSatisfactionQuery),
        db.query(deptWaitTimesQuery),
        db.query(deptReadmissionQuery),
      ]);

      return {
        patientSatisfaction: {
          overall: parseFloat(satisfactionResult[0]?.overall_satisfaction || 0),
          byDepartment: deptSatisfactionResult,
        },
        waitTimes: {
          average: parseFloat(waitTimesResult[0]?.overall_wait_time || 0),
          byDepartment: deptWaitTimesResult,
        },
        readmissionRates: {
          overall: parseFloat(readmissionResult[0]?.overall_readmission || 0),
          byDepartment: deptReadmissionResult,
        },
      };
    } catch (error) {
      console.error('❌ Error getting quality metrics:', error);
      throw new Error(`Error getting quality metrics: ${error.message}`);
    }
  },

  // Get quality metrics for one department
  async getDepartmentQualityMetrics(departmentId) {
    try {
      const query = `
        SELECT 
          d.department_id AS department_id,
          d.name AS department_name,
          qps.score AS satisfaction_score,
          qps.responses AS satisfaction_responses,
          qwt.avg_wait AS avg_wait_time,
          qwt.target AS wait_time_target,
          qrr.rate AS readmission_rate,
          qrr.target AS readmission_target
        FROM departments d
        LEFT JOIN quality_patient_satisfaction qps ON d.department_id = qps.department_id
        LEFT JOIN quality_wait_times qwt ON d.department_id = qwt.department_id
        LEFT JOIN quality_readmission_rates qrr ON d.department_id = qrr.department_id
        WHERE d.department_id = ?;
      `;

      const [result] = await db.query(query, [departmentId]);
      return result[0];
    } catch (error) {
      console.error('❌ Error getting department quality metrics:', error);
      throw new Error(`Error getting department quality metrics: ${error.message}`);
    }
  },
};
