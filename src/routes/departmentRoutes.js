// src/routes/departmentRoutes.js
import express from 'express';
import { DepartmentController } from '../controllers/departmentController.js';
import OverviewController from '../controllers/overviewController.js';

const router = express.Router();

// Get all departments
router.get('/', DepartmentController.getAllDepartments);

// Get overview statistics
router.get('/stats', OverviewController.getOverviewStatistics);

// Get a department by ID
router.get('/:id', DepartmentController.getDepartmentById);

// Get enhanced department data
router.get('/:id/enhanced', DepartmentController.getEnhancedDepartment);

// Get staff in a department
router.get('/:id/staff', DepartmentController.getDepartmentStaff);

// Get patients in a department
router.get('/:id/patients', DepartmentController.getDepartmentPatients);

export default router;
