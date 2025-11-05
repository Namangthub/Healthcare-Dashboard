-- ===========================================
-- ✅ Financial Data for 8 Departments (2024–2025)
-- ===========================================

-- 🩺 MONTHLY DATA for 2024
INSERT INTO financial_data 
(department_name, year, month_number, month_name, quarter, period_type, revenue, expenses) VALUES
-- Cardiology
('Cardiology',2024,1,'January',1,'monthly',120000,80000),
('Cardiology',2024,2,'February',1,'monthly',125000,83000),
('Cardiology',2024,3,'March',1,'monthly',130000,85000),
('Cardiology',2024,4,'April',2,'monthly',132000,86000),
('Cardiology',2024,5,'May',2,'monthly',134000,87000),
('Cardiology',2024,6,'June',2,'monthly',136000,88000),
('Cardiology',2024,7,'July',3,'monthly',138000,90000),
('Cardiology',2024,8,'August',3,'monthly',140000,92000),
('Cardiology',2024,9,'September',3,'monthly',142000,93000),
('Cardiology',2024,10,'October',4,'monthly',144000,95000),
('Cardiology',2024,11,'November',4,'monthly',146000,97000),
('Cardiology',2024,12,'December',4,'monthly',148000,98000),

-- Orthopedics
('Orthopedics',2024,1,'January',1,'monthly',90000,60000),
('Orthopedics',2024,2,'February',1,'monthly',91000,61000),
('Orthopedics',2024,3,'March',1,'monthly',92000,62000),
('Orthopedics',2024,4,'April',2,'monthly',94000,63000),
('Orthopedics',2024,5,'May',2,'monthly',95000,64000),
('Orthopedics',2024,6,'June',2,'monthly',96000,65000),
('Orthopedics',2024,7,'July',3,'monthly',97000,66000),
('Orthopedics',2024,8,'August',3,'monthly',98000,67000),
('Orthopedics',2024,9,'September',3,'monthly',99000,68000),
('Orthopedics',2024,10,'October',4,'monthly',100000,69000),
('Orthopedics',2024,11,'November',4,'monthly',101000,70000),
('Orthopedics',2024,12,'December',4,'monthly',102000,71000),

-- Neurology
('Neurology',2024,1,'January',1,'monthly',110000,72000),
('Neurology',2024,2,'February',1,'monthly',112000,73000),
('Neurology',2024,3,'March',1,'monthly',113000,74000),
('Neurology',2024,4,'April',2,'monthly',114000,75000),
('Neurology',2024,5,'May',2,'monthly',115000,76000),
('Neurology',2024,6,'June',2,'monthly',116000,77000),
('Neurology',2024,7,'July',3,'monthly',117000,78000),
('Neurology',2024,8,'August',3,'monthly',118000,79000),
('Neurology',2024,9,'September',3,'monthly',119000,80000),
('Neurology',2024,10,'October',4,'monthly',120000,81000),
('Neurology',2024,11,'November',4,'monthly',121000,82000),
('Neurology',2024,12,'December',4,'monthly',122000,83000),

-- Pediatrics
('Pediatrics',2024,1,'January',1,'monthly',85000,55000),
('Pediatrics',2024,2,'February',1,'monthly',86000,56000),
('Pediatrics',2024,3,'March',1,'monthly',87000,57000),
('Pediatrics',2024,4,'April',2,'monthly',88000,58000),
('Pediatrics',2024,5,'May',2,'monthly',89000,59000),
('Pediatrics',2024,6,'June',2,'monthly',90000,60000),
('Pediatrics',2024,7,'July',3,'monthly',91000,61000),
('Pediatrics',2024,8,'August',3,'monthly',92000,62000),
('Pediatrics',2024,9,'September',3,'monthly',93000,63000),
('Pediatrics',2024,10,'October',4,'monthly',94000,64000),
('Pediatrics',2024,11,'November',4,'monthly',95000,65000),
('Pediatrics',2024,12,'December',4,'monthly',96000,66000),

