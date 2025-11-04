import { VitalsModel } from '../models/vitalSignsModel.js';

export const VitalsController = {
  // ✅ Get all vitals (overview)
  async getAllVitalSigns(req, res) {
    try {
      const vitals = await VitalsModel.getAllVitals();
      res.json(vitals);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch all vitals', error: error.message });
    }
  },

  // ✅ Get specific patient vitals
  async getPatientVitals(req, res) {
    try {
      const { patientId } = req.params;
      const current = await VitalsModel.getCurrentVitals(patientId);
      const history = await VitalsModel.getVitalHistory(patientId);
      const alerts = await VitalsModel.getVitalAlerts(patientId);
      res.json({ current, history, alerts });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch patient vitals', error: error.message });
    }
  },

  // ✅ Record vitals
  async recordVitals(req, res) {
    try {
      const { patientId, bloodPressure, heartRate, temperature, oxygenSaturation, weight, height } = req.body;
      const result = await VitalsModel.recordVitals(patientId, {
        bloodPressure,
        heartRate,
        temperature,
        oxygenSaturation,
        weight,
        height
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Failed to record vitals', error: error.message });
    }
  },

  // ✅ Get alerts for one patient
  async getPatientAlerts(req, res) {
    try {
      const { patientId } = req.params;
      const alerts = await VitalsModel.getVitalAlerts(patientId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
    }
  },

  // ✅ Resolve alert
  async resolveAlert(req, res) {
    try {
      const { alertId } = req.params;
      const result = await VitalsModel.resolveAlert(alertId);
      res.json({ message: 'Alert resolved successfully', alert: result });
    } catch (error) {
      res.status(500).json({ message: 'Failed to resolve alert', error: error.message });
    }
  }
};
