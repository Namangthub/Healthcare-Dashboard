import express from "express";

import {

  getAllMedicalRecords,

  getMedicalRecordById,

  getMedicalRecordsByPatientId,

  getMedicalRecordsByAppointmentId,

  getMedicalRecordsByDoctorId,

  getMedicalRecordsByDiagnosis,

  getMedicalRecordsByDateRange,

} from "../controllers/medicalRecordController.js";
 
const router = express.Router();
 


router.get("/", getAllMedicalRecords);
router.get("/:id", getMedicalRecordById);
router.get("/patient/:patientId", getMedicalRecordsByPatientId);
router.get("/appointment/:appointmentId", getMedicalRecordsByAppointmentId);
router.get("/doctor/:doctorId", getMedicalRecordsByDoctorId);
router.get("/diagnosis/:diagnosis", getMedicalRecordsByDiagnosis);
router.get("/date", getMedicalRecordsByDateRange);
 
export default router;

 