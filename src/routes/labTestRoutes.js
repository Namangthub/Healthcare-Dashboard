import express from "express";

import {

  getAllLabTests,

  getLabTestById,

  getLabTestsByPatientId,

  getLabTestsByStatus,

  getRecentLabTests,

} from "../controllers/labTestController.js";
 
const router = express.Router();

router.get("/", getAllLabTests);
router.get("/:id", getLabTestById);
router.get("/patient/:patientId", getLabTestsByPatientId);
router.get("/status/:status", getLabTestsByStatus);
router.get("/recent/tests", getRecentLabTests);
 
export default router;

 