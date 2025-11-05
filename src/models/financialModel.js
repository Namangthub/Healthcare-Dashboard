import db from '../config/db.js';

const FinancialModel = {
  // Get all records
  async getAll() {
    const [rows] = await db.query('SELECT * FROM financial_data');
    return rows;
  },

  // Get data by year
  async getByYear(year) {
    const [rows] = await db.query('SELECT * FROM financial_data WHERE year = ?', [year]);
    return rows;
  },

  // ✅ Get complete yearly financial summary (aggregated)
  async getYearlySummary(year) {
    const [rows] = await db.query(`
      SELECT 
        year,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE year = ?
      GROUP BY year
    `, [year]);

    return rows[0] || null; // return null if no data found
  },

  // Get data by department
  async getByDepartment(department_id) {
    const [rows] = await db.query('SELECT * FROM financial_data WHERE department_id = ? ORDER BY year DESC', [department_id]);
    return rows;
  },

  // ✅ Monthly summary (per month in a given year)
  async getMonthlySummary(year) {
    const [rows] = await db.query(`
      SELECT 
        year,
        month_name,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE year = ?
      GROUP BY year, month_name
      ORDER BY FIELD(month_name, 
        'January','February','March','April','May','June',
        'July','August','September','October','November','December')
    `, [year]);

    return rows;
  },

  // ✅ Quarterly summary (per quarter in a given year)
  async getQuarterlySummary(year) {
    const [rows] = await db.query(`
      SELECT 
        year,
        quarter,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE year = ?
      GROUP BY year, quarter
      ORDER BY quarter
    `, [year]);

    return rows;
  },
};

export default FinancialModel;
