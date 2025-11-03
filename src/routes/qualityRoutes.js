import express from 'express';
import QualityController from '../controllers/qualityController.js';

const router = express.Router();

// Get all quality metrics
router.get('/', QualityController.getQualityMetrics);

// Get quality metrics for a specific department
router.get('/department/:departmentId', QualityController.getDepartmentQualityMetrics);

export default router;
