import express from "express";

import {

  getAllDepartments,

  getDepartmentById,

  getDepartmentByName,

  getDoctorsInDepartment,

  getPatientsInDepartment,

  getAppointmentsByDepartment,

  getActiveDepartments,

  getDepartmentStats,

  getTopDepartmentsByAppointments,

  getDepartmentHead,

  getDepartmentCapacity

} from "../controllers/departmentController.js";
 
const router = express.Router();

router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById); 
router.get("/name/:name", getDepartmentByName);
router.get("/:id/doctors", getDoctorsInDepartment);
router.get("/:id/patients", getPatientsInDepartment);
router.get("/:id/appointments", getAppointmentsByDepartment);
router.get("/active/list", getActiveDepartments);
router.get("/:id/stats", getDepartmentStats);
router.get("/analytics/top", getTopDepartmentsByAppointments);
router.get("/:id/head", getDepartmentHead);
router.get("/:id/capacity", getDepartmentCapacity);
 
export default router;

 