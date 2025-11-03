// src/app.js
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const db = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const departmentRoutes = require('./routes/departmentRoutes');
const patientRoutes = require('./routes/patientRoutes');
const staffRoutes = require('./routes/staffRoutes');
const qualityRoutes = require('./routes/qualityRoutes');
const financialRoutes = require('./routes/financialRoutes');
const vitalSignsRoutes = require('./routes/vitalSignsRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const overviewRoutes = require('./routes/overviewRoutes');
const demographicsRoutes = require('./routes/demographicsRoutes');
const activitiesRoutes = require('./routes/activitiesRoutes');

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

module.exports = app;