import express from 'express';
import patientController from '../controllers/patientController.js';

const router = express.Router();

// Get patients by department - specific route first
router.get('/department/:departmentId', patientController.getPatientsByDepartment);

// Get patient demographics - specific route
router.get('/demographics', patientController.getDemographics);

// Get all patients
router.get('/', patientController.getSecurePatients);

// Get patient with full details
router.get('/:id/full', patientController.getPatientById);

// Get patient timeline
router.get('/:id/timeline', patientController.getPatientTimeline);

// Get patient vitals
router.get('/:id/vitals', patientController.getPatientVitals);

// Get secure patient by id - must come last as it uses the :id parameter
router.get('/:id', patientController.getSecurePatientById);

export default router;
