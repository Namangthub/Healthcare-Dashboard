// src/seed/recentActivities.js
import db from '../config/db.js';

const recentActivities = [
  { id: 1, type: 'Patient Admission', message: 'Emma Davis admitted to Emergency Department', timestamp: '2024-06-12 14:30', priority: 'High' },
  { id: 2, type: 'Equipment Alert', message: 'X-Ray Machine #1 scheduled for maintenance', timestamp: '2024-06-12 14:15', priority: 'Medium' },
  { id: 3, type: 'Staff Update', message: 'Dr. James Rodriguez is now on call', timestamp: '2024-06-12 14:00', priority: 'Low' },
  { id: 4, type: 'Vital Alert', message: 'Patient P001 - High blood pressure reading', timestamp: '2024-06-12 13:45', priority: 'Medium' },
  { id: 5, type: 'Appointment', message: 'Michael Brown scheduled for follow-up', timestamp: '2024-06-12 13:30', priority: 'Low' }
];

export async function seedRecentActivities() {
  const client = await db.pool.connect();

  try {
    console.log('🚀 Starting recent activities seeding...');

    await client.query('BEGIN');

    // Drop and recreate the table
    await client.query(`
      DROP TABLE IF EXISTS recent_activities;

      CREATE TABLE recent_activities (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        priority VARCHAR(20) NOT NULL
      );
    `);

    console.log('✅ Recent activities table created');

    // Insert activities
    for (const activity of recentActivities) {
      await client.query(
        `
        INSERT INTO recent_activities (id, type, message, timestamp, priority)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [activity.id, activity.type, activity.message, activity.timestamp, activity.priority]
      );
    }

    await client.query('COMMIT');
    console.log(`🎯 Added ${recentActivities.length} recent activities`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding recent activities:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run directly if executed via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRecentActivities()
    .then(() => {
      console.log('✅ Recent activities seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('⚠️ Seeding error:', err);
      process.exit(1);
    });
}
