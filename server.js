// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './src/config/db.js';
import { errorHandler } from './src/middleware/errorHandler.js';

// Import route files
import departmentRoutes from './src/routes/departmentRoutes.js';
import patientRoutes from './src/routes/patientRoutes.js';
import staffRoutes from './src/routes/staffRoutes.js';
import qualityRoutes from './src/routes/qualityRoutes.js';
import financialRoutes from './src/routes/financialRoutes.js';
import vitalSignsRoutes from './src/routes/vitalSignsRoutes.js';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import overviewRoutes from './src/routes/overviewRoutes.js';
import demographicsRoutes from './src/routes/demographicsRoutes.js';
import activitiesRoutes from './src/routes/activitiesRoutes.js';

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
const PORT = process.env.PORT || 47815;

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
