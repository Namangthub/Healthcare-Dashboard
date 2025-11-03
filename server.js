// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import route files
import departmentRoutes from './routes/departmentRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import qualityRoutes from './routes/qualityRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import vitalSignsRoutes from './routes/vitalSignsRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import overviewRoutes from './routes/overviewRoutes.js';
import demographicsRoutes from './routes/demographicsRoutes.js';
import activitiesRoutes from './routes/activitiesRoutes.js';

// Initialize environment variables
dotenv.config();

// Create express app
const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date()
  });
});

// Mount all routes
app.use('/api/departments', departmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/vitals', vitalSignsRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/api/demographics', demographicsRoutes);
app.use('/api/activities', activitiesRoutes);

// Centralized error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await db.testConnection();
    console.log(`✅ Database connected successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  }
});

export default app;
