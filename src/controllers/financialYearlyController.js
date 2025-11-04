import FinancialYearlyModel from '../models/financialYearlyModel.js';
import { formatCurrency, formatNumber } from '../utils/financialUtils.js';

export const FinancialYearlyController = {
  // ✅ Get all yearly financial data
  async getAll(req, res) {
    try {
      const data = await FinancialYearlyModel.getAll();

      const formatted = data.map(row => ({
        ...row,
        revenue: formatCurrency(row.revenue),
        expenses: formatCurrency(row.expenses),
        profit: formatCurrency(row.profit),
        patients: formatNumber(row.patients)
      }));

      res.json(formatted);
    } catch (error) {
      console.error('Error fetching yearly data:', error);
      res.status(500).json({ message: 'Failed to fetch yearly financial data' });
    }
  },

  // ✅ Add new yearly record
  async add(req, res) {
    try {
      const { year, revenue, expenses, profit, patients } = req.body;
      const id = await FinancialYearlyModel.add({ year, revenue, expenses, profit, patients });
      res.status(201).json({ message: 'Yearly record added successfully', id });
    } catch (error) {
      console.error('Error adding yearly data:', error);
      res.status(500).json({ message: 'Failed to add yearly record' });
    }
  }
};
