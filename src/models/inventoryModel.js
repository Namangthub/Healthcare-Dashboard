// src/models/InventoryModel.js
import db from '../config/db.js';

export const InventoryModel = {
  // Get all medical supplies
  getMedicalSupplies: async () => {
    try {
      const query = `
        SELECT *
        FROM inventory_supplies
        ORDER BY item_name ASC
      `;
      
      const result = await db.query(query);
      
      return result.rows.map(item => ({
        item: item.item_name,
        current: item.current_quantity,
        minimum: item.minimum_quantity,
        status: item.current_quantity > item.minimum_quantity ? 'Good' : 'Low',
        cost: parseFloat(item.unit_cost)
      }));
    } catch (error) {
      throw new Error(`Error getting medical supplies: ${error.message}`);
    }
  },

  // Get all equipment
  getEquipment: async () => {
    try {
      const query = `
        SELECT *
        FROM inventory_equipment
        ORDER BY equipment_name ASC
      `;
      
      const result = await db.query(query);
      
      return result.rows.map(item => ({
        equipment: item.equipment_name,
        status: item.status,
        lastMaintenance: item.last_maintenance,
        nextMaintenance: item.next_maintenance
      }));
    } catch (error) {
      throw new Error(`Error getting equipment: ${error.message}`);
    }
  },

  // Get complete inventory data (medical supplies and equipment)
  getInventory: async () => {
    try {
      const [supplies, equipment] = await Promise.all([
        InventoryModel.getMedicalSupplies(),
        InventoryModel.getEquipment()
      ]);
      
      return {
        medical_supplies: supplies,
        equipment: equipment
      };
    } catch (error) {
      throw new Error(`Error getting inventory: ${error.message}`);
    }
  },

  // Update medical supplies
  updateSupplies: async (itemName, quantity) => {
    try {
      const query = `
        UPDATE inventory_supplies
        SET current_quantity = $1
        WHERE item_name = $2
        RETURNING *
      `;
      
      const result = await db.query(query, [quantity, itemName]);
      
      if (result.rows.length === 0) {
        throw new Error(`Medical supply '${itemName}' not found`);
      }
      
      const item = result.rows[0];
      
      return {
        item: item.item_name,
        current: item.current_quantity,
        minimum: item.minimum_quantity,
        status: item.current_quantity > item.minimum_quantity ? 'Good' : 'Low',
        cost: parseFloat(item.unit_cost)
      };
    } catch (error) {
      throw new Error(`Error updating medical supplies: ${error.message}`);
    }
  },

  // Update equipment status
  updateEquipmentStatus: async (equipmentName, status) => {
    try {
      const validStatuses = ['Operational', 'Maintenance', 'Out of Service'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
      }
      
      const query = `
        UPDATE inventory_equipment
        SET status = $1
        WHERE equipment_name = $2
        RETURNING *
      `;
      
      const result = await db.query(query, [status, equipmentName]);
      
      if (result.rows.length === 0) {
        throw new Error(`Equipment '${equipmentName}' not found`);
      }
      
      return {
        equipment: result.rows[0].equipment_name,
        status: result.rows[0].status,
        lastMaintenance: result.rows[0].last_maintenance,
        nextMaintenance: result.rows[0].next_maintenance
      };
    } catch (error) {
      throw new Error(`Error updating equipment status: ${error.message}`);
    }
  },

  // Update equipment maintenance dates
  updateEquipmentMaintenance: async (equipmentName, lastMaintenance, nextMaintenance) => {
    try {
      const query = `
        UPDATE inventory_equipment
        SET last_maintenance = $1,
            next_maintenance = $2
        WHERE equipment_name = $3
        RETURNING *
      `;
      
      const result = await db.query(query, [lastMaintenance, nextMaintenance, equipmentName]);
      
      if (result.rows.length === 0) {
        throw new Error(`Equipment '${equipmentName}' not found`);
      }
      
      return {
        equipment: result.rows[0].equipment_name,
        status: result.rows[0].status,
        lastMaintenance: result.rows[0].last_maintenance,
        nextMaintenance: result.rows[0].next_maintenance
      };
    } catch (error) {
      throw new Error(`Error updating equipment maintenance: ${error.message}`);
    }
  },

  // Get low stock items
  getLowStockItems: async () => {
    try {
      const query = `
        SELECT *
        FROM inventory_supplies
        WHERE current_quantity <= minimum_quantity
        ORDER BY (current_quantity::float / minimum_quantity::float) ASC
      `;
      
      const result = await db.query(query);
      
      return result.rows.map(item => ({
        item: item.item_name,
        current: item.current_quantity,
        minimum: item.minimum_quantity,
        status: 'Low',
        cost: parseFloat(item.unit_cost)
      }));
    } catch (error) {
      throw new Error(`Error getting low stock items: ${error.message}`);
    }
  },

  // Get equipment due for maintenance
  getMaintenanceDueItems: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const query = `
        SELECT *
        FROM inventory_equipment
        WHERE next_maintenance <= $1
        ORDER BY next_maintenance ASC
      `;
      
      const result = await db.query(query, [today]);
      
      return result.rows.map(item => ({
        equipment: item.equipment_name,
        status: item.status,
        lastMaintenance: item.last_maintenance,
        nextMaintenance: item.next_maintenance
      }));
    } catch (error) {
      throw new Error(`Error getting maintenance due items: ${error.message}`);
    }
  }
};
