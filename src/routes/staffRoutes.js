import express from 'express';
import StaffController from '../controllers/staffController.js';

const router = express.Router();

// Get all staff (with PII masked)
router.get('/', StaffController.getAllStaff);

// Get staff count by role
router.get('/count-by-role', StaffController.getStaffCountByRole);

// Get staff count by department
router.get('/count-by-department', StaffController.getStaffCountByDepartment);

// Get staff member by ID
router.get('/:id', StaffController.getStaffById);

// Get patients assigned to staff member
router.get('/:id/patients', StaffController.getPatientsByStaffId);

// Get staff by department ID
router.get('/department/:departmentId', StaffController.getStaffByDepartmentId);

// Update staff status
router.put('/:id/status', StaffController.updateStaffStatus);

export default router;
