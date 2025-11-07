import db from '../config/db.js';

export const DemographicsController = {
  // ✅ Get all demographics
  async getAllDemographics(req, res) {
    try {
      const ageQuery = `
        SELECT age_group AS ageGroup, label, count, percentage, color
        FROM demographics_age
        ORDER BY id
      `;
      const genderQuery = `
        SELECT gender, count, percentage, color
        FROM demographics_gender
        ORDER BY id
      `;
      const insuranceQuery = `
        SELECT type, count, percentage, color
        FROM demographics_insurance
        ORDER BY id
      `;

      const [ageData, genderData, insuranceData] = await Promise.all([
        db.query(ageQuery),
        db.query(genderQuery),
        db.query(insuranceQuery),
      ]);

      const byAge = ageData[0] || ageData.rows;
      const byGender = genderData[0] || genderData.rows;
      const byInsurance = insuranceData[0] || insuranceData.rows;

      res.json({ byAge, byGender, byInsurance });
    } catch (error) {
      console.error('Error fetching demographics:', error);
      res.status(500).json({ message: 'Failed to fetch demographics', error: error.message });
    }
  },

  // ✅ Get by Age only
  async getByAge(req, res) {
    try {
      const query = `
        SELECT age_group AS ageGroup, label, count, percentage, color
        FROM demographics_age
        ORDER BY id
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching demographics by age:', error);
      res.status(500).json({ message: 'Failed to fetch age demographics', error: error.message });
    }
  },

  // ✅ Get by Gender only
  async getByGender(req, res) {
    try {
      const query = `
        SELECT gender, count, percentage, color
        FROM demographics_gender
        ORDER BY id
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching demographics by gender:', error);
      res.status(500).json({ message: 'Failed to fetch gender demographics', error: error.message });
    }
  },

  // ✅ Get by Insurance only
  async getByInsurance(req, res) {
    try {
      const query = `
        SELECT type, count, percentage, color
        FROM demographics_insurance
        ORDER BY id
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching demographics by insurance:', error);
      res.status(500).json({ message: 'Failed to fetch insurance demographics', error: error.message });
    }
  },
};
