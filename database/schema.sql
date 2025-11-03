--DDL SCRIPT FOR DATABSE--

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  total_patients INT DEFAULT 0,
  today_patients INT DEFAULT 0,
  avg_wait_time INT DEFAULT 0,
  satisfaction DECIMAL(3,1) DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  capacity INT DEFAULT 0,
  current_occupancy INT DEFAULT 0,
  critical_cases INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);




CREATE TABLE department_staff (
  department_id INT PRIMARY KEY,
  doctors INT DEFAULT 0,
  nurses INT DEFAULT 0,
  support INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);




CREATE TABLE staff (
  id VARCHAR(10) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  department_id INT,
  status ENUM('On Duty','Off Duty','On Call','On Leave') NOT NULL,
  shift VARCHAR(50) NOT NULL,
  experience INT NOT NULL,
  patient_count INT DEFAULT 0,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  rating DECIMAL(3,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);



CREATE TABLE patients (
  id VARCHAR(10) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  date_of_birth DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  insurance VARCHAR(50) NOT NULL,
  emergency_contact TEXT NOT NULL,
  department_id INT,
  doctor_id VARCHAR(10),
  admission_date DATE NOT NULL,
  status ENUM('In Treatment','Scheduled','Critical','Discharged') NOT NULL,
  severity ENUM('High','Medium','Low') NOT NULL,
  room VARCHAR(20) NOT NULL,
  diagnosis TEXT NOT NULL,
  last_visit DATE,
  next_appointment DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (doctor_id) REFERENCES staff(id) ON DELETE SET NULL
);




CREATE TABLE patient_vitals_current (
  patient_id VARCHAR(10) PRIMARY KEY,
  blood_pressure VARCHAR(10) NOT NULL,
  heart_rate INT NOT NULL,
  temperature DECIMAL(4,1) NOT NULL,
  oxygen_saturation INT NOT NULL,
  weight DECIMAL(5,1) NOT NULL,
  height DECIMAL(5,1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);




CREATE TABLE patient_vital_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id VARCHAR(10),
  date DATE NOT NULL,
  heart_rate INT NOT NULL,
  blood_pressure VARCHAR(10) NOT NULL,
  temperature DECIMAL(4,1) NOT NULL,
  oxygen_saturation INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(patient_id, date),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);




CREATE TABLE vital_sign_alerts (
  id VARCHAR(10) PRIMARY KEY,
  patient_id VARCHAR(10),
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  severity ENUM('High','Medium','Low') NOT NULL,
  date DATE NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);




CREATE TABLE timeline_events (
  id VARCHAR(15) PRIMARY KEY,
  patient_id VARCHAR(10),
  date DATE NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  type ENUM('admission','visit','test','medication','discharge','surgery','other') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);




CREATE TABLE medications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE patient_medications (
  patient_id VARCHAR(10),
  medication_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (patient_id, medication_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
);


 
 
CREATE TABLE allergies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 

 
CREATE TABLE patient_allergies (
  patient_id VARCHAR(10),
  allergy_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (patient_id, allergy_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (allergy_id) REFERENCES allergies(id) ON DELETE CASCADE
);

 

 
CREATE TABLE appointments (
  id VARCHAR(20) PRIMARY KEY,
  patient_id VARCHAR(10),
  staff_id VARCHAR(10),
  date DATE NOT NULL,
  time TIME NOT NULL,
  department_id INT,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  duration INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

 

 
CREATE TABLE staff_schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id VARCHAR(10),
  date DATE NOT NULL,
  shift VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(staff_id, date),
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
);

 

 
CREATE TABLE financial_monthly (
  id INT AUTO_INCREMENT PRIMARY KEY,
  month VARCHAR(20) NOT NULL,
  revenue DECIMAL(12,2) NOT NULL,
  expenses DECIMAL(12,2) NOT NULL,
  profit DECIMAL(12,2) NOT NULL,
  patients INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 

 
CREATE TABLE department_financials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department_id INT,
  revenue DECIMAL(12,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

 

 
CREATE TABLE payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 
 
 
CREATE TABLE quality_patient_satisfaction (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department_id INT,
  score DECIMAL(3,1) NOT NULL,
  responses INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE quality_wait_times (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department_id INT,
  avg_wait INT NOT NULL,
  target INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE quality_readmission_rates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department_id INT,
  rate DECIMAL(5,2) NOT NULL,
  target DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);



 
CREATE TABLE overview_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_patients INT NOT NULL,
  active_patients INT NOT NULL,
  new_patients_today INT NOT NULL,
  total_appointments INT NOT NULL,
  today_appointments INT NOT NULL,
  completed_appointments INT NOT NULL,
  cancelled_appointments INT NOT NULL,
  pending_results INT NOT NULL,
  critical_alerts INT NOT NULL,
  total_beds INT NOT NULL,
  occupied_beds INT NOT NULL,
  available_beds INT NOT NULL,
  bed_occupancy_rate DECIMAL(5,2) NOT NULL,
  total_staff INT NOT NULL,
  staff_on_duty INT NOT NULL,
  doctors_available INT NOT NULL,
  nurses_on_duty INT NOT NULL,
  average_wait_time INT NOT NULL,
  patient_satisfaction_score DECIMAL(3,1) NOT NULL,
  revenue DECIMAL(12,2) NOT NULL,
  expenses DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

 

 
CREATE TABLE demographics_age (
  id INT AUTO_INCREMENT PRIMARY KEY,
  age_group VARCHAR(30) NOT NULL,
  label VARCHAR(30) NOT NULL,
  count INT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE demographics_gender (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gender VARCHAR(30) NOT NULL,
  count INT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE demographics_insurance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  count INT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

 

 
CREATE TABLE recent_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  priority VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);