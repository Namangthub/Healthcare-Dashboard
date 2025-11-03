import express from 'express';
import FinancialController from '../controllers/financialController.js';

const router = express.Router();

// Get all financial data
router.get('/', FinancialController.getFinancialData);

// Get financial data for a specific department
router.get('/department/:departmentId', FinancialController.getDepartmentFinancialData);

export default router;
