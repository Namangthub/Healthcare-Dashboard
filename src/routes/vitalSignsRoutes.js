import express from 'express';
import { VitalsController } from '../controllers/vitalSignsController.js';

const router = express.Router();

// ✅ Get all patients' vitals (root route)
router.get('/', VitalsController.getAllVitalSigns);

// ✅ Get vitals for one patient (current, history, alerts)
router.get('/patient/:patientId', VitalsController.getPatientVitals);

// ✅ Record new vitals
router.post('/record', VitalsController.recordVitals);

// ✅ Get alerts for a patient
router.get('/alerts/:patientId', VitalsController.getPatientAlerts);

// ✅ Resolve alert
router.put('/alerts/:alertId/resolve', VitalsController.resolveAlert);

export default router;
