const db = require('../config/db');
const path = require('path');
require('dotenv').config();

// Get imported data from healthcareData.js
const healthcareDataPath = path.resolve(__dirname, '../../../healthcare-dashboard/src/data/healthcareData.js');
let healthcareData;

try {
  const importedData = require(healthcareDataPath);
  // Handle ES Module
  if (importedData.__esModule && importedData.default) {
    healthcareData = importedData.default;
  } else {
    healthcareData = importedData;
  }
  console.log('Successfully loaded healthcare data');
} catch (error) {
  console.error('Error loading healthcare data:', error.message);
  process.exit(1);
}

async function seedOverviewStatistics() {
  const client = await db.pool.connect();
  
  try {
    console.log('Starting overview statistics seeding...');
    
    await client.query('BEGIN');

    // Check if table exists, if not create it
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

    // Clear existing data if any
    await client.query('TRUNCATE overview_statistics RESTART IDENTITY CASCADE');
    
    // Insert overview statistics
    if (healthcareData.overview) {
      const stats = [];
      
      // Map statistics with proper units and categories
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
          value: value, 
          category: getCategoryForStat(key),
          unit: unitMap[key] || 'count'
        });
      }
      
      let insertCount = 0;
      for (const stat of stats) {
        await client.query(`
          INSERT INTO overview_statistics (name, value, category, unit) 
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (name) DO UPDATE SET
          value = $2, 
          category = $3,
          unit = $4,
          last_updated = CURRENT_TIMESTAMP
        `, [stat.name, stat.value, stat.category, stat.unit]);
        insertCount++;
      }
      
      console.log(`Added ${insertCount} overview statistics`);
    } else {
      console.log('No overview statistics found in healthcare data');
    }

    await client.query('COMMIT');
    console.log('Overview statistics seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding overview statistics:', error);
    throw error; // Rethrow to catch in the calling function
  } finally {
    client.release();
  }
}

// Helper function to categorize statistics
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

// Run directly if called from command line
if (require.main === module) {
  seedOverviewStatistics()
    .then(() => {
      console.log('Overview statistics seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('Overview statistics seeding error:', err);
      process.exit(1);
    });
}

module.exports = seedOverviewStatistics;