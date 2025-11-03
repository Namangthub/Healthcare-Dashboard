const db = require('../config/db');

// Extract data directly from healthcareData into our script
const patientVitals = {
  'P001': [
    {
      date: '2024-05-20',
      heartRate: 76,
      bloodPressure: '122/80',
      temperature: 98.6,
      oxygenSaturation: 97
    },
    {
      date: '2024-05-25',
      heartRate: 82,
      bloodPressure: '140/88',
      temperature: 99.2,
      oxygenSaturation: 95
    },
    {
      date: '2024-06-01',
      heartRate: 80,
      bloodPressure: '138/86',
      temperature: 99.0,
      oxygenSaturation: 94
    },
    {
      date: '2024-06-07',
      heartRate: 78,
      bloodPressure: '136/84',
      temperature: 98.8,
      oxygenSaturation: 95
    },
    {
      date: '2024-06-14',
      heartRate: 75,
      bloodPressure: '130/82',
      temperature: 98.7,
      oxygenSaturation: 96
    },
    {
      date: '2024-06-21',
      heartRate: 72,
      bloodPressure: '125/80',
      temperature: 98.4,
      oxygenSaturation: 98
    }
  ],
  'P002': [
    {
      date: '2024-05-15',
      heartRate: 88,
      bloodPressure: '145/90',
      temperature: 99.1,
      oxygenSaturation: 93
    },
    {
      date: '2024-05-22',
      heartRate: 90,
      bloodPressure: '150/92',
      temperature: 99.4,
      oxygenSaturation: 92
    },
    {
      date: '2024-05-29',
      heartRate: 86,
      bloodPressure: '142/88',
      temperature: 99.0,
      oxygenSaturation: 94
    },
    {
      date: '2024-06-05',
      heartRate: 82,
      bloodPressure: '138/86',
      temperature: 98.8,
      oxygenSaturation: 95
    },
    {
      date: '2024-06-12',
      heartRate: 78,
      bloodPressure: '130/84',
      temperature: 98.6,
      oxygenSaturation: 96
    },
    {
      date: '2024-06-19',
      heartRate: 75,
      bloodPressure: '128/82',
      temperature: 98.4,
      oxygenSaturation: 97
    }
  ],
  'P003': [
    {
      date: '2024-05-18',
      heartRate: 62,
      bloodPressure: '115/75',
      temperature: 97.8,
      oxygenSaturation: 98
    },
    {
      date: '2024-05-25',
      heartRate: 60,
      bloodPressure: '110/70',
      temperature: 97.6,
      oxygenSaturation: 99
    },
    {
      date: '2024-06-01',
      heartRate: 64,
      bloodPressure: '118/76',
      temperature: 98.0,
      oxygenSaturation: 98
    },
    {
      date: '2024-06-08',
      heartRate: 66,
      bloodPressure: '120/78',
      temperature: 98.2,
      oxygenSaturation: 97
    },
    {
      date: '2024-06-15',
      heartRate: 65,
      bloodPressure: '118/76',
      temperature: 98.0,
      oxygenSaturation: 99
    },
    {
      date: '2024-06-22',
      heartRate: 64,
      bloodPressure: '116/74',
      temperature: 97.9,
      oxygenSaturation: 99
    }
  ],
  'P004': [
    {
      date: '2024-05-16',
      heartRate: 102,
      bloodPressure: '130/85',
      temperature: 100.2,
      oxygenSaturation: 92
    },
    {
      date: '2024-05-18',
      heartRate: 98,
      bloodPressure: '128/82',
      temperature: 99.6,
      oxygenSaturation: 93
    },
    {
      date: '2024-05-20',
      heartRate: 94,
      bloodPressure: '125/80',
      temperature: 99.2,
      oxygenSaturation: 94
    },
    {
      date: '2024-05-23',
      heartRate: 90,
      bloodPressure: '122/78',
      temperature: 98.8,
      oxygenSaturation: 95
    },
    {
      date: '2024-05-26',
      heartRate: 86,
      bloodPressure: '120/76',
      temperature: 98.6,
      oxygenSaturation: 96
    },
    {
      date: '2024-05-29',
      heartRate: 82,
      bloodPressure: '118/74',
      temperature: 98.4,
      oxygenSaturation: 97
    }
  ],
  'P005': [
    {
      date: '2024-06-01',
      heartRate: 72,
      bloodPressure: '118/78',
      temperature: 98.6,
      oxygenSaturation: 99
    },
    {
      date: '2024-06-08',
      heartRate: 74,
      bloodPressure: '120/80',
      temperature: 98.7,
      oxygenSaturation: 98
    },
    {
      date: '2024-06-15',
      heartRate: 70,
      bloodPressure: '118/76',
      temperature: 98.5,
      oxygenSaturation: 99
    },
    {
      date: '2024-06-22',
      heartRate: 72,
      bloodPressure: '122/78',
      temperature: 98.8,
      oxygenSaturation: 98
    },
    {
      date: '2024-06-29',
      heartRate: 75,
      bloodPressure: '125/80',
      temperature: 99.0,
      oxygenSaturation: 97
    },
    {
      date: '2024-07-06',
      heartRate: 73,
      bloodPressure: '120/78',
      temperature: 98.7,
      oxygenSaturation: 98
    }
  ]
};

