import express from 'express';
import StaffController from '../controllers/staffController.js';

const router = express.Router();

// Get all staff
router.get('/', StaffController.getAllStaff);

// Get staff count by role
router.get('/count-by-role', StaffController.getStaffCountByRole);

// Get staff count by department
router.get('/count-by-department', StaffController.getStaffCountByDepartment);

// Get staff by department
router.get('/department/:departmentId', StaffController.getStaffByDepartmentId);

// Get a staff member by ID
router.get('/:id', StaffController.getStaffById);

// Get patients assigned to a staff member
router.get('/:id/patients', StaffController.getPatientsByStaffId);

// Update staff status
router.put('/:id/status', StaffController.updateStaffStatus);

export default router;
