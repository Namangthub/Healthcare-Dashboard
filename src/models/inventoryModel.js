// src/models/inventoryModel.js
import db from '../config/db.js';

const InventoryModel = {
  // Get all medical supplies
  getMedicalSupplies: async () => {
    const query = `SELECT * FROM inventory_supplies ORDER BY item_name ASC`;
    const result = await db.query(query);
    return result.rows.map(item => ({
      item: item.item_name,
      current: item.current_quantity,
      minimum: item.minimum_quantity,
      status: item.current_quantity > item.minimum_quantity ? 'Good' : 'Low',
      cost: parseFloat(item.unit_cost)
    }));
  },

  // Get all equipment
  getEquipment: async () => {
    const query = `SELECT * FROM inventory_equipment ORDER BY equipment_name ASC`;
    const result = await db.query(query);
    return result.rows.map(item => ({
      equipment: item.equipment_name,
      status: item.status,
      lastMaintenance: item.last_maintenance,
      nextMaintenance: item.next_maintenance
    }));
  },

  // Get complete inventory
  getInventory: async () => {
    const [supplies, equipment] = await Promise.all([
      InventoryModel.getMedicalSupplies(),
      InventoryModel.getEquipment()
    ]);
    return { medical_supplies: supplies, equipment };
  },

  // Update medical supplies
  updateSupplies: async (itemName, quantity) => {
    const query = `UPDATE inventory_supplies SET current_quantity=$1 WHERE item_name=$2 RETURNING *`;
    const result = await db.query(query, [quantity, itemName]);
    if (!result.rows.length) throw new Error(`Medical supply '${itemName}' not found`);
    const item = result.rows[0];
    return {
      item: item.item_name,
      current: item.current_quantity,
      minimum: item.minimum_quantity,
      status: item.current_quantity > item.minimum_quantity ? 'Good' : 'Low',
      cost: parseFloat(item.unit_cost)
    };
  },

  // Update equipment status
  updateEquipmentStatus: async (equipmentName, status) => {
    const validStatuses = ['Operational', 'Maintenance', 'Out of Service'];
    if (!validStatuses.includes(status)) throw new Error(`Invalid status: ${status}`);
    const query = `UPDATE inventory_equipment SET status=$1 WHERE equipment_name=$2 RETURNING *`;
    const result = await db.query(query, [status, equipmentName]);
    if (!result.rows.length) throw new Error(`Equipment '${equipmentName}' not found`);
    const item = result.rows[0];
    return {
      equipment: item.equipment_name,
      status: item.status,
      lastMaintenance: item.last_maintenance,
      nextMaintenance: item.next_maintenance
    };
  },

  // Update equipment maintenance
  updateEquipmentMaintenance: async (equipmentName, lastMaintenance, nextMaintenance) => {
    const query = `
      UPDATE inventory_equipment
      SET last_maintenance=$1, next_maintenance=$2
      WHERE equipment_name=$3
      RETURNING *
    `;
    const result = await db.query(query, [lastMaintenance, nextMaintenance, equipmentName]);
    if (!result.rows.length) throw new Error(`Equipment '${equipmentName}' not found`);
    const item = result.rows[0];
    return {
      equipment: item.equipment_name,
      status: item.status,
      lastMaintenance: item.last_maintenance,
      nextMaintenance: item.next_maintenance
    };
  },

  // Low stock items
  getLowStockItems: async () => {
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
  },

  // Maintenance due items
  getMaintenanceDueItems: async () => {
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
  }
};

// ✅ Export default
export default InventoryModel;
