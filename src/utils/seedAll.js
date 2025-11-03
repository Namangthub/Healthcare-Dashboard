// seedAll.js (Modern JS version)

import seedData from './seedData.js';
import seedOverviewStatistics from './seedOverviewStats.js';
import seedAppointments from './seedAppointments.js';
import seedAdditionalData from './seedAdditionalData.js';
import seedDemographics from './seedDemographics.js';

export async function seedAll() {
  try {
    console.log('=== Starting complete database seeding process ===');

    // 1. Seed base data
    console.log('\n--- Seeding base data ---');
    await seedData();

    // 2. Seed overview statistics
    console.log('\n--- Seeding overview statistics ---');
    await seedOverviewStatistics();

    // 3. Seed demographics
    console.log('\n--- Seeding demographics ---');
    await seedDemographics();

    // 4. Seed appointments
    console.log('\n--- Seeding appointments ---');
    await seedAppointments();

    // 5. Seed additional data (vitals, alerts, etc.)
    console.log('\n--- Seeding additional data ---');
    await seedAdditionalData();

    console.log('\n=== All seeding completed successfully ===');
  } catch (error) {
    console.error('❌ Error during seeding process:', error);
    process.exit(1);
  }
}

// Run directly if executed via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAll()
    .then(() => {
      console.log('✅ Complete seeding process finished');
      process.exit(0);
    })
    .catch(err => {
      console.error('🔥 Fatal seeding error:', err);
      process.exit(1);
    });
}

export default seedAll;
