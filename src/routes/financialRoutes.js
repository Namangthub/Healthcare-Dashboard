import express from 'express';
import FinancialController from '../controllers/financialController.js';

const router = express.Router();

// ✅ Routes for GET only
router.get('/', FinancialController.getAll);
router.get('/year/:year', FinancialController.getByYear);
router.get('/summary/month/year/:year', FinancialController.getMonthlySummary);
router.get('/summary/quarter/year/:year', FinancialController.getQuarterlySummary);
router.get('/summary/year/:year', FinancialController.getYearlySummary);
router.get('/department/:id', FinancialController.getByDepartment);

export default router;
