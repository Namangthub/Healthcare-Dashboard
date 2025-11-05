import FinancialModel from '../models/financialModel.js';

const FinancialController = {
  // GET /api/financial
  async getAll(req, res) {
    try {
      const data = await FinancialModel.getAll();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching all financial data:', error);
      res.status(500).json({ message: 'Server error while fetching data' });
    }
  },

  // GET /api/financial/year/:year
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

  // GET /api/financial/department/:name
  async getByDepartment(req, res) {
  try {
    const { id } = req.params; // Extract department ID
    const data = await FinancialModel.getByDepartment(id);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `No financial data found for department ID ${id}` });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data by department:', error);
    res.status(500).json({ message: 'Server error while fetching department data' });
  }
},
};

export default FinancialController;
