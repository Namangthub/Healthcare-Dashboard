import express from 'express';
import { DemographicsController } from '../controllers/demographicsController.js';

const router = express.Router();

// Get all demographics
router.get('/', DemographicsController.getAllDemographics);

export default router;
