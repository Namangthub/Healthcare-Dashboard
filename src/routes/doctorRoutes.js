import express from "express";

import {

  getAllDoctors,

  getDoctorById,

  getDoctorsByDepartment,

  getDoctorsByName,

  getAvailableDoctors
} from "../controllers/doctorController.js";
 
const router = express.Router();
 


router.get("/department/:department", getDoctorsByDepartment);

router.get("/name/:name", getDoctorsByName);

router.get("/available/list", getAvailableDoctors);

router.get("/", getAllDoctors);

router.get("/:id", getDoctorById);
 
export default router;

 