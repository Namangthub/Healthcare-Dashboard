import db from '../config/db.js';

export const DemographicsController = {
  // Get all demographics
  async getAllDemographics(req, res) {
    try {
      // Get demographics by age
      const ageQuery = `
        SELECT age_group AS ageGroup, label, count, percentage, color
        FROM demographics_age
        ORDER BY id
      `;

      // Get demographics by gender
      const genderQuery = `
        SELECT gender, count, percentage, color
        FROM demographics_gender
        ORDER BY id
      `;

      // Get insurance demographics
      const insuranceQuery = `
        SELECT type, count, percentage, color
        FROM demographics_insurance
        ORDER BY id
      `;

      // Run all queries in parallel
      const [ageData, genderData, insuranceData] = await Promise.all([
        db.query(ageQuery),
        db.query(genderQuery),
        db.query(insuranceQuery)
      ]);

      // ✅ Handle MySQL or PostgreSQL result format
      const byAge = ageData[0] || ageData.rows;
      const byGender = genderData[0] || genderData.rows;
      const byInsurance = insuranceData[0] || insuranceData.rows;

      const demographics = {
        byAge,
        byGender,
        byInsurance
      };

      res.json(demographics);
    } catch (error) {
      console.error('Error fetching demographics:', error);
      res.status(500).json({
        message: 'Failed to fetch demographics',
        error: error.message
      });
    }
  }
};
