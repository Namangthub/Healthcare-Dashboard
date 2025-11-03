import express from 'express';
import PatientController from '../controllers/patientController.js';

const router = express.Router();

// Get patients by department - specific route first
router.get('/department/:departmentId', PatientController.getPatientsByDepartment);

// Get patient demographics - specific route
router.get('/demographics', PatientController.getDemographics);

// Get all patients
router.get('/', PatientController.getSecurePatients);

// Get patient with full details
router.get('/:id/full', PatientController.getPatientById);

// Get patient timeline
router.get('/:id/timeline', PatientController.getPatientTimeline);

// Get patient vitals
router.get('/:id/vitals', PatientController.getPatientVitals);

// Get secure patient by id - must come last as it uses the :id parameter
router.get('/:id', PatientController.getSecurePatientById);

export default router;
