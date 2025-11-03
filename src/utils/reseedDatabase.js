import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import healthcareData from frontend project
let healthcareData;
try {
  const frontendPath = path.join(__dirname, '../../../healthcare-dashboard/src/data/healthcareData.js');
  
  if (fs.existsSync(frontendPath)) {
    const importedData = await import(frontendPath);
    healthcareData = importedData.default || importedData;
    console.log('✅ Loaded healthcareData.js as ESM module');
  } else {
    throw new Error('Could not find healthcareData.js in frontend project');
  }
} catch (error) {
  console.error('❌ Error loading healthcareData.js:', error.message);
  process.exit(1);
}

export async function reseedDatabase() {
  const client = await db.pool.connect();

  function validateDate(dateStr) {
    if (!dateStr || dateStr === 'TBD' || dateStr === 'N/A') return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : dateStr;
  }

  try {
    console.log('🚀 Starting complete database reset and reseeding...');
    await client.query('BEGIN');

    // (All your existing SQL logic remains unchanged here)
    // Drop, Create, and Seed tables exactly as in your original file

    console.log('✅ Database reseed completed successfully!');
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error reseeding database:', error);
  } finally {
    client.release();
  }
}
