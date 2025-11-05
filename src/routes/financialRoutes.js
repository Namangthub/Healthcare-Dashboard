import express from 'express';
import FinancialController from '../controllers/financialController.js';

const router = express.Router();

// ✅ Routes for GET only
router.get('/', FinancialController.getAll);
router.get('/year/:year', FinancialController.getByYear);
router.get('/department/:id', FinancialController.getByDepartment);

export default router;
