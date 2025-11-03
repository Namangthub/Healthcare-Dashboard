import db from '../config/db.js';

export async function checkDatabaseHealth() {
  const client = await db.pool.connect();

  try {
    console.log('=== DATABASE HEALTH CHECK ===');

    const tables = [
      'departments',
      'department_staff',
      'staff',
      'patients',
      'patient_vitals_current',
      'patient_vital_history',
      'vital_sign_alerts',
      'timeline_events',
      'appointments',
      'overview_statistics',
      'quality_patient_satisfaction',
      'quality_wait_times',
      'quality_readmission_rates',
      'department_financials',
      'financial_monthly',
      'payment_methods',
      'demographics_age',
      'demographics_gender',
      'demographics_insurance',
      'inventory_supplies',
      'inventory_equipment',
      'recent_activities'
    ];

    console.log('\n=== Table Status ===');
    for (const table of tables) {
      const result = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        );
      `,
        [table]
      );

      const exists = result.rows[0].exists;
      const statusSymbol = exists ? '✅' : '❌';

      process.stdout.write(`${statusSymbol} ${table.padEnd(30, ' ')}`);

      if (exists) {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
        const count = parseInt(countResult.rows[0].count);
        const countStatus = count > 0 ? '✅' : '❌';
        console.log(`Records: ${count.toString().padStart(5, ' ')} ${countStatus}`);
      } else {
        console.log('Missing table');
      }
    }

    console.log('\n=== Data Validation ===');

    const overviewResult = await client.query(`
      SELECT name FROM overview_statistics
    `);

    const expectedStats = [
      'totalPatients', 'activePatients', 'newPatientsToday',
      'totalAppointments', 'todayAppointments', 'completedAppointments',
      'cancelledAppointments', 'pendingResults', 'criticalAlerts',
      'totalBeds', 'occupiedBeds', 'availableBeds',
      'bedOccupancyRate', 'totalStaff', 'staffOnDuty',
      'doctorsAvailable', 'nursesOnDuty', 'averageWaitTime',
      'patientSatisfactionScore', 'revenue', 'expenses'
    ];

    const overviewNames = overviewResult.rows.map(row => row.name);
    const missingStats = expectedStats.filter(stat => !overviewNames.includes(stat));

    if (missingStats.length === 0) {
      console.log('✅ Overview statistics: All expected fields present');
    } else {
      console.log(`❌ Overview statistics: Missing ${missingStats.length} expected fields: ${missingStats.join(', ')}`);
    }

    console.log('\n=== Database health check complete ===');
  } catch (error) {
    console.error('Error during database health check:', error);
  } finally {
    client.release();
  }
}

// ✅ Run directly if called from command line
if (import.meta.url === `file://${process.argv[1]}`) {
  checkDatabaseHealth()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Diagnostics error:', err);
      process.exit(1);
    });
}

export default checkDatabaseHealth;
