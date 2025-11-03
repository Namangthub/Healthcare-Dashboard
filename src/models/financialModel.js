// src/models/financialModel.js
import db from '../config/db.js';

// Model for financial data
export const FinancialModel = {
  // Get all financial data
  getFinancialData: async () => {
    try {
      // Get monthly data (mock data since we don't have this table)
      const monthlyData = [
        { month: 'Jan', revenue: 1245000, expenses: 987000, profit: 258000, patients: 2340 },
        { month: 'Feb', revenue: 1187000, expenses: 945000, profit: 242000, patients: 2234 },
        { month: 'Mar', revenue: 1298000, expenses: 1034000, profit: 264000, patients: 2456 },
        { month: 'Apr', revenue: 1356000, expenses: 1078000, profit: 278000, patients: 2567 },
        { month: 'May', revenue: 1423000, expenses: 1134000, profit: 289000, patients: 2689 },
        { month: 'Jun', revenue: 1389000, expenses: 1105000, profit: 284000, patients: 2613 }
      ];
      
      // Get department financial data
      const departmentQuery = `
        SELECT d.name AS department, df.revenue, df.percentage
        FROM department_financials df
        JOIN departments d ON d.id = df.department_id
        ORDER BY df.revenue DESC
      `;
      
      // Get payment methods (mock data since we don't have this table)
      const paymentMethods = [
        { method: 'Insurance', amount: 487600, percentage: 70.8 },
        { method: 'Credit Card', amount: 134500, percentage: 19.5 },
        { method: 'Cash', amount: 45300, percentage: 6.6 },
        { method: 'Check', amount: 21400, percentage: 3.1 }
      ];
      
      const departmentResult = await db.query(departmentQuery);
      
      return {
        monthly: monthlyData,
        byDepartment: departmentResult.rows,
        paymentMethods: paymentMethods
      };
    } catch (error) {
      throw new Error(`Error getting financial data: ${error.message}`);
    }
  },
  
  // Get financial data for a specific department
  getDepartmentFinancialData: async (departmentId) => {
    try {
      const query = `
        SELECT df.revenue, df.percentage
        FROM department_financials df
        WHERE df.department_id = $1
      `;
      
      const result = await db.query(query, [departmentId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error getting department financial data: ${error.message}`);
    }
  }
};
