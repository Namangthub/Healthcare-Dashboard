import express from "express";

import {

  getAllStaff,

  getStaffById,

  getOnDutyStaff,

  getStaffByDepartment,

  getStaffByRole,

  getStaffByShift,

  getAvailableStaff,

} from "../controllers/staffController.js";
 
const router = express.Router();

router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.get("/status/onduty", getOnDutyStaff);
router.get("/status/available", getAvailableStaff);
router.get("/department/:deptId", getStaffByDepartment);
router.get("/role/:role", getStaffByRole);
router.get("/shift/:shift", getStaffByShift);
 
export default router;

 