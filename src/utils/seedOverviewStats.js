// src/scripts/seedOverviewStatistics.js
import db from '../config/db.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
dotenv.config();

// ESM-compatible __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to healthcareData.js (try frontend first, fallback to local)
const healthcareDataPath = path.resolve(
  __dirname,
  '../../../healthcare-dashboard/src/data/healthcareData.js'
);

let healthcareData;

try {
  if (fs.existsSync(healthcareDataPath)) {
    const importedData = await import(healthcareDataPath);
    healthcareData = importedData.default || importedData;
    console.log('✅ Successfully loaded healthcare data from frontend');
  } else {
    const fallbackPath = path.resolve(__dirname, '../../data/healthcareData.js');
    const importedData = await import(fallbackPath);
    healthcareData = importedData.default || importedData;
    console.log('✅ Loaded healthcare data from local folder');
  }
} catch (error) {
  console.error('❌ Error loading healthcare data:', error.message);
  process.exit(1);
}

// Helper: Categorize statistics
function getCategoryForStat(statName) {
  if (statName.includes('patient') || statName === 'patientSatisfactionScore') return 'patients';
  if (statName.includes('appointment')) return 'appointments';
  if (statName.includes('bed') || statName === 'bedOccupancyRate') return 'facilities';
  if (statName.includes('staff') || statName.includes('doctor') || statName.includes('nurse')) return 'staff';
  if (statName === 'revenue' || statName === 'expenses') return 'financial';
  if (statName === 'averageWaitTime') return 'operations';
  if (statName.includes('alert') || statName.includes('pending')) return 'alerts';
  return 'general';
}

export async function seedOverviewStatistics() {
  const client = await db.pool.connect();

  try {
    console.log('🚀 Starting overview statistics seeding...');
    await client.query('BEGIN');

    // ✅ Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS overview_statistics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        value NUMERIC(10, 2) NOT NULL,
        category VARCHAR(50),
        description TEXT,
        unit VARCHAR(20),
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ✅ Clear existing data
    await client.query('TRUNCATE overview_statistics RESTART IDENTITY CASCADE');

    if (healthcareData?.overview) {
      const stats = [];
      const unitMap = {
        averageWaitTime: 'minutes',
        patientSatisfactionScore: 'rating',
        bedOccupancyRate: 'percent',
        revenue: 'currency',
        expenses: 'currency'
      };

      for (const [key, value] of Object.entries(healthcareData.overview)) {
        stats.push({
          name: key,
          value,
          category: getCategoryForStat(key),
          unit: unitMap[key] || 'count'
        });
      }

      // Insert or update each stat
      for (const stat of stats) {
        await client.query(
          `
          INSERT INTO overview_statistics (name, value, category, unit)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (name) DO UPDATE
          SET value = EXCLUDED.value,
              category = EXCLUDED.category,
              unit = EXCLUDED.unit,
              last_updated = CURRENT_TIMESTAMP
          `,
          [stat.name, stat.value, stat.category, stat.unit]
        );
      }

      console.log(`✅ Inserted or updated ${stats.length} overview statistics`);
    } else {
      console.warn('⚠️ No overview statistics found in healthcare data');
    }

    await client.query('COMMIT');
    console.log('🎉 Overview statistics seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding overview statistics:', error);
    throw error;
  } finally {
    client.release();
  }
}

// ✅ Run directly if executed from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedOverviewStatistics()
    .then(() => {
      console.log('✅ Overview statistics seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Overview statistics seeding error:', err);
      process.exit(1);
    });
}
