// src/server.js
import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import db from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
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

// Initialize express app
const app = express();

// Middlewares
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

// API routes
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

// Error handling
app.use(errorHandler);

// Start the server
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  db.testConnection()
    .then(() => console.log(`Database connected: ${new Date().toISOString()}`))
    .catch(err => console.error('Database connection error:', err));
});

export default app;
