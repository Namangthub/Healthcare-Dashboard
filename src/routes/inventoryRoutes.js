import express from 'express';
import InventoryController from '../controllers/inventoryController.js';

const router = express.Router();

// Get complete inventory data
router.get('/', InventoryController.getInventory);

// Get only medical supplies
router.get('/supplies', InventoryController.getMedicalSupplies);

// Get only equipment
router.get('/equipment', InventoryController.getEquipment);

// Get low stock items
router.get('/supplies/low-stock', InventoryController.getLowStockItems);

// Get equipment due for maintenance
router.get('/equipment/maintenance-due', InventoryController.getMaintenanceDueItems);

// Update medical supplies
router.put('/supplies/:itemName', InventoryController.updateSupplies);

// Update equipment status
router.put('/equipment/:equipmentName/status', InventoryController.updateEquipmentStatus);

// Update equipment maintenance dates
router.put('/equipment/:equipmentName/maintenance', InventoryController.updateEquipmentMaintenance);

export default router;
