import express from 'express';
import FinancialController from '../controllers/financialController.js';

const router = express.Router();

// 🔹 General financial routes
router.get('/', FinancialController.getAll);
router.get('/year/:year', FinancialController.getByYear);
router.get('/summary/year/:year', FinancialController.getYearlySummary);
router.get('/summary/monthly/year/:year', FinancialController.getMonthlySummary);
router.get('/summary/quarter/year/:year', FinancialController.getQuarterlySummary);

// Department-specific routes
router.get('/department/:id', FinancialController.getByDepartment);
router.get('/department/:id/yearly/:year', FinancialController.getDepartmentYearlySummary);
router.get('/department/:id/monthly/:year', FinancialController.getDepartmentMonthlySummary);
router.get('/department/:id/quarterly/:year', FinancialController.getDepartmentQuarterlySummary);

export default router;
