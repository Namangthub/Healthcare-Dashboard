import express from "express";

import dotenv from "dotenv";
 
// ✅ Load environment variables

dotenv.config();
 
// ✅ Import Middleware

import errorHandler from "./src/middleware/errorHandler.js";
 
// ✅ Import Routes

import patientRoutes from "./src/routes/patientRoutes.js";

import doctorRoutes from "./src/routes/doctorRoutes.js";

import departmentRoutes from "./src/routes/departmentRoutes.js";

import staffRoutes from "./src/routes/staffRoutes.js";

import appointmentRoutes from "./src/routes/appointmentRoutes.js";

import medicalRecordRoutes from "./src/routes/medicalRecordRoutes.js";

import billingRoutes from "./src/routes/billingRoutes.js";

import emergencyCaseRoutes from "./src/routes/emergencyCaseRoutes.js";

import labTestRoutes from "./src/routes/labTestRoutes.js";
 
// ✅ Initialize Express App

const app = express();
 
// ✅ Middleware

app.use(express.json());
 
// ✅ Base Routes

app.use("/api/patients", patientRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/staff", staffRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/medicalrecords", medicalRecordRoutes);

app.use("/api/billings", billingRoutes);

app.use("/api/emergencycases", emergencyCaseRoutes);

app.use("/api/labtests", labTestRoutes);
 
// ✅ Health Check Route

app.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    message: "System API is running smoothly 🚀",

    version: "1.0.0",

  });

});
 
// ✅ Global Error Handler (always last)

app.use(errorHandler);
 
// ✅ Start the Server

const PORT = process.env.PORT || 3001;
 
app.listen(PORT, () => {

  console.log(`✅ Server running successfully on http://localhost:${PORT}`);

});
 
// ✅ Export app for testing (optional)

export default app;

 