import db from '../config/db.js';

const FinancialModel = {
  // ✅ Get all records
  async getAll() {
    const [rows] = await db.query('SELECT * FROM financial_data');
    return rows;
  },

  // ✅ Get data by year
  async getByYear(year) {
    const [rows] = await db.query('SELECT * FROM financial_data WHERE year = ?', [year]);
    return rows;
  },

  // ✅ Get data by department
  async getByDepartment(department_id) {
    const [rows] = await db.query(
      'SELECT * FROM financial_data WHERE department_id = ? ORDER BY year DESC',
      [department_id]
    );
    return rows;
  },

  // ✅ Get complete yearly summary
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

    return rows[0] || null;
  },

  // ✅ Get monthly summary
  async getMonthlySummary(year) {
    const [rows] = await db.query(`
      SELECT 
        month_name,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE year = ?
      GROUP BY month_name
      ORDER BY FIELD(month_name, 
        'January','February','March','April','May','June',
        'July','August','September','October','November','December')
    `, [year]);

    return rows;
  },

  // ✅ Get quarterly summary
  async getQuarterlySummary(year) {
    const [rows] = await db.query(`
      SELECT 
        quarter,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE year = ?
      GROUP BY quarter
      ORDER BY quarter
    `, [year]);

    return rows;
  },

  // ✅ Get all department-wise financial summary
async getAllDepartments() {
  const [rows] = await db.query(`
    SELECT 
      department_id,
      SUM(revenue) AS total_revenue,
      SUM(expenses) AS total_expenses,
      (SUM(revenue) - SUM(expenses)) AS total_profit
    FROM financial_data
    GROUP BY department_id
    ORDER BY department_id
  `);
  return rows;
},


  // ✅ Department-wise yearly summary
  async getDepartmentYearlySummary(department_id, year) {
    const [rows] = await db.query(`
      SELECT 
        department_id,
        year,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE department_id = ? AND year = ?
      GROUP BY department_id, year
    `, [department_id, year]);
    return rows[0] || null;
  },

  // ✅ Department-wise monthly summary
  async getDepartmentMonthlySummary(department_id, year) {
    const [rows] = await db.query(`
      SELECT 
        month_name,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE department_id = ? AND year = ?
      GROUP BY month_name
      ORDER BY FIELD(month_name,
        'January','February','March','April','May','June',
        'July','August','September','October','November','December')
    `, [department_id, year]);
    return rows;
  },

  // ✅ Department-wise quarterly summary
  async getDepartmentQuarterlySummary(department_id, year) {
    const [rows] = await db.query(`
      SELECT 
        quarter,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE department_id = ? AND year = ?
      GROUP BY quarter
      ORDER BY quarter
    `, [department_id, year]);
    return rows;
  },
};

export default FinancialModel;
