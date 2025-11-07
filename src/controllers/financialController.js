import FinancialModel from '../models/financialModel.js';

const FinancialController = {
  // ✅ Get all data
  async getAll(req, res) {
    try {
      const data = await FinancialModel.getAll();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching all financial data:', error);
      res.status(500).json({ message: 'Server error while fetching data' });
    }
  },

  // ✅ Get data by year
  async getByYear(req, res) {
    try {
      const { year } = req.params;
      const data = await FinancialModel.getByYear(year);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data by year:', error);
      res.status(500).json({ message: 'Server error while fetching year data' });
    }
  },

  // ✅ Get data by department
  async getByDepartment(req, res) {
    try {
      const { id } = req.params;
      const data = await FinancialModel.getByDepartment(id);
      if (!data.length)
        return res.status(404).json({ message: `No financial data for department ID ${id}` });
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data by department:', error);
      res.status(500).json({ message: 'Server error while fetching department data' });
    }
  },

  // ✅ Yearly summary
  async getYearlySummary(req, res) {
    try {
      const { year } = req.params;
      const summary = await FinancialModel.getYearlySummary(year);
      if (!summary)
        return res.status(404).json({ message: `No financial data for year ${year}` });
      res.status(200).json({ message: `Yearly summary for ${year}`, data: summary });
    } catch (error) {
      console.error('Error fetching yearly summary:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  // ✅ Monthly summary
  async getMonthlySummary(req, res) {
    try {
      const { year } = req.params;
      const data = await FinancialModel.getMonthlySummary(year);
      if (!data.length)
        return res.status(404).json({ message: `No monthly data for ${year}` });
      res.status(200).json({ message: `Monthly summary for ${year}`, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  // ✅ Quarterly summary
  async getQuarterlySummary(req, res) {
    try {
      const { year } = req.params;
      const data = await FinancialModel.getQuarterlySummary(year);
      if (!data.length)
        return res.status(404).json({ message: `No quarterly data for ${year}` });
      res.status(200).json({ message: `Quarterly summary for ${year}`, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  // ✅ Get all departments summary
async getAllDepartments(req, res) {
  try {
    const data = await FinancialModel.getAllDepartments();
    if (!data.length)
      return res.status(404).json({ message: 'No department financial data found' });
    res.status(200).json({ message: 'All departments financial summary', data });
  } catch (error) {
    console.error('Error fetching department summary:', error);
    res.status(500).json({ message: 'Server error while fetching department summary' });
  }
},

  // ✅ Department Yearly summary
  async getDepartmentYearlySummary(req, res) {
    try {
      const { id, year } = req.params;
      const summary = await FinancialModel.getDepartmentYearlySummary(id, year);
      if (!summary)
        return res.status(404).json({ message: `No yearly data for department ${id} in ${year}` });
      res.status(200).json({ message: `Yearly summary for department ${id} in ${year}`, data: summary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  // ✅ Department Monthly summary
  async getDepartmentMonthlySummary(req, res) {
    try {
      const { id, year } = req.params;
      const data = await FinancialModel.getDepartmentMonthlySummary(id, year);
      if (!data.length)
        return res.status(404).json({ message: `No monthly data for department ${id} in ${year}` });
      res.status(200).json({ message: `Monthly summary for department ${id} in ${year}`, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  // ✅ Department Quarterly summary
  async getDepartmentQuarterlySummary(req, res) {
    try {
      const { id, year } = req.params;
      const data = await FinancialModel.getDepartmentQuarterlySummary(id, year);
      if (!data.length)
        return res.status(404).json({ message: `No quarterly data for department ${id} in ${year}` });
      res.status(200).json({ message: `Quarterly summary for department ${id} in ${year}`, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  },
};

export default FinancialController;
