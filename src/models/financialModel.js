import db from '../config/db.js';

const FinancialModel = {
  // Get all records
  async getAll() {
    const [rows] = await db.query('SELECT * FROM financial_data ORDER BY year DESC, month_number DESC');
    return rows;
  },

  // Get data by year
  async getByYear(year) {
    const [rows] = await db.query('SELECT * FROM financial_data WHERE year = ? ORDER BY month_number', [year]);
    return rows;
  },

  // Get data by department
  async getByDepartment(department_name) {
    const [rows] = await db.query('SELECT * FROM financial_data WHERE department_name = ? ORDER BY year DESC, month_number DESC', [department_name]);
    return rows;
  },
};

export default FinancialModel;
