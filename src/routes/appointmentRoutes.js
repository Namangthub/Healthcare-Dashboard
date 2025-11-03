import express from 'express';
import AppointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// Get all appointments
router.get('/', AppointmentController.getAllAppointments);

// Get appointments for a specific day
router.get('/day/:date', AppointmentController.getAppointmentsForDay);

// Get appointments for a specific patient
router.get('/patient/:patientId', AppointmentController.getPatientAppointments);

// Create a new appointment
router.post('/', AppointmentController.createAppointment);

// Update appointment status
router.put('/:id/status', AppointmentController.updateAppointmentStatus);

// Get monthly appointment statistics
router.get('/stats/monthly/:year/:month', AppointmentController.getMonthlyStats);

// Get appointment types statistics
router.get('/stats/types', AppointmentController.getAppointmentTypeStats);

// Appointment dashboard data
router.get('/dashboard', AppointmentController.getAppointmentDashboardData);

export default router;
