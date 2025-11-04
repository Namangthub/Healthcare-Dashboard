import express from 'express';
import { FinancialQuarterlyController } from '../controllers/financialQuarterlyController.js';

const router = express.Router();

// ✅ Routes
router.get('/', FinancialQuarterlyController.getAll);
router.post('/', FinancialQuarterlyController.add);

export default router;
