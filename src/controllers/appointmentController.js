import AppointmentModel from '../models/appointmentModel.js';
import PatientModel from '../models/patientModel.js';

export const AppointmentController = {
  // Get all appointments
  async getAllAppointments(req, res) {
    try {
      const appointments = await AppointmentModel.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get appointments for a specific day
  async getAppointmentsForDay(req, res) {
    try {
      const { date } = req.params;

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }

      const appointments = await AppointmentModel.getAppointmentsForDay(date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get appointments for a specific patient
  async getPatientAppointments(req, res) {
    try {
      const { patientId } = req.params;

      const patient = await PatientModel.getPatientById(patientId);
      if (!patient) {
        return res.status(404).json({ error: `Patient with ID ${patientId} not found` });
      }

      const appointments = await AppointmentModel.getPatientAppointments(patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new appointment
  async createAppointment(req, res) {
    try {
      const appointmentData = req.body;

      const requiredFields = ['patientId', 'date', 'time', 'type'];
      for (const field of requiredFields) {
        if (!appointmentData[field]) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }

      const patient = await PatientModel.getPatientById(appointmentData.patientId);
      if (!patient) {
        return res.status(404).json({ error: `Patient with ID ${appointmentData.patientId} not found` });
      }

      const newAppointment = await AppointmentModel.createAppointment(appointmentData);
      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update appointment status
  async updateAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      await AppointmentModel.updateAppointmentStatus(id, status);
      res.json({
        success: true,
        message: `Appointment ${id} status updated to ${status}`
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get monthly appointment statistics
  async getMonthlyStats(req, res) {
    try {
      const { month, year } = req.params;
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ error: 'Invalid month. Must be between 1 and 12' });
      }

      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 3000) {
        return res.status(400).json({ error: 'Invalid year' });
      }

      const stats = await AppointmentModel.getMonthlyStats(monthNum, yearNum);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get appointment type statistics
  async getAppointmentTypeStats(req, res) {
    try {
      const stats = await AppointmentModel.getAppointmentTypeStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get appointment dashboard data
  async getAppointmentDashboardData(req, res) {
    try {
      const [byType, allAppointments] = await Promise.all([
        AppointmentModel.getAppointmentTypeStats(),
        AppointmentModel.getAllAppointments()
      ]);

      // Monthly trends calculation
      const monthMap = new Map();

      allAppointments.forEach((appointment) => {
        if (!appointment.date) return;

        const date = new Date(appointment.date);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const monthYear = `${month} ${year}`;

        if (!monthMap.has(monthYear)) {
          monthMap.set(monthYear, {
            month: monthYear,
            appointments: 0,
            completed: 0,
            cancelled: 0,
            revenue: 0
          });
        }

        const monthData = monthMap.get(monthYear);
        monthData.appointments += 1;

        if (appointment.status === 'Completed') {
          monthData.completed += 1;
          monthData.revenue += 150 + Math.random() * 100; // placeholder
        } else if (appointment.status === 'Cancelled') {
          monthData.cancelled += 1;
        }
      });

      const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const sortedMonths = Array.from(monthMap.values()).sort((a, b) => {
        const [monthA, yearA] = a.month.split(' ');
        const [monthB, yearB] = b.month.split(' ');
        return yearA !== yearB
          ? parseInt(yearA) - parseInt(yearB)
          : monthsOrder.indexOf(monthA) - monthsOrder.indexOf(monthB);
      });

      // Weekly schedule
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const weeklySchedule = days.map((day) => {
        const dayAppointments = allAppointments.filter((apt) => {
          if (!apt.date) return false;
          const date = new Date(apt.date);
          const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
          return days[dayIndex] === day;
        });

        return {
          day,
          scheduled: dayAppointments.length,
          completed: dayAppointments.filter((apt) => apt.status === 'Completed').length,
          cancelled: dayAppointments.filter((apt) => apt.status === 'Cancelled').length,
          waitTime: Math.floor(10 + Math.random() * 20)
        };
      });

      res.json({
        monthlyTrends: sortedMonths,
        weeklySchedule,
        byType,
        upcoming: allAppointments.filter((apt) => apt.status === 'Scheduled'),
        completed: allAppointments.filter((apt) => apt.status === 'Completed'),
        monthly: sortedMonths,
        weekly: weeklySchedule
      });
    } catch (error) {
      console.error('Error in appointment dashboard API:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
