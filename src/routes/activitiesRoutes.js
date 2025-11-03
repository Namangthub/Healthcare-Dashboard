import express from 'express';
import { ActivitiesController } from '../controllers/activitiesController.js';

const router = express.Router();

// Get recent activities
router.get('/recent', ActivitiesController.getRecentActivities);

export default router;
