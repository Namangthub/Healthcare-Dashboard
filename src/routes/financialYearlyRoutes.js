import express from 'express';
import { FinancialYearlyController } from '../controllers/financialYearlyController.js';

const router = express.Router();

// ✅ Routes
router.get('/', FinancialYearlyController.getAll);
router.post('/', FinancialYearlyController.add);

export default router;
