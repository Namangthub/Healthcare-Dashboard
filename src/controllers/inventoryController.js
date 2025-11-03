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

  // ✅ Update medical supplies
  async updateSupplies(req, res) {
    try {
      const { itemName } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined || isNaN(Number(quantity))) {
        return res.status(400).json({ message: 'Valid quantity is required' });
      }

      const updatedItem = await InventoryModel.updateSupplies(itemName, Number(quantity));
      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating supplies:', error);
      res.status(500).json({ 
        message: 'Failed to update medical supplies', 
        error: error.message 
      });
    }
  },

  // ✅ Update equipment status
  async updateEquipmentStatus(req, res) {
    try {
      const { equipmentName } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const updatedEquipment = await InventoryModel.updateEquipmentStatus(equipmentName, status);
      res.json(updatedEquipment);
    } catch (error) {
      console.error('Error updating equipment status:', error);
      res.status(500).json({ 
        message: 'Failed to update equipment status', 
        error: error.message 
      });
    }
  },

  // ✅ Update equipment maintenance dates
  async updateEquipmentMaintenance(req, res) {
    try {
      const { equipmentName } = req.params;
      const { lastMaintenance, nextMaintenance } = req.body;

      if (!lastMaintenance || !nextMaintenance) {
        return res.status(400).json({ 
          message: 'Both lastMaintenance and nextMaintenance dates are required' 
        });
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(lastMaintenance) || !dateRegex.test(nextMaintenance)) {
        return res.status(400).json({ 
          message: 'Invalid date format. Use YYYY-MM-DD' 
        });
      }

      const updatedEquipment = await InventoryModel.updateEquipmentMaintenance(
        equipmentName,
        lastMaintenance,
        nextMaintenance
      );

      res.json(updatedEquipment);
    } catch (error) {
      console.error('Error updating maintenance dates:', error);
      res.status(500).json({ 
        message: 'Failed to update equipment maintenance', 
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

  // ✅ Get equipment due for maintenance
  async getMaintenanceDueItems(req, res) {
    try {
      const items = await InventoryModel.getMaintenanceDueItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching maintenance due items:', error);
      res.status(500).json({ 
        message: 'Failed to fetch maintenance due items', 
        error: error.message 
      });
    }
  }
};

export default InventoryController;
