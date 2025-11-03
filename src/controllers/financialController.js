// src/controllers/financialController.js
import FinancialModel from '../models/financialModel.js';

export const FinancialController = {
  // ✅ Get all financial data
  async getFinancialData(req, res) {
    try {
      const financialData = await FinancialModel.getFinancialData();
      res.json(financialData);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      res.status(500).json({ 
        message: 'Failed to fetch financial data', 
        error: error.message 
      });
    }
  },

  // ✅ Get financial data for a specific department
  async getDepartmentFinancialData(req, res) {
    try {
      const { departmentId } = req.params;
      const financialData = await FinancialModel.getDepartmentFinancialData(departmentId);

      if (!financialData) {
        return res.status(404).json({ 
          message: `Financial data for department ID ${departmentId} not found` 
        });
      }

      res.json(financialData);
    } catch (error) {
      console.error('Error fetching department financial data:', error);
      res.status(500).json({ 
        message: 'Failed to fetch department financial data', 
        error: error.message 
      });
    }
  }
};

export default FinancialController;
