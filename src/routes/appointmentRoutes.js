import express from "express";

import {

  getAllAppointments,

  getAppointmentById,

  getAppointmentsByDoctor,

  getAppointmentsByPatient,

  getAppointmentsByDate,

  getAppointmentsByStatus,

  getUpcomingAppointments,

  getCompletedAppointments,

  getCancelledAppointments,

  getAppointmentsByDepartment

} from "../controllers/appointmentController.js";
 
const router = express.Router();
 
// ✅ Always put specific routes first

router.get("/", getAllAppointments);

router.get("/doctor/:doctorId", getAppointmentsByDoctor);

router.get("/patient/:patientId", getAppointmentsByPatient);

router.get("/date/:date", getAppointmentsByDate);

router.get("/status/:status", getAppointmentsByStatus);

router.get("/upcoming/list", getUpcomingAppointments);

router.get("/completed/list", getCompletedAppointments);

router.get("/cancelled/list", getCancelledAppointments);

router.get("/department/:deptId", getAppointmentsByDepartment);
 
// ✅ Keep this LAST

router.get("/:id", getAppointmentById);
 
export default router;

 