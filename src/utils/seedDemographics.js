const db = require('../config/db');
const path = require('path');
require('dotenv').config();

// Define the healthcare data directly to avoid import issues
const healthcareData = {
  demographics: {
    byAge: [
      { ageGroup: '0-12', label: 'Children', count: 287, percentage: 15.2, color: '#FF6B6B' },
      { ageGroup: '13-17', label: 'Teens', count: 134, percentage: 7.1, color: '#4ECDC4' },
      { ageGroup: '18-35', label: 'Young Adults', count: 567, percentage: 30.1, color: '#45B7D1' },
      { ageGroup: '36-50', label: 'Adults', count: 489, percentage: 25.9, color: '#96CEB4' },
      { ageGroup: '51-65', label: 'Middle Age', count: 298, percentage: 15.8, color: '#FFEAA7' },
      { ageGroup: '65+', label: 'Seniors', count: 112, percentage: 5.9, color: '#DDA0DD' }
    ],
    byGender: [
      { gender: 'Female', count: 1087, percentage: 57.6, color: '#FF6B9D' },
      { gender: 'Male', count: 798, percentage: 42.3, color: '#4A90E2' },
      { gender: 'Other', count: 2, percentage: 0.1, color: '#95A5A6' }
    ],
    byInsurance: [
      { type: 'Private Insurance', count: 945, percentage: 50.1, color: '#2ECC71' },
      { type: 'Medicare', count: 387, percentage: 20.5, color: '#3498DB' },
      { type: 'Medicaid', count: 298, percentage: 15.8, color: '#E74C3C' },
      { type: 'Self-Pay', count: 197, percentage: 10.4, color: '#F39C12' },
      { type: 'Other', count: 60, percentage: 3.2, color: '#9B59B6' }
    ]
  }
};

async function seedDemographics() {
  const client = await db.pool.connect();
  
  try {
    console.log('Starting demographics seeding...');
    
    await client.query('BEGIN');

    // Age demographics
    await client.query(`
      CREATE TABLE IF NOT EXISTS demographics_age (
        id SERIAL PRIMARY KEY,
        age_group VARCHAR(30) NOT NULL,
        label VARCHAR(30) NOT NULL,
        count INTEGER NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        color VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Gender demographics
    await client.query(`
      CREATE TABLE IF NOT EXISTS demographics_gender (
        id SERIAL PRIMARY KEY,
        gender VARCHAR(30) NOT NULL,
        count INTEGER NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        color VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insurance demographics
    await client.query(`
      CREATE TABLE IF NOT EXISTS demographics_insurance (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        count INTEGER NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        color VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Clear existing data
    await client.query('TRUNCATE demographics_age RESTART IDENTITY CASCADE');
    await client.query('TRUNCATE demographics_gender RESTART IDENTITY CASCADE');
    await client.query('TRUNCATE demographics_insurance RESTART IDENTITY CASCADE');
    
    // Insert age demographics
    for (const item of healthcareData.demographics.byAge) {
      await client.query(`
        INSERT INTO demographics_age (age_group, label, count, percentage, color)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        item.ageGroup,
        item.label,
        item.count,
        item.percentage,
        item.color
      ]);
    }
    console.log(`Added ${healthcareData.demographics.byAge.length} age demographic records`);
    
    // Insert gender demographics
    for (const item of healthcareData.demographics.byGender) {
      await client.query(`
        INSERT INTO demographics_gender (gender, count, percentage, color)
        VALUES ($1, $2, $3, $4)
      `, [
        item.gender,
        item.count,
        item.percentage,
        item.color
      ]);
    }
    console.log(`Added ${healthcareData.demographics.byGender.length} gender demographic records`);
    
    // Insert insurance demographics
    for (const item of healthcareData.demographics.byInsurance) {
      await client.query(`
        INSERT INTO demographics_insurance (type, count, percentage, color)
        VALUES ($1, $2, $3, $4)
      `, [
        item.type,
        item.count,
        item.percentage,
        item.color
      ]);
    }
    console.log(`Added ${healthcareData.demographics.byInsurance.length} insurance demographic records`);

    await client.query('COMMIT');
    console.log('Demographics data seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding demographics data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run directly if called from command line
if (require.main === module) {
  seedDemographics()
    .then(() => {
      console.log('Demographics seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('Demographics seeding error:', err);
      process.exit(1);
    });
}

module.exports = seedDemographics;