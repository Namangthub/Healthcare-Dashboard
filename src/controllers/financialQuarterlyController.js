import FinancialQuarterlyModel from '../models/financialQuarterlyModel.js';
import { formatCurrency, formatNumber } from '../utils/financialUtils.js';

export const FinancialQuarterlyController = {
  // ✅ Get all quarterly financial data
  async getAll(req, res) {
    try {
      const data = await FinancialQuarterlyModel.getAll();

      const formatted = data.map(row => ({
        ...row,
        revenue: formatCurrency(row.revenue),
        expenses: formatCurrency(row.expenses),
        profit: formatCurrency(row.profit),
        patients: formatNumber(row.patients)
      }));

      res.json(formatted);
    } catch (error) {
      console.error('Error fetching quarterly data:', error);
      res.status(500).json({ message: 'Failed to fetch quarterly financial data' });
    }
  },

  // ✅ Add new quarterly record
  async add(req, res) {
    try {
      const { quarter, revenue, expenses, profit, patients } = req.body;
      const id = await FinancialQuarterlyModel.add({ quarter, revenue, expenses, profit, patients });
      res.status(201).json({ message: 'Quarterly record added successfully', id });
    } catch (error) {
      console.error('Error adding quarterly data:', error);
      res.status(500).json({ message: 'Failed to add quarterly record' });
    }
  }
};
