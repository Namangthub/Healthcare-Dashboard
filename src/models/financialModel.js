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

  // ✅ Get distinct years
  async getAvailableYears() {
    const [rows] = await db.query(`
      SELECT DISTINCT year FROM financial_data ORDER BY year DESC
    `);
    return rows;
  },

  // ✅ Yearly summary (only yearly/total_yearly data)
  async getYearlySummary(year) {
    const [rows] = await db.query(`
      SELECT 
        year,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE year = ?
        AND period_type IN ('yearly', 'total_yearly')
      GROUP BY year
    `, [year]);

    return rows[0] || null;
  },

  // ✅ Monthly summary (for charts)
  async getMonthlySummary(year) {
    const [rows] = await db.query(`
      SELECT 
        month_name,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE year = ?
        AND period_type = 'monthly'
        AND month_name IS NOT NULL
      GROUP BY month_name
      ORDER BY FIELD(month_name,
        'January','February','March','April','May','June',
        'July','August','September','October','November','December')
    `, [year]);

    return rows;
  },

  // ✅ Quarterly summary
  async getQuarterlySummary(year) {
    const [rows] = await db.query(`
      SELECT 
        quarter,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE year = ?
        AND period_type = 'quarterly'
        AND quarter IS NOT NULL
      GROUP BY quarter
      ORDER BY FIELD(quarter, 'Q1','Q2','Q3','Q4')
    `, [year]);

    return rows;
  },

  // ✅ Department-wise overall summary
  async getAllDepartments() {
    const [rows] = await db.query(`
      SELECT 
        department_id,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE period_type IN ('yearly', 'total_yearly')
      GROUP BY department_id
      ORDER BY department_id
    `);
    return rows;
  },

  // ✅ Department Yearly summary
  async getDepartmentYearlySummary(department_id, year) {
    const [rows] = await db.query(`
      SELECT 
        department_id,
        year,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE department_id = ? 
        AND year = ? 
        AND period_type IN ('yearly', 'total_yearly')
      GROUP BY department_id, year
    `, [department_id, year]);
    return rows[0] || null;
  },

  // ✅ Department Monthly summary
  async getDepartmentMonthlySummary(department_id, year) {
    const [rows] = await db.query(`
      SELECT 
        month_name,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE department_id = ? 
        AND year = ?
        AND period_type = 'monthly'
        AND month_name IS NOT NULL
      GROUP BY month_name
      ORDER BY FIELD(month_name,
        'January','February','March','April','May','June',
        'July','August','September','October','November','December')
    `, [department_id, year]);
    return rows;
  },

  // ✅ Department Quarterly summary
  async getDepartmentQuarterlySummary(department_id, year) {
    const [rows] = await db.query(`
      SELECT 
        quarter,
        SUM(revenue) AS total_revenue,
        SUM(expenses) AS total_expenses,
        (SUM(revenue) - SUM(expenses)) AS total_profit
      FROM financial_data
      WHERE department_id = ? 
        AND year = ?
        AND period_type = 'quarterly'
        AND quarter IS NOT NULL
      GROUP BY quarter
      ORDER BY FIELD(quarter, 'Q1','Q2','Q3','Q4')
    `, [department_id, year]);
    return rows;
  },
};

export default FinancialModel;
