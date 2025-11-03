import express from 'express';
import VitalSignsController from '../controllers/vitalSignsController.js';

const router = express.Router();

// Get all vital signs
router.get('/', VitalSignsController.getAllVitalSigns);

// Get vital signs for a specific patient
router.get('/patient/:id', VitalSignsController.getPatientVitals);

// Add POST route only if the controller method exists
// If you need this route, make sure to implement the method in VitalSignsController
// Otherwise, comment it out or remove it
// router.post('/', VitalSignsController.createVitalSign);

export default router;
