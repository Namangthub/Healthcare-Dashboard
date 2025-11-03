import AppointmentModel from '../models/appointmentModel.js';
import PatientModel from '../models/patientModel.js';

const AppointmentController = {
  // ✅ Get all appointments
  async getAllAppointments(req, res) {
    try {
      const appointments = await AppointmentModel.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
    }
  },

  // ✅ Get appointments for a specific day
  async getAppointmentsForDay(req, res) {
    try {
      const { date } = req.params;
      const appointments = await AppointmentModel.getAppointmentsForDay(date);
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments for day:', error);
      res.status(500).json({ message: 'Failed to fetch appointments for this day', error: error.message });
    }
  },

  // ✅ Get appointments for a specific patient
  async getPatientAppointments(req, res) {
    try {
      const { patientId } = req.params;
      const appointments = await AppointmentModel.getPatientAppointments(patientId);
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      res.status(500).json({ message: 'Failed to fetch patient appointments', error: error.message });
    }
  },

  // ✅ Create a new appointment
  async createAppointment(req, res) {
    try {
      const data = req.body;
      const appointment = await AppointmentModel.createAppointment(data);
      res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ message: 'Failed to create appointment', error: error.message });
    }
  },

  // ✅ Update appointment status
  async updateAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await AppointmentModel.updateAppointmentStatus(id, status);
      res.json({ message: `Appointment status updated to ${status}` });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      res.status(500).json({ message: 'Failed to update appointment status', error: error.message });
    }
  },

  // ✅ Get monthly appointment statistics
  async getMonthlyStats(req, res) {
    try {
      const { month, year } = req.params;
      const stats = await AppointmentModel.getMonthlyStats(month, year);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      res.status(500).json({ message: 'Failed to fetch monthly stats', error: error.message });
    }
  },

  // ✅ Get appointment type breakdown
  async getAppointmentTypeStats(req, res) {
    try {
      const typeStats = await AppointmentModel.getAppointmentTypeStats();
      res.json(typeStats);
    } catch (error) {
      console.error('Error fetching appointment type stats:', error);
      res.status(500).json({ message: 'Failed to fetch appointment type stats', error: error.message });
    }
  },

  // ✅ Get combined dashboard data (appointments + patient summary)
  async getAppointmentDashboardData(req, res) {
    try {
      const appointments = await AppointmentModel.getAllAppointments();
      const typeStats = await AppointmentModel.getAppointmentTypeStats();
      const monthlyStats = await AppointmentModel.getMonthlyStats(new Date().getMonth() + 1, new Date().getFullYear());
      const patients = await PatientModel.getAllPatients();

      res.json({
        summary: {
          totalAppointments: appointments.length,
          totalPatients: patients.length,
          completed: monthlyStats.completed,
          cancelled: monthlyStats.cancelled,
        },
        appointmentTypes: typeStats,
        latestAppointments: appointments.slice(0, 10),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
    }
  },
};

export default AppointmentController;
