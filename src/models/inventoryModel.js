// src/models/inventoryModel.js
import db from '../config/db.js';

const InventoryModel = {
  // Get all medical supplies
  getMedicalSupplies: async () => {
    const query = `SELECT * FROM inventory_supplies ORDER BY item_name ASC`;
    const [rows] = await db.query(query);

    return rows.map(item => ({
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
    const [rows] = await db.query(query);

    return rows.map(item => ({
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
    const updateQuery = `UPDATE inventory_supplies SET current_quantity = ? WHERE item_name = ?`;
    const [result] = await db.query(updateQuery, [quantity, itemName]);

    if (result.affectedRows === 0) throw new Error(`Medical supply '${itemName}' not found`);

    // Fetch updated item
    const [rows] = await db.query(`SELECT * FROM inventory_supplies WHERE item_name = ?`, [itemName]);
    const item = rows[0];

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

    const updateQuery = `UPDATE inventory_equipment SET status = ? WHERE equipment_name = ?`;
    const [result] = await db.query(updateQuery, [status, equipmentName]);

    if (result.affectedRows === 0) throw new Error(`Equipment '${equipmentName}' not found`);

    const [rows] = await db.query(`SELECT * FROM inventory_equipment WHERE equipment_name = ?`, [equipmentName]);
    const item = rows[0];

    return {
      equipment: item.equipment_name,
      status: item.status,
      lastMaintenance: item.last_maintenance,
      nextMaintenance: item.next_maintenance
    };
  },

  // Update equipment maintenance
  updateEquipmentMaintenance: async (equipmentName, lastMaintenance, nextMaintenance) => {
    const updateQuery = `
      UPDATE inventory_equipment
      SET last_maintenance = ?, next_maintenance = ?
      WHERE equipment_name = ?
    `;
    const [result] = await db.query(updateQuery, [lastMaintenance, nextMaintenance, equipmentName]);

    if (result.affectedRows === 0) throw new Error(`Equipment '${equipmentName}' not found`);

    const [rows] = await db.query(`SELECT * FROM inventory_equipment WHERE equipment_name = ?`, [equipmentName]);
    const item = rows[0];

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
      ORDER BY (current_quantity / minimum_quantity) ASC
    `;
    const [rows] = await db.query(query);

    return rows.map(item => ({
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
      WHERE next_maintenance <= ?
      ORDER BY next_maintenance ASC
    `;
    const [rows] = await db.query(query, [today]);

    return rows.map(item => ({
      equipment: item.equipment_name,
      status: item.status,
      lastMaintenance: item.last_maintenance,
      nextMaintenance: item.next_maintenance
    }));
  }
};

// ✅ Export default
export default InventoryModel;