-- General Medicine
('General Medicine',2024,1,'January',1,'monthly',100000,70000),
('General Medicine',2024,2,'February',1,'monthly',101000,71000),
('General Medicine',2024,3,'March',1,'monthly',102000,72000),
('General Medicine',2024,4,'April',2,'monthly',103000,73000),
('General Medicine',2024,5,'May',2,'monthly',104000,74000),
('General Medicine',2024,6,'June',2,'monthly',105000,75000),
('General Medicine',2024,7,'July',3,'monthly',106000,76000),
('General Medicine',2024,8,'August',3,'monthly',107000,77000),
('General Medicine',2024,9,'September',3,'monthly',108000,78000),
('General Medicine',2024,10,'October',4,'monthly',109000,79000),
('General Medicine',2024,11,'November',4,'monthly',110000,80000),
('General Medicine',2024,12,'December',4,'monthly',111000,81000),

-- Emergency
('Emergency',2024,1,'January',1,'monthly',130000,95000),
('Emergency',2024,2,'February',1,'monthly',131000,96000),
('Emergency',2024,3,'March',1,'monthly',132000,97000),
('Emergency',2024,4,'April',2,'monthly',133000,98000),
('Emergency',2024,5,'May',2,'monthly',134000,99000),
('Emergency',2024,6,'June',2,'monthly',135000,100000),
('Emergency',2024,7,'July',3,'monthly',136000,101000),
('Emergency',2024,8,'August',3,'monthly',137000,102000),
('Emergency',2024,9,'September',3,'monthly',138000,103000),
('Emergency',2024,10,'October',4,'monthly',139000,104000),
('Emergency',2024,11,'November',4,'monthly',140000,105000),
('Emergency',2024,12,'December',4,'monthly',141000,106000),

-- Oncology
('Oncology',2024,1,'January',1,'monthly',115000,78000),
('Oncology',2024,2,'February',1,'monthly',116000,79000),
('Oncology',2024,3,'March',1,'monthly',117000,80000),
('Oncology',2024,4,'April',2,'monthly',118000,81000),
('Oncology',2024,5,'May',2,'monthly',119000,82000),
('Oncology',2024,6,'June',2,'monthly',120000,83000),
('Oncology',2024,7,'July',3,'monthly',121000,84000),
('Oncology',2024,8,'August',3,'monthly',122000,85000),
('Oncology',2024,9,'September',3,'monthly',123000,86000),
('Oncology',2024,10,'October',4,'monthly',124000,87000),
('Oncology',2024,11,'November',4,'monthly',125000,88000),
('Oncology',2024,12,'December',4,'monthly',126000,89000),

-- ENT
('ENT',2024,1,'January',1,'monthly',80000,50000),
('ENT',2024,2,'February',1,'monthly',81000,51000),
('ENT',2024,3,'March',1,'monthly',82000,52000),
('ENT',2024,4,'April',2,'monthly',83000,53000),
('ENT',2024,5,'May',2,'monthly',84000,54000),
('ENT',2024,6,'June',2,'monthly',85000,55000),
('ENT',2024,7,'July',3,'monthly',86000,56000),
('ENT',2024,8,'August',3,'monthly',87000,57000),
('ENT',2024,9,'September',3,'monthly',88000,58000),
('ENT',2024,10,'October',4,'monthly',89000,59000),
('ENT',2024,11,'November',4,'monthly',90000,60000),
('ENT',2024,12,'December',4,'monthly',91000,61000);

-- 🧮 Generate 2025 (10% growth)
INSERT INTO financial_data (department_name, year, month_number, month_name, quarter, period_type, revenue, expenses)
SELECT 
  department_name,
  2025 AS year,
  month_number,
  month_name,
  quarter,
  'monthly',
  ROUND(revenue * 1.10, 2),
  ROUND(expenses * 1.10, 2)
FROM financial_data
WHERE year = 2024 AND period_type = 'monthly';

-- 🧾 QUARTERLY DATA
INSERT INTO financial_data (department_name, year, month_number, month_name, quarter, period_type, revenue, expenses)
SELECT 
  department_name,
  year,
  NULL AS month_number,
  NULL AS month_name,
  quarter,
  'quarterly',
  SUM(revenue),
  SUM(expenses)
FROM financial_data
WHERE period_type = 'monthly'
GROUP BY department_name, year, quarter;

-- 📅 YEARLY DATA
INSERT INTO financial_data (department_name, year, month_number, month_name, quarter, period_type, revenue, expenses)
SELECT 
  department_name,
  year,
  NULL AS month_number,
  NULL AS month_name,
  NULL AS quarter,
  'yearly',
  SUM(revenue),
  SUM(expenses)
FROM financial_data
WHERE period_type = 'monthly'
GROUP BY department_name, year;
