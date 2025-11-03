// src/models/QualityModel.js
import db from '../config/db.js';

// Model for quality metrics
export const QualityModel = {
  // Get all quality metrics
  getAllQualityMetrics: async () => {
    try {
      // First get overall averages
      const satisfactionQuery = `
        SELECT AVG(score) AS overall_satisfaction
        FROM quality_patient_satisfaction
      `;
      
      const waitTimesQuery = `
        SELECT AVG(avg_wait) AS overall_wait_time
        FROM quality_wait_times
      `;
      
      const readmissionQuery = `
        SELECT AVG(rate) AS overall_readmission
        FROM quality_readmission_rates
      `;
      
      // Then get department-specific metrics
      const deptSatisfactionQuery = `
        SELECT d.name AS department, qps.score, qps.responses
        FROM quality_patient_satisfaction qps
        JOIN departments d ON d.id = qps.department_id
        ORDER BY qps.score DESC
      `;
      
      const deptWaitTimesQuery = `
        SELECT d.name AS department, qwt.avg_wait, qwt.target
        FROM quality_wait_times qwt
        JOIN departments d ON d.id = qwt.department_id
        ORDER BY qwt.avg_wait ASC
      `;
      
      const deptReadmissionQuery = `
        SELECT d.name AS department, qrr.rate, qrr.target
        FROM quality_readmission_rates qrr
        JOIN departments d ON d.id = qrr.department_id
        ORDER BY qrr.rate ASC
      `;
      
      // Execute all queries
      const [
        satisfactionResult,
        waitTimesResult,
        readmissionResult,
        deptSatisfactionResult,
        deptWaitTimesResult,
        deptReadmissionResult
      ] = await Promise.all([
        db.query(satisfactionQuery),
        db.query(waitTimesQuery),
        db.query(readmissionQuery),
        db.query(deptSatisfactionQuery),
        db.query(deptWaitTimesQuery),
        db.query(deptReadmissionQuery)
      ]);
      
      // Build the quality metrics structure
      return {
        patientSatisfaction: {
          overall: parseFloat(satisfactionResult.rows[0]?.overall_satisfaction || 0),
          byDepartment: deptSatisfactionResult.rows
        },
        waitTimes: {
          average: parseFloat(waitTimesResult.rows[0]?.overall_wait_time || 0),
          byDepartment: deptWaitTimesResult.rows
        },
        readmissionRates: {
          overall: parseFloat(readmissionResult.rows[0]?.overall_readmission || 0),
          byDepartment: deptReadmissionResult.rows
        }
      };
    } catch (error) {
      throw new Error(`Error getting quality metrics: ${error.message}`);
    }
  },

  // Get quality metrics for a specific department
  getDepartmentQualityMetrics: async (departmentId) => {
    try {
      const query = `
        SELECT 
          d.id AS department_id,
          d.name AS department_name,
          qps.score AS satisfaction_score,
          qps.responses AS satisfaction_responses,
          qwt.avg_wait AS avg_wait_time,
          qwt.target AS wait_time_target,
          qrr.rate AS readmission_rate,
          qrr.target AS readmission_target
        FROM departments d
        LEFT JOIN quality_patient_satisfaction qps ON d.id = qps.department_id
        LEFT JOIN quality_wait_times qwt ON d.id = qwt.department_id
        LEFT JOIN quality_readmission_rates qrr ON d.id = qrr.department_id
        WHERE d.id = $1
      `;
      
      const result = await db.query(query, [departmentId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error getting department quality metrics: ${error.message}`);
    }
  }
};
