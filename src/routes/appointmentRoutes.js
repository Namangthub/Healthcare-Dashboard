import express from 'express';
import AppointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// ✅ Get all appointments
router.get('/', AppointmentController.getAllAppointments);

// ✅ Get appointments for a specific day (format: YYYY-MM-DD)
router.get('/day/:date', AppointmentController.getAppointmentsForDay);

// ✅ Get appointments for a specific patient
router.get('/patient/:patientId', AppointmentController.getPatientAppointments);

// ✅ Create a new appointment
router.post('/', AppointmentController.createAppointment);

// ✅ Update appointment status
router.put('/:id/status', AppointmentController.updateAppointmentStatus);

// ✅ Get monthly appointment statistics (example: /stats/monthly/2025/11)
router.get('/stats/monthly/:year/:month', AppointmentController.getMonthlyStats);

// ✅ Get appointment type statistics
router.get('/stats/types', AppointmentController.getAppointmentTypeStats);

// ✅ Get combined dashboard data (appointments summary + trends)
router.get('/dashboard', AppointmentController.getAppointmentDashboardData);

export default router;
