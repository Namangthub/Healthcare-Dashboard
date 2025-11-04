import db from '../config/db.js';

const FinancialYearlyModel = {
  // ✅ Get all yearly records
  async getAll() {
    const query = `
      SELECT 
        id,
        year,
        revenue,
        expenses,
        profit,
        patients,
        created_at AS "createdAt"
      FROM financial_yearly
      ORDER BY year DESC;
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // ✅ Add new yearly record
  async add({ year, revenue, expenses, profit, patients }) {
    const query = `
      INSERT INTO financial_yearly (year, revenue, expenses, profit, patients)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [year, revenue, expenses, profit, patients]);
    return result.insertId;
  }
};

export default FinancialYearlyModel;
