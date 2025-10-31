import express from "express";

import {

  getAllPatients,

  getPatientById,

  getPatientsByGender,

  getPatientsByAdmissionDate,

  getDischargedPatients,

  getPatientsByDoctor,

} from "../controllers/patientController.js";
 
const router = express.Router();
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.get("/filter/gender/:gender", getPatientsByGender);
router.get("/filter/admission/:date", getPatientsByAdmissionDate);
router.get("/status/discharged", getDischargedPatients);
router.get("/doctor/:doctorId", getPatientsByDoctor);
 
export default router;

 