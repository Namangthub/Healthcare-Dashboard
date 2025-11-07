import express from 'express';
import { DemographicsController } from '../controllers/demographicsController.js';

const router = express.Router();

// ✅ Get all demographics (Age + Gender + Insurance)
router.get('/', DemographicsController.getAllDemographics);

// ✅ Get demographics by Age
router.get('/age', DemographicsController.getByAge);

// ✅ Get demographics by Gender
router.get('/gender', DemographicsController.getByGender);

// ✅ Get demographics by Insurance
router.get('/insurance', DemographicsController.getByInsurance);

export default router;
