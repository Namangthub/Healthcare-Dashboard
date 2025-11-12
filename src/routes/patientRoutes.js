import express from 'express';
import PatientController from '../controllers/patientController.js';

const router = express.Router();

// ✅ Get patients by department - specific route first
router.get('/department/:departmentId', PatientController.getPatientsByDepartment);

// ✅ Get patient demographics
router.get('/demographics', PatientController.getDemographics);

// ✅ Get all *active* patients only
router.get('/active', PatientController.getActivePatients);

router.get('/status/:status', PatientController.getPatientsByStatus);

// ✅ Get all patients (includes discharged + active)
router.get('/', PatientController.getAllPatients);

// ✅ Get patient with full details
router.get('/:id/full', PatientController.getPatientById);

// ✅ Get patient timeline
router.get('/:id/timeline', PatientController.getPatientTimeline);

// ✅ Get patient vitals
router.get('/:id/vitals', PatientController.getPatientVitals);

// ✅ Get secure (masked) patient by id — must come last
router.get('/:id', PatientController.getSecurePatientById);

export default router;
