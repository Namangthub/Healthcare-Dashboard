// src/controllers/inventoryController.js
import  InventoryModel from '../models/inventoryModel.js';

export const InventoryController = {
  // ✅ Get complete inventory data
  async getInventory(req, res) {
    try {
      const inventory = await InventoryModel.getInventory();
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ 
        message: 'Failed to fetch inventory', 
        error: error.message 
      });
    }
  },

  // ✅ Get only medical supplies
  async getMedicalSupplies(req, res) {
    try {
      const supplies = await InventoryModel.getMedicalSupplies();
      res.json(supplies);
    } catch (error) {
      console.error('Error fetching medical supplies:', error);
      res.status(500).json({ 
        message: 'Failed to fetch medical supplies', 
        error: error.message 
      });
    }
  },

  // ✅ Get only equipment
  async getEquipment(req, res) {
    try {
      const equipment = await InventoryModel.getEquipment();
      res.json(equipment);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      res.status(500).json({ 
        message: 'Failed to fetch equipment', 
        error: error.message 
      });
    }
  },

  // ✅ Get low stock items
  async getLowStockItems(req, res) {
    try {
      const items = await InventoryModel.getLowStockItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      res.status(500).json({ 
        message: 'Failed to fetch low stock items', 
        error: error.message 
      });
    }
  },
};

export default InventoryController;
