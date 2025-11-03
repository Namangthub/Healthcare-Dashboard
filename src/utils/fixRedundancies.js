import db from '../config/db.js';
import seedRecentActivities from './seedRecentActivities.js';
import seedVitalSigns from './seedVitalSigns.js';

export async function fixRedundancies() {
  console.log('=== Starting redundancy fixes ===');
  
  try {
    // 1. Fix recent activities
    console.log('\n--- Fixing recent activities ---');
    await seedRecentActivities();
    
    // 2. Fix vital signs
    console.log('\n--- Fixing vital signs ---');
    await seedVitalSigns();
    
    // 3. Update the package.json with new utility scripts
    console.log('\n--- Adding new scripts to package.json ---');
    console.log(`
    Add these scripts to your package.json:
    
    "fix:activities": "node src/utils/seedRecentActivities.js",
    "fix:vitals": "node src/utils/seedVitalSigns.js",
    "fix:redundancies": "node src/utils/fixRedundancies.js"
    `);
    
    console.log('\n=== Redundancy fixes completed! ===');
    console.log(`
    🔴 IMPORTANT: Don't forget to fix your app.js route order:
    1. Define specific routes FIRST (/api/patients/demographics, /api/departments/stats)
    2. Define general routes AFTER specific routes (/api/patients, /api/departments)
    `);
  } catch (error) {
    console.error('Error during redundancy fixes:', error);
    process.exit(1);
  }
}

// ✅ Run directly if called from command line
if (import.meta.url === `file://${process.argv[1]}`) {
  fixRedundancies()
    .then(() => {
      console.log('Fix redundancies script completed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Fix redundancies script error:', err);
      process.exit(1);
    });
}

export default fixRedundancies;
