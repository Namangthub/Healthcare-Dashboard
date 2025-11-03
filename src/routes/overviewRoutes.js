import express from 'express';
import OverviewController from '../controllers/overviewController.js';

const router = express.Router();

// Get all overview statistics
router.get('/', OverviewController.getOverviewStatistics);

export default router;
