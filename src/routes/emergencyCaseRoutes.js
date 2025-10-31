import express from "express";

import {

  getAllEmergencyCases,

  getEmergencyCaseById,

  getEmergencyCasesBySeverity,

  getEmergencyCasesByStatus,

  getEmergencyCasesByDoctor,

  getEmergencyCasesByDate,

} from "../controllers/emergencyCasesController.js";
 
const router = express.Router();
 
router.get("/", getAllEmergencyCases);
router.get("/:id", getEmergencyCaseById);
router.get("/severity/:level", getEmergencyCasesBySeverity);
router.get("/status/:status", getEmergencyCasesByStatus);
router.get("/doctor/:doctorId", getEmergencyCasesByDoctor);
router.get("/date/:date", getEmergencyCasesByDate);
 
export default router;

 