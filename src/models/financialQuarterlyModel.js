import db from '../config/db.js';

const FinancialQuarterlyModel = {
  // ✅ Get all quarterly records
  async getAll() {
    const query = `
      SELECT 
        id,
        quarter,
        revenue,
        expenses,
        profit,
        patients,
        created_at AS "createdAt"
      FROM financial_quarterly
      ORDER BY id DESC;
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // ✅ Add new quarterly record
  async add({ quarter, revenue, expenses, profit, patients }) {
    const query = `
      INSERT INTO financial_quarterly (quarter, revenue, expenses, profit, patients)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [quarter, revenue, expenses, profit, patients]);
    return result.insertId;
  }
};

export default FinancialQuarterlyModel;
