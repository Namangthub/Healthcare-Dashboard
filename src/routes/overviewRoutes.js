import express from 'express';
import OverviewController from '../controllers/overviewController.js';
import PatientController from '../controllers/patientController.js'; // ✅ Add this line

const router = express.Router();

// ✅ Get overview stats
router.get('/', OverviewController.getOverviewStatistics);

// ✅ Get all patients
router.get('/patients', PatientController.getAllPatients);

export default router;
