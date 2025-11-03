const seedData = require('./seedData');
const seedOverviewStatistics = require('./seedOverviewStats');
const seedAppointments = require('./seedAppointments');
const seedAdditionalData = require('./seedAdditionalData');
const seedDemographics = require('./seedDemographics');

async function seedAll() {
  try {
    console.log('=== Starting complete database seeding process ===');
    
    // First seed base data (departments, staff, patients)
    console.log('\n--- Seeding base data ---');
    await seedData();
    
    // Then seed overview statistics
    console.log('\n--- Seeding overview statistics ---');
    await seedOverviewStatistics();
    
    // Then seed demographics
    console.log('\n--- Seeding demographics ---');
    await seedDemographics();
    
    // Next seed appointments
    console.log('\n--- Seeding appointments ---');
    await seedAppointments();
    
    // Finally seed additional data (vitals, alerts, etc)
    console.log('\n--- Seeding additional data ---');
    await seedAdditionalData();
    
    console.log('\n=== All seeding completed successfully ===');
  } catch (error) {
    console.error('Error during seeding process:', error);
    process.exit(1);
  }
}

// Run directly if called from command line
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('Complete seeding process finished');
      process.exit(0);
    })
    .catch(err => {
      console.error('Fatal seeding error:', err);
      process.exit(1);
    });
}

module.exports = seedAll;