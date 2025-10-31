import express from "express";

import {

  getAllBillings,

  getBillingById,

  getBillingsByPatientId,

  getBillingsByDate,

  getBillingsByStatus,

} from "../controllers/billingController.js";
 
const router = express.Router();
 

router.get("/", getAllBillings);
router.get("/:id", getBillingById);
router.get("/patient/:patientId", getBillingsByPatientId);
router.get("/date/:date", getBillingsByDate);
router.get("/status/:status", getBillingsByStatus);
 
export default router;

 