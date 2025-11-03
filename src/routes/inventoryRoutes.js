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

export default router;