const vitalSignsAlerts = [
  {
    id: 'ALT001',
    patientId: 'P001',
    type: 'Blood Pressure',
    message: 'Elevated blood pressure reading (140/88) requires monitoring',
    severity: 'Medium',
    date: '2024-05-25',
    resolved: true
  },
  {
    id: 'ALT002',
    patientId: 'P002',
    type: 'Blood Pressure',
    message: 'Hypertension alert: 150/92 exceeds threshold',
    severity: 'High',
    date: '2024-05-22',
    resolved: false
  },
  {
    id: 'ALT003',
    patientId: 'P002',
    type: 'Oxygen Saturation',
    message: 'Oxygen level below 94% - monitor respiratory function',
    severity: 'Medium',
    date: '2024-05-15',
    resolved: true
  },
  {
    id: 'ALT004',
    patientId: 'P003',
    type: 'Heart Rate',
    message: 'Heart rate below normal range (60 BPM)',
    severity: 'Low',
    date: '2024-05-25',
    resolved: true
  },
  {
    id: 'ALT005',
    patientId: 'P004',
    type: 'Temperature',
    message: 'Fever alert: 100.2°F',
    severity: 'Medium',
    date: '2024-05-16',
    resolved: true
  },
  {
    id: 'ALT006',
    patientId: 'P004',
    type: 'Heart Rate',
    message: 'Tachycardia: Heart rate elevated at 102 BPM',
    severity: 'High',
    date: '2024-05-16',
    resolved: true
  },
  {
    id: 'ALT007',
    patientId: 'P004',
    type: 'Oxygen Saturation',
    message: 'Oxygen saturation at 92% - below normal',
    severity: 'High',
    date: '2024-05-16',
    resolved: false
  },
  {
    id: 'ALT008',
    patientId: 'P005',
    type: 'Temperature',
    message: 'Slight temperature elevation (99.0°F)',
    severity: 'Low',
    date: '2024-06-29',
    resolved: true
  }
];

async function seedVitalSigns() {
  const client = await db.pool.connect();
  
  try {
    console.log('Starting vital signs seeding...');
    
    await client.query('BEGIN');

    // Drop and recreate patient_vitals_current table
    await client.query(`
      DROP TABLE IF EXISTS patient_vitals_current;
      
      CREATE TABLE patient_vitals_current (
        patient_id VARCHAR(10) PRIMARY KEY,
        heart_rate INTEGER,
        blood_pressure VARCHAR(20),
        temperature DECIMAL(5,2),
        oxygen_saturation DECIMAL(5,2),
        weight DECIMAL(5,2) NULL,
        height DECIMAL(5,2) NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Drop and recreate patient_vital_history table
    await client.query(`
      DROP TABLE IF EXISTS patient_vital_history;
      
      CREATE TABLE patient_vital_history (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(10) NOT NULL,
        date DATE NOT NULL,
        heart_rate INTEGER,
        blood_pressure VARCHAR(20),
        temperature DECIMAL(5,2),
        oxygen_saturation DECIMAL(5,2),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Drop and recreate vital_sign_alerts table
    await client.query(`
      DROP TABLE IF EXISTS vital_sign_alerts;
      
      CREATE TABLE vital_sign_alerts (
        id VARCHAR(20) PRIMARY KEY,
        patient_id VARCHAR(10) NOT NULL,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        severity VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        resolved BOOLEAN DEFAULT FALSE
      );
    `);

    console.log('Vital signs tables created');
    
    // Seed patient vital history
    let vitalHistoryCount = 0;

    for (const patientId in patientVitals) {
      const patientVitalsArray = patientVitals[patientId];
      
      // Use the most recent entry as current vitals
      if (patientVitalsArray && patientVitalsArray.length > 0) {
        const current = patientVitalsArray[patientVitalsArray.length - 1];
        
        await client.query(`
          INSERT INTO patient_vitals_current
          (patient_id, heart_rate, blood_pressure, temperature, oxygen_saturation)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          patientId,
          current.heartRate,
          current.bloodPressure,
          current.temperature,
          current.oxygenSaturation
        ]);
      }
      
      // Insert all history entries
      for (const vital of patientVitalsArray) {
        await client.query(`
          INSERT INTO patient_vital_history
          (patient_id, date, heart_rate, blood_pressure, temperature, oxygen_saturation)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          patientId,
          vital.date,
          vital.heartRate,
          vital.bloodPressure,
          vital.temperature,
          vital.oxygenSaturation
        ]);
        
        vitalHistoryCount++;
      }
    }

    console.log(`Added ${vitalHistoryCount} vital history records`);
    
    // Seed vital sign alerts
    if (vitalSignsAlerts && vitalSignsAlerts.length > 0) {
      for (const alert of vitalSignsAlerts) {
        await client.query(`
          INSERT INTO vital_sign_alerts
          (id, patient_id, type, message, severity, date, resolved)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          alert.id,
          alert.patientId,
          alert.type,
          alert.message,
          alert.severity,
          alert.date,
          alert.resolved
        ]);
      }
      console.log(`Added ${vitalSignsAlerts.length} vital sign alerts`);
    } else {
      console.log('No vital sign alerts to add');
    }

    await client.query('COMMIT');
    console.log('Vital signs data committed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding vital signs:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run directly if called from command line
if (require.main === module) {
  seedVitalSigns()
    .then(() => {
      console.log('Vital signs seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('Vital signs seeding error:', err);
      process.exit(1);
    });
}

module.exports = seedVitalSigns;