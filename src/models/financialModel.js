import db from '../config/db.js';

const FinancialModel = {
  // Get all records
  async getAll() {
    const [rows] = await db.query('SELECT * FROM financial_data');
    return rows;
  },

  // Get data by year
  async getByYear(year) {
    const [rows] = await db.query('SELECT * FROM financial_data WHERE year = ? ORDER BY month_number', [year]);
    return rows;
  },

  // Get data by department
  async getByDepartment(department_id) {
    const [rows] = await db.query('SELECT * FROM financial_data WHERE department_id = ? ORDER BY year DESC', [department_id]);
    return rows;
  },
};

export default FinancialModel;
