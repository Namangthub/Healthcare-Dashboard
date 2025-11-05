
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------
-- 1) Departments (8 entries)
-- --------------------------
INSERT INTO departments (id, name, code, total_patients, today_patients, avg_wait_time, satisfaction, revenue, capacity, current_occupancy, critical_cases)
VALUES
(1, 'Cardiology', 'CARD', 320, 12, 25, 4.5, 1250000.00, 60, 45, 4),
(2, 'Orthopedics', 'ORTH', 250, 8, 18, 4.3, 980000.00, 50, 34, 2),
(3, 'Neurology', 'NEUR', 180, 6, 30, 4.1, 760000.00, 40, 28, 3),
(4, 'Pediatrics', 'PED', 400, 15, 20, 4.6, 540000.00, 70, 55, 1),
(5, 'General Medicine', 'GEN', 800, 30, 22, 4.2, 2100000.00, 120, 95, 10),
(6, 'Emergency', 'EMER', 1200, 40, 10, 4.0, 3200000.00, 150, 120, 25),
(7, 'Oncology', 'ONC', 130, 3, 45, 4.0, 980000.00, 30, 22, 6),
(8, 'ENT', 'ENT', 140, 5, 15, 4.4, 420000.00, 35, 26, 1);

-- -------------------------------
-- 2) Department staff counts
-- -------------------------------
INSERT INTO department_staff (department_id, doctors, nurses, support)
VALUES
(1, 8, 16, 6),
(2, 6, 12, 5),
(3, 5, 10, 4),
(4, 10, 18, 7),
(5, 12, 24, 10),
(6, 15, 30, 12),
(7, 4, 8, 3),
(8, 5, 10, 3);

-- --------------------------
-- 3) Staff (doctors/nurses)
-- --------------------------
-- staff ids S001..S030 (doctors + some nurses/admin)
INSERT INTO staff (id, first_name, last_name, full_name, role, department_id, status, shift, experience, patient_count, phone, email, specialty, rating)
VALUES
('S001','Rohit','Sharma','Rohit Sharma','Cardiologist',1,'On Duty','Morning',15,120,'9810010101','rohit.sharma@hospital.in','Interventional Cardiology',4.7),
('S002','Priya','Singh','Priya Singh','Cardiologist',1,'On Duty','Evening',10,80,'9810010102','priya.singh@hospital.in','Non-invasive Cardiology',4.5),
('S003','Anil','Verma','Anil Verma','Orthopedic Surgeon',2,'On Duty','Morning',12,95,'9810010103','anil.verma@hospital.in','Joint Replacement',4.6),
('S004','Meera','Patel','Meera Patel','Orthopedic Surgeon',2,'On Call','Night',9,70,'9810010104','meera.patel@hospital.in','Spine Surgery',4.4),
('S005','Sanjay','Kumar','Sanjay Kumar','Neurologist',3,'On Duty','Morning',14,65,'9810010105','sanjay.kumar@hospital.in','Stroke',4.3),
('S006','Ananya','Gupta','Ananya Gupta','Pediatrician',4,'On Duty','Morning',8,150,'9810010106','ananya.gupta@hospital.in','Neonatology',4.8),
('S007','Vikram','Rao','Vikram Rao','General Physician',5,'On Duty','Evening',11,210,'9810010107','vikram.rao@hospital.in','Internal Medicine',4.2),
('S008','Nisha','Jain','Nisha Jain','Emergency Physician',6,'On Duty','Night',7,320,'9810010108','nisha.jain@hospital.in','Trauma',4.1),
('S009','Karan','Mehta','Karan Mehta','Oncologist',7,'On Duty','Morning',13,40,'9810010109','karan.mehta@hospital.in','Medical Oncology',4.0),
('S010','Rhea','Kapoor','Rhea Kapoor','ENT Surgeon',8,'On Duty','Morning',9,50,'9810010110','rhea.kapoor@hospital.in','Otology',4.4),
('S011','Pooja','Shah','Pooja Shah','Nurse',1,'On Duty','Morning',6,0,'9810010111','pooja.shah@hospital.in','Nursing',4.1),
('S012','Amit','Bhatt','Amit Bhatt','Nurse',2,'On Duty','Evening',5,0,'9810010112','amit.bhatt@hospital.in','Nursing',4.0),
('S013','Deepa','Reddy','Deepa Reddy','Nurse',3,'Off Duty','Night',7,0,'9810010113','deepa.reddy@hospital.in','Nursing',4.2),
('S014','Rakesh','Nair','Rakesh Nair','Nurse',4,'On Duty','Morning',4,0,'9810010114','rakesh.nair@hospital.in','Nursing',4.3),
('S015','Sunita','Verma','Sunita Verma','Nurse',5,'On Duty','Evening',10,0,'9810010115','sunita.verma@hospital.in','Nursing',4.4),
('S016','Harish','Kohli','Harish Kohli','Support Staff',6,'On Duty','Night',12,0,'9810010116','harish.kohli@hospital.in','Support',3.9),
('S017','Preeti','Joshi','Preeti Joshi','Support Staff',6,'On Duty','Morning',6,0,'9810010117','preeti.joshi@hospital.in','Support',4.0),
('S018','Manish','Agarwal','Manish Agarwal','Pharmacist',5,'On Duty','Morning',9,0,'9810010118','manish.agarwal@hospital.in','Pharmacy',4.2),
('S019','Gita','Iyer','Gita Iyer','Radiologist',3,'On Call','Evening',11,0,'9810010119','gita.iyer@hospital.in','Diagnostic Radiology',4.3),
('S020','Vivek','Malhotra','Vivek Malhotra','Physiotherapist',2,'On Duty','Morning',8,0,'9810010120','vivek.malhotra@hospital.in','Physiotherapy',4.1),
('S021','Sakshi','Desai','Sakshi Desai','Dietician',4,'On Duty','Morning',6,0,'9810010121','sakshi.desai@hospital.in','Nutrition',4.5),
('S022','Arjun','Bose','Arjun Bose','Surgeon',5,'On Duty','Morning',16,110,'9810010122','arjun.bose@hospital.in','General Surgery',4.6),
('S023','Ritu','Khan','Ritu Khan','Psychiatrist',5,'On Duty','Evening',10,65,'9810010123','ritu.khan@hospital.in','Behavioral Medicine',4.0),
('S024','Sumit','Roy','Sumit Roy','Anesthesiologist',1,'On Call','Night',14,0,'9810010124','sumit.roy@hospital.in','Anesthesia',4.5),
('S025','Isha','Nambiar','Isha Nambiar','Nurse',6,'On Duty','Morning',5,0,'9810010125','isha.nambiar@hospital.in','Nursing',4.1),
('S026','Aakash','Chopra','Aakash Chopra','Cardiology Fellow',1,'On Call','Evening',3,20,'9810010126','aakash.chopra@hospital.in','Cardiology',4.0),
('S027','Devika','Menon','Devika Menon','Oncology Nurse',7,'On Duty','Morning',7,0,'9810010127','devika.menon@hospital.in','Oncology Nursing',4.2),
('S028','Naveen','Saxena','Naveen Saxena','ENT Nurse',8,'On Duty','Evening',6,0,'9810010128','naveen.saxena@hospital.in','Nursing',4.1),
('S029','Raman','Kumar','Raman Kumar','Junior Doctor',5,'On Duty','Morning',2,30,'9810010129','raman.kumar@hospital.in','Medicine',3.9),
('S030','Leena','Bhardwaj','Leena Bhardwaj','Nurse',5,'Off Duty','Night',4,0,'9810010130','leena.bhardwaj@hospital.in','Nursing',4.0);

-- --------------------------
-- 4) Medications (10 meds)
-- --------------------------
INSERT INTO medications (id, name)
VALUES
(1,'Paracetamol'),
(2,'Amoxicillin'),
(3,'Aspirin'),
(4,'Metformin'),
(5,'Atorvastatin'),
(6,'Omeprazole'),
(7,'Ceftriaxone'),
(8,'Salbutamol'),
(9,'Diclofenac'),
(10,'Captopril');

-- --------------------------
-- 5) Allergies (6 common)
-- --------------------------
INSERT INTO allergies (id, name)
VALUES
(1,'Penicillin'),
(2,'NSAIDs'),
(3,'Peanuts'),
(4,'Seafood'),
(5,'Latex'),
(6,'None');

-- --------------------------
-- 6) Patients (50 patients)
-- ids P001..P050
-- --------------------------
INSERT INTO patients (id, first_name, last_name, full_name, age, gender, date_of_birth, phone, email, address, insurance, emergency_contact, department_id, doctor_id, admission_date, status, severity, room, diagnosis, last_visit, next_appointment, notes)
VALUES
('P001','Rahul','Mehta','Rahul Mehta',45,'Male','1980-06-15','9811000001','rahul.mehta@example.com','C-22, Lajpat Nagar, Delhi','Star Health','Rohit Mehta - 9811000002',5,'S007','2025-09-05','Discharged','High','D101','Hypertension','2025-10-20','2025-11-10','Follow-up required'),
('P002','Sneha','Kumar','Sneha Kumar',32,'Female','1993-02-11','9811000003','sneha.kumar@example.com','Flat 5B, Andheri West, Mumbai','ICICI Lombard','Ankit Kumar - 9811000004',1,'S001','2025-10-12','In Treatment','Medium','C204','Chest Pain','2025-10-30','2025-11-04','EKG monitoring'),
('P003','Amit','Sharma','Amit Sharma',58,'Male','1967-11-20','9811000005','amit.sharma@example.com','House 9, Model Town, Delhi','HDFC ERGO','Suman Sharma - 9811000006',1,'S002','2025-10-25','In Treatment','High','C102','Post MI','2025-10-31','2025-11-12','On beta blockers'),
('P004','Pooja','Verma','Pooja Verma',27,'Female','1998-04-03','9811000007','pooja.verma@example.com','Sector 12, Noida','Star Health','Ravi Verma - 9811000008',4,'S006','2025-11-01','In Treatment','Low','P303','Fever & Cold','2025-11-01','2025-11-15','Pediatric consult (adult family member)'),
('P005','Rakesh','Gupta','Rakesh Gupta',39,'Male','1986-09-28','9811000009','rakesh.gupta@example.com','MG Road, Bengaluru','Apollo Munich','Renu Gupta - 9811000010',5,'S022','2025-08-20','Discharged','Low','G210','Gastritis','2025-10-05','2026-01-10','Diet advised'),
('P006','Neha','Patel','Neha Patel',22,'Female','2003-01-17','9811000011','neha.patel@example.com','Juhu, Mumbai','Star Health','Krishna Patel - 9811000012',4,'S006','2025-09-20','Discharged','Low','P118','Bronchitis','2025-09-22','2025-10-20','Inhaler given'),
('P007','Vijay','Rao','Vijay Rao',66,'Male','1959-03-02','9811000013','vijay.rao@example.com','Baner, Pune','HDFC ERGO','Lakshmi Rao - 9811000014',1,'S001','2025-10-02','In Treatment','High','C110','Heart Failure','2025-10-28','2025-11-15','Monitor fluid status'),
('P008','Kavya','Nair','Kavya Nair',5,'Female','2020-08-10','9811000015','kavya.nair@example.com','Anna Nagar, Chennai','Star Health','Sophie Nair - 9811000016',4,'S006','2025-11-03','In Treatment','Low','P201','Acute Otitis Media','2025-11-03','2025-11-10','Pain management'),
('P009','Manoj','Saxena','Manoj Saxena',50,'Male','1975-12-05','9811000017','manoj.saxena@example.com','Civil Lines, Jaipur','National Insurance','Sunita Saxena - 9811000018',2,'S003','2025-10-18','Discharged','Medium','O310','Knee Pain','2025-10-25','2025-11-20','Physio recommended'),
('P010','Divya','Singh','Divya Singh',29,'Female','1996-07-21','9811000019','divya.singh@example.com','Patna Colony, Patna','Star Health','Pavan Singh - 9811000020',5,'S007','2025-11-01','Scheduled','Low','G302','Diabetes Check','2025-11-01','2025-11-25','HbA1c due'),
('P011','Suresh','Khan','Suresh Khan',72,'Male','1953-10-12','9811000021','suresh.khan@example.com','MG Road, Lucknow','Bajaj Allianz','Rehana Khan - 9811000022',6,'S008','2025-11-02','In Treatment','High','E001','Multiple Trauma','2025-11-02','2025-11-10','ICU observation'),
('P012','Radha','Desai','Radha Desai',38,'Female','1987-05-04','9811000023','radha.desai@example.com','Vile Parle, Mumbai','Star Health','Manish Desai - 9811000024',8,'S010','2025-10-29','Discharged','Low','ENT12','Chronic Ear Infection','2025-10-29','2025-11-20','Ear drops ongoing'),
('P013','Aakash','Bhatia','Aakash Bhatia',31,'Male','1994-03-14','9811000025','aakash.bhatia@example.com','Kothrud, Pune','HDFC ERGO','Rita Bhatia - 9811000026',5,'S029','2025-09-30','Discharged','Medium','G110','Acute Abdomen','2025-10-08','2025-11-05','Surgery done'),
('P014','Maya','Rao','Maya Rao',44,'Female','1981-11-02','9811000027','maya.rao@example.com','Bangalore East, Bengaluru','ICICI Lombard','Sunil Rao - 9811000028',7,'S009','2025-07-15','In Treatment','High','O201','Chemotherapy','2025-10-15','2025-11-20','Cycle 3'),
('P015','Aditya','Malhotra','Aditya Malhotra',55,'Male','1970-06-30','9811000029','aditya.malhotra@example.com','Sector 21, Chandigarh','Star Health','Neeta Malhotra - 9811000030',3,'S005','2025-10-10','Scheduled','Medium','N410','Migraine','2025-10-10','2025-11-11','Neuro follow-up'),
('P016','Shruti','Iyer','Shruti Iyer',19,'Female','2006-02-02','9811000031','shruti.iyer@example.com','Coimbatore','Apollo Munich','Ramesh Iyer - 9811000032',5,'S022','2025-10-01','Discharged','Low','G220','Viral Fever','2025-10-03','2025-12-01','Rest advised'),
('P017','Rohit','Kohli','Rohit Kohli',34,'Male','1991-09-11','9811000033','rohit.kohli@example.com','Ashok Vihar, Delhi','Star Health','Meera Kohli - 9811000034',1,'S001','2025-10-21','In Treatment','Medium','C305','Arrhythmia','2025-10-28','2025-11-30','Holter scheduled'),
('P018','Komal','Shah','Komal Shah',47,'Female','1978-08-19','9811000035','komal.shah@example.com','Vadodara','HDFC ERGO','Pranav Shah - 9811000036',2,'S003','2025-09-25','Discharged','Low','O112','Fracture Follow-up','2025-10-12','2025-11-02','Cast removal'),
('P019','Yusuf','Ansari','Yusuf Ansari',60,'Male','1965-01-01','9811000037','yusuf.ansari@example.com','Old Hyderabad','National Insurance','Zeenat Ansari - 9811000038',6,'S008','2025-11-03','In Treatment','High','E102','Severe Head Injury','2025-11-03','2025-11-20','Neuro consult'),
('P020','Bhavna','Bhosle','Bhavna Bhosle',28,'Female','1997-12-07','9811000039','bhavna.bhosle@example.com','Kolhapur','Star Health','Mehul Bhosle - 9811000040',4,'S006','2025-10-24','Discharged','Low','P112','Allergic Rhinitis','2025-10-28','2025-12-15','Antihistamines'),
('P021','Kunal','Patel','Kunal Patel',41,'Male','1984-04-19','9811000041','kunal.patel@example.com','Surat','ICICI Lombard','Lalita Patel - 9811000042',5,'S007','2025-09-15','Discharged','Low','G401','Hypertension','2025-10-01','2025-11-06','Medication adjusted'),
('P022','Leela','Khan','Leela Khan',63,'Female','1962-06-06','9811000043','leela.khan@example.com','Patiala','Bajaj Allianz','Aamir Khan - 9811000044',3,'S005','2025-10-18','In Treatment','Medium','N201','Dementia Assessment','2025-10-20','2025-11-19','Cognitive tests'),
('P023','Sahil','Verma','Sahil Verma',37,'Male','1988-03-08','9811000045','sahil.verma@example.com','Dwarka, Delhi','HDFC ERGO','Rita Verma - 9811000046',2,'S004','2025-11-01','In Treatment','Medium','O220','Shoulder Pain','2025-11-01','2025-11-29','Injections given'),
('P024','Nandini','Rao','Nandini Rao',52,'Female','1973-05-30','9811000047','nandini.rao@example.com','Gandhinagar','ICICI Lombard','Karan Rao - 9811000048',7,'S009','2025-08-05','Discharged','High','ONC05','Breast Cancer Follow-up','2025-10-30','2026-01-05','Radiology scheduled'),
('P025','Tejas','Kulkarni','Tejas Kulkarni',30,'Male','1995-11-23','9811000049','tejas.kulkarni@example.com','Pune Camp, Pune','Star Health','Maya Kulkarni - 9811000050',2,'S003','2025-10-06','Discharged','Low','O330','ACL Sprain','2025-10-12','2025-11-25','Physio plan'),
('P026','Ila','Mishra','Ila Mishra',48,'Female','1977-02-14','9811000051','ila.mishra@example.com','Bhopal','National Insurance','Rakesh Mishra - 9811000052',5,'S022','2025-09-25','Discharged','Medium','G330','Gallstones','2025-10-01','2025-11-14','Post-op diet'),
('P027','Pranav','Bhatt','Pranav Bhatt',26,'Male','1999-07-04','9811000053','pranav.bhatt@example.com','Thane','Apollo Munich','Nita Bhatt - 9811000054',6,'S008','2025-11-02','In Treatment','Medium','E210','Road Traffic Injury','2025-11-02','2025-11-18','Orthopedic review'),
('P028','Mrunal','Deshpande','Mrunal Deshpande',33,'Female','1992-01-09','9811000055','mrunal.deshpande@example.com','Wakad, Pune','Star Health','Siddharth Deshpande - 9811000056',8,'S010','2025-10-19','Discharged','Low','ENT22','Tonsillitis','2025-10-20','2025-11-25','Complete course'),
('P029','Anuj','Saxena','Anuj Saxena',46,'Male','1979-06-25','9811000057','anuj.saxena@example.com','Sector 9, Noida','HDFC ERGO','Geeta Saxena - 9811000058',1,'S002','2025-09-10','Discharged','Medium','C202','Coronary Angiography','2025-09-12','2025-11-02','Stent placed'),
('P030','Gauri','Nath','Gauri Nath',24,'Female','2001-10-16','9811000059','gauri.nath@example.com','Rajarhat, Kolkata','Star Health','Kamal Nath - 9811000060',4,'S006','2025-10-05','Discharged','Low','P110','Bronchiolitis','2025-10-07','2025-11-21','Vaccination up-to-date'),
('P031','Harish','Shah','Harish Shah',68,'Male','1957-12-30','9811000061','harish.shah@example.com','Ahmedabad','Bajaj Allianz','Meera Shah - 9811000062',3,'S005','2025-11-01','In Treatment','High','N330','Parkinsons','2025-10-28','2025-11-22','Medication review'),
('P032','Rina','Bose','Rina Bose',53,'Female','1972-08-24','9811000063','rina.bose@example.com','Kolkata Central','ICICI Lombard','Sukumar Bose - 9811000064',5,'S022','2025-10-27','Discharged','Medium','G220','Ulcerative Colitis','2025-10-29','2025-11-30','GI follow-up'),
('P033','Mayank','Jain','Mayank Jain',36,'Male','1989-05-02','9811000065','mayank.jain@example.com','Indore','Star Health','Anita Jain - 9811000066',2,'S004','2025-10-13','Discharged','Low','O110','Ankle Sprain','2025-10-15','2025-11-20','Rehab'),
('P034','Sana','Khan','Sana Khan',17,'Female','2008-09-09','9811000067','sana.khan@example.com','Aligarh','Star Health','Zubair Khan - 9811000068',4,'S006','2025-11-03','In Treatment','Low','P305','Tonsil Stones','2025-11-03','2025-11-10','ENT review'),
('P035','Vikash','Yadav','Vikash Yadav',49,'Male','1976-04-04','9811000069','vikash.yadav@example.com','Gaya','National Insurance','Meena Yadav - 9811000070',5,'S022','2025-09-02','Discharged','Medium','G500','Liver Function Abnormal','2025-09-10','2025-11-11','Lifestyle advised'),
('P036','Farah','Aziz','Farah Aziz',42,'Female','1983-06-06','9811000071','farah.aziz@example.com','Srinagar','Star Health','Aamir Aziz - 9811000072',7,'S009','2025-10-18','In Treatment','High','ONC12','Leukemia','2025-10-28','2025-11-24','Chemotherapy'),
('P037','Rajat','Bajpai','Rajat Bajpai',61,'Male','1964-11-11','9811000073','rajat.bajpai@example.com','Meerut','HDFC ERGO','Vandana Bajpai - 9811000074',1,'S001','2025-10-06','Discharged','Medium','C410','Hypertensive Crisis','2025-10-08','2025-11-07','BP meds changed'),
('P038','Nisha','Garg','Nisha Garg',35,'Female','1990-12-12','9811000075','nisha.garg@example.com','Jalandhar','Star Health','Himanshu Garg - 9811000076',8,'S010','2025-10-02','Discharged','Low','ENT05','Sinusitis','2025-10-05','2025-11-10','Nasal spray'),
('P039','Lokesh','Jain','Lokesh Jain',27,'Male','1998-05-28','9811000077','lokesh.jain@example.com','Ujjain','ICICI Lombard','Renu Jain - 9811000078',2,'S003','2025-11-02','In Treatment','Low','O404','Fracture Care','2025-11-02','2025-11-20','Cast care'),
('P040','Tanya','Chawla','Tanya Chawla',21,'Female','2004-02-14','9811000079','tanya.chawla@example.com','Shimla','Star Health','Vikram Chawla - 9811000080',4,'S006','2025-10-11','Discharged','Low','P210','Viral Exanthem','2025-10-13','2025-11-30','Skin care'),
('P041','Imran','Siddiqui','Imran Siddiqui',54,'Male','1971-07-07','9811000081','imran.siddiqui@example.com','Patel Nagar, Delhi','Bajaj Allianz','Zainab Siddiqui - 9811000082',6,'S008','2025-10-29','In Treatment','High','E450','Chest Trauma','2025-10-29','2025-11-19','Surgical consult'),
('P042','Sheetal','Verghese','Sheetal Verghese',46,'Female','1979-03-03','9811000083','sheetal.verghese@example.com','Kochi','HDFC ERGO','Thomas Verghese - 9811000084',5,'S022','2025-10-02','Discharged','Medium','G701','Thyroiditis','2025-10-10','2025-11-17','TSH repeat'),
('P043','Aarav','Shukla','Aarav Shukla',8,'Male','2017-04-01','9811000085','aarav.shukla@example.com','Varanasi','Star Health','Neha Shukla - 9811000086',4,'S006','2025-11-03','In Treatment','Low','P501','Infant Fever','2025-11-03','2025-11-10','Pediatric observation'),
('P044','Neeraj','Bhargava','Neeraj Bhargava',59,'Male','1966-02-02','9811000087','neeraj.bhargava@example.com','Ghaziabad','National Insurance','Sunita Bhargava - 9811000088',1,'S024','2025-09-12','Discharged','Medium','C220','Coronary Check','2025-09-15','2025-11-12','Stress test'),
('P045','Riya','Bansal','Riya Bansal',26,'Female','1999-08-20','9811000089','riya.bansal@example.com','Gurgaon','Star Health','Amit Bansal - 9811000090',5,'S007','2025-10-01','Discharged','Low','G210','UTI','2025-10-03','2025-11-01','Complete antibiotics'),
('P046','Suman','Roy','Suman Roy',70,'Female','1955-05-05','9811000091','suman.roy@example.com','Ranchi','ICICI Lombard','Bharat Roy - 9811000092',3,'S005','2025-10-19','In Treatment','High','N601','Stroke Rehab','2025-10-20','2025-11-30','Physio ongoing'),
('P047','Harsha','Menon','Harsha Menon',43,'Male','1982-11-11','9811000093','harsha.menon@example.com','Thiruvananthapuram','Star Health','Leela Menon - 9811000094',8,'S010','2025-10-21','Discharged','Low','ENT09','Vertigo','2025-10-25','2025-11-13','Vestibular exercises'),
('P048','Kavita','Saxena','Kavita Saxena',31,'Female','1994-06-06','9811000095','kavita.saxena@example.com','Jodhpur','Star Health','Nitin Saxena - 9811000096',2,'S003','2025-11-03','Scheduled','Low','O501','ACL Repair','2025-11-03','2025-11-30','Pre-op'),
('P049','Mayuri','Desai','Mayuri Desai',29,'Female','1996-03-03','9811000097','mayuri.desai@example.com','Baroda','Apollo Munich','Prakash Desai - 9811000098',5,'S022','2025-10-14','Discharged','Low','G802','IBS','2025-10-20','2026-01-25','Diet plan'),
('P050','Siddharth','Ghosh','Siddharth Ghosh',38,'Male','1987-12-12','9811000099','siddharth.ghosh@example.com','Salt Lake, Kolkata','Star Health','Rina Ghosh - 9811000100',5,'S022','2025-09-10','Discharged','Medium','G250','Hypertension & Diabetes','2025-10-11','2025-11-05','Dual meds');

-- --------------------------
-- 7) patient_vitals_current (50 rows)
-- --------------------------
INSERT INTO patient_vitals_current (patient_id, blood_pressure, heart_rate, temperature, oxygen_saturation, weight, height)
VALUES
('P001','140/90',78,98.6,96,78.5,172.0),
('P002','130/85',86,99.1,97,60.0,165.0),
('P003','150/95',92,98.9,95,82.0,175.0),
('P004','110/70',78,99.0,98,55.0,162.0),
('P005','118/76',72,98.4,99,68.0,170.0),
('P006','115/74',88,99.2,97,52.0,160.0),
('P007','160/100',88,98.7,94,85.0,178.0),
('P008','105/65',110,99.5,99,18.0,108.0),
('P009','122/80',76,98.6,98,75.0,168.0),
('P010','128/82',80,98.8,98,58.0,162.0),
('P011','135/88',102,99.6,92,80.0,170.0),
('P012','120/78',74,98.5,99,63.0,165.0),
('P013','125/80',82,98.7,98,70.0,172.0),
('P014','118/76',70,99.0,97,55.0,160.0),
('P015','138/86',84,98.8,96,80.0,174.0),
('P016','110/70',76,98.3,99,54.0,161.0),
('P017','142/90',90,99.2,95,77.0,173.0),
('P018','128/82',78,98.6,98,72.0,171.0),
('P019','150/95',110,100.2,89,82.0,176.0),
('P020','112/72',72,98.4,99,47.0,155.0),
('P021','134/84',80,98.9,97,76.0,170.0),
('P022','130/86',78,99.1,96,62.0,162.0),
('P023','126/80',88,98.7,98,74.0,169.0),
('P024','140/90',92,99.3,94,68.0,160.0),
('P025','118/76',78,98.5,99,70.0,171.0),
('P026','122/78',86,98.8,97,75.0,173.0),
('P027','135/90',98,99.4,94,82.0,176.0),
('P028','110/70',72,98.6,99,60.0,165.0),
('P029','148/92',88,99.1,95,88.0,179.0),
('P030','108/68',90,99.0,98,50.0,158.0),
('P031','160/100',84,98.8,95,85.0,172.0),
('P032','130/80',76,98.6,98,66.0,168.0),
('P033','118/74',74,98.4,99,68.0,170.0),
('P034','100/60',98,99.5,99,50.0,155.0),
('P035','136/88',82,98.7,97,72.0,169.0),
('P036','142/90',88,99.6,93,60.0,162.0),
('P037','150/94',86,98.9,95,84.0,175.0),
('P038','118/76',76,98.4,99,62.0,164.0),
('P039','128/80',90,99.1,98,78.0,176.0),
('P040','110/70',86,99.0,99,56.0,160.0),
('P041','145/92',96,99.4,92,86.0,178.0),
('P042','118/76',78,98.9,98,69.0,167.0),
('P043','100/64',108,99.6,99,12.5,95.0),
('P044','130/82',80,98.7,97,82.0,174.0),
('P045','116/72',76,98.4,99,54.0,161.0),
('P046','155/98',90,99.0,94,70.0,165.0),
('P047','120/78',72,98.6,99,66.0,168.0),
('P048','130/84',88,99.2,97,79.0,177.0),
('P049','112/70',76,98.5,99,58.0,162.0),
('P050','140/88',82,98.9,96,80.0,175.0);

-- --------------------------
-- 8) patient_vital_history (one entry per patient)
-- --------------------------
INSERT INTO patient_vital_history (patient_id, date, heart_rate, blood_pressure, temperature, oxygen_saturation)
VALUES
('P001','2025-10-30',80,'138/88',98.6,96),
('P002','2025-10-28',84,'130/84',99.0,97),
('P003','2025-10-26',90,'150/94',99.1,95),
('P004','2025-11-01',76,'110/70',99.0,98),
('P005','2025-10-05',70,'118/76',98.5,99),
('P006','2025-09-21',86,'115/74',99.2,97),
('P007','2025-10-25',87,'158/98',98.7,94),
('P008','2025-11-03',112,'104/64',99.6,99),
('P009','2025-10-24',74,'122/80',98.6,98),
('P010','2025-10-30',79,'128/82',98.8,98),
('P011','2025-11-02',100,'135/88',99.6,92),
('P012','2025-10-28',72,'120/78',98.5,99),
('P013','2025-10-08',80,'125/80',98.7,98),
('P014','2025-10-14',68,'118/76',99.0,97),
('P015','2025-10-09',82,'138/86',98.8,96),
('P016','2025-10-02',74,'110/70',98.3,99),
('P017','2025-10-28',88,'142/90',99.1,95),
('P018','2025-10-12',76,'128/82',98.6,98),
('P019','2025-11-03',108,'150/94',100.3,89),
('P020','2025-10-27',70,'112/72',98.4,99),
('P021','2025-10-01',78,'134/84',98.9,97),
('P022','2025-10-19',76,'130/86',99.0,96),
('P023','2025-10-31',88,'126/80',98.7,98),
('P024','2025-10-30',90,'140/90',99.3,94),
('P025','2025-10-11',76,'118/76',98.5,99),
('P026','2025-10-01',84,'122/78',98.8,97),
('P027','2025-11-02',96,'132/86',99.3,95),
('P028','2025-10-19',70,'110/70',98.6,99),
('P029','2025-09-12',86,'148/92',99.0,95),
('P030','2025-10-07',88,'108/68',99.0,98),
('P031','2025-10-28',82,'160/100',98.8,95),
('P032','2025-10-18',74,'130/80',98.6,98),
('P033','2025-10-13',72,'118/74',98.4,99),
('P034','2025-11-03',100,'100/60',99.5,99),
('P035','2025-09-09',80,'136/88',98.7,97),
('P036','2025-10-27',86,'142/90',99.4,93),
('P037','2025-10-06',84,'150/94',98.9,95),
('P038','2025-10-03',74,'118/76',98.4,99),
('P039','2025-11-02',92,'128/80',99.1,98),
('P040','2025-10-11',84,'110/70',99.0,99),
('P041','2025-10-29',94,'145/92',99.4,92),
('P042','2025-10-09',76,'118/76',98.9,98),
('P043','2025-11-03',110,'100/64',99.6,99),
('P044','2025-09-14',80,'130/82',98.7,97),
('P045','2025-10-03',74,'116/72',98.4,99),
('P046','2025-10-20',88,'155/98',99.0,94),
('P047','2025-10-21',72,'120/78',98.6,99),
('P048','2025-11-03',90,'130/84',99.2,97),
('P049','2025-10-14',76,'112/70',98.5,99),
('P050','2025-09-11',82,'140/88',98.9,96);

-- --------------------------
-- 9) vital_sign_alerts (some patients with alerts)
-- --------------------------
INSERT INTO vital_sign_alerts (id, patient_id, type, message, severity, date, resolved)
VALUES
('A001','P011','Tachycardia','Heart rate >100 bpm on arrival', 'High','2025-11-02', FALSE),
('A002','P019','Hypoxia','Oxygen saturation dropped to 89%', 'High','2025-11-03', FALSE),
('A003','P007','Hypertensive','BP 160/100 observed', 'High','2025-10-25', TRUE),
('A004','P027','Orthopedic','Severe pain after RTA', 'Medium','2025-11-02', FALSE),
('A005','P036','Neutropenia','Low counts during chemo', 'High','2025-10-28', FALSE);

-- --------------------------
-- 10) timeline_events (sample events per some patients)
-- --------------------------
INSERT INTO timeline_events (id, patient_id, date, title, description, type)
VALUES
('T001','P003','2025-10-25','Admitted for MI','Patient admitted with acute MI, stent placed','admission'),
('T002','P014','2025-10-15','Chemotherapy Cycle 2','Cycle 2 completed, tolerated well','medication'),
('T003','P011','2025-11-02','ER Admission','Severe multiple trauma from RTA','admission'),
('T004','P024','2025-08-05','Surgery','Mastectomy performed','surgery'),
('T005','P008','2025-11-03','ENT Visit','Examined for ear infection','visit');

-- --------------------------
-- 11) patient_medications (assign meds to many patients)
-- --------------------------
INSERT INTO patient_medications (patient_id, medication_id)
VALUES
('P001',5),
('P001',10),
('P002',1),
('P003',5),
('P003',4),
('P004',1),
('P006',8),
('P007',5),
('P009',9),
('P010',4),
('P011',7),
('P012',6),
('P013',9),
('P014',7),
('P015',3),
('P016',1),
('P017',5),
('P018',2),
('P019',7),
('P020',2),
('P021',5),
('P022',3),
('P023',9),
('P024',7),
('P025',8),
('P026',1),
('P027',7),
('P028',1),
('P029',1),
('P030',1),
('P031',5),
('P032',4),
('P033',9),
('P034',6),
('P035',5),
('P036',7),
('P037',5),
('P038',6),
('P039',9),
('P040',1),
('P041',7),
('P042',4),
('P043',1),
('P044',1),
('P045',2),
('P046',5),
('P047',6),
('P048',3),
('P049',1),
('P050',4);

-- --------------------------
-- 12) patient_allergies (some patients)
-- --------------------------
INSERT INTO patient_allergies (patient_id, allergy_id)
VALUES
('P002',1),
('P005',2),
('P012',6),
('P020',3),
('P024',6),
('P031',1),
('P033',2),
('P043',6),
('P049',6);

-- --------------------------
-- 13) appointments (about 60 entries)
-- --------------------------
INSERT INTO appointments (id, patient_id, staff_id, date, time, department_id, type, status, duration, notes)
VALUES
('APPT0001','P002','S001','2025-11-04','09:30:00',1,'Consultation','Scheduled',30,'EKG planned'),
('APPT0002','P003','S002','2025-11-12','11:00:00',1,'Follow-up','Scheduled',30,'Stent check'),
('APPT0003','P004','S006','2025-11-15','10:00:00',4,'Consultation','Scheduled',20,'General pediatric visit'),
('APPT0004','P008','S006','2025-11-10','14:00:00',4,'ENT Visit','Scheduled',20,'Ear check'),
('APPT0005','P009','S003','2025-11-20','09:00:00',2,'Physio','Scheduled',45,'Knee rehab'),
('APPT0006','P010','S007','2025-11-25','08:30:00',5,'Lab','Scheduled',15,'HbA1c'),
('APPT0007','P011','S008','2025-11-10','02:00:00',6,'ER Follow-up','Scheduled',60,'ICU review'),
('APPT0008','P014','S009','2025-11-20','09:00:00',7,'Chemo','Scheduled',180,'Cycle 3'),
('APPT0009','P017','S001','2025-11-30','15:00:00',1,'Holter','Scheduled',1440,'24hr Holter'),
('APPT0010','P019','S005','2025-11-20','10:00:00',6,'Neuro','Scheduled',30,'CT scan planned'),
('APPT0011','P023','S004','2025-11-29','13:00:00',2,'Injection','Scheduled',15,'Corticosteroid'),
('APPT0012','P025','S020','2025-11-25','11:00:00',2,'Physio','Scheduled',45,'ACL rehab'),
('APPT0013','P027','S003','2025-11-18','12:00:00',6,'Surgery Follow-up','Scheduled',30,'RTA injuries'),
('APPT0014','P028','S010','2025-11-25','09:30:00',8,'ENT Follow-up','Scheduled',20,'Tonsillitis'),
('APPT0015','P029','S002','2025-11-02','08:00:00',1,'Cardio','Completed',60,'Stent recovery'),
('APPT0016','P030','S006','2025-11-21','10:30:00',4,'Pediatrics','Scheduled',20,'Check-up'),
('APPT0017','P032','S018','2025-11-30','09:30:00',5,'GI','Scheduled',30,'Colonoscopy prep'),
('APPT0018','P033','S004','2025-11-20','14:00:00',2,'Ortho','Scheduled',30,'Ankle rehab'),
('APPT0019','P034','S010','2025-11-10','15:00:00',8,'ENT','Scheduled',20,'Tonsil follow-up'),
('APPT0020','P036','S009','2025-11-24','08:00:00',7,'Oncology','Scheduled',180,'Chemo session'),
('APPT0021','P039','S003','2025-11-20','13:00:00',2,'Orthopedics','Scheduled',30,'Fracture check'),
('APPT0022','P041','S008','2025-11-19','11:00:00',6,'Trauma','Scheduled',60,'Surgical consult'),
('APPT0023','P043','S006','2025-11-10','10:00:00',4,'Pediatric','Scheduled',20,'Infant check'),
('APPT0024','P048','S003','2025-11-03','07:30:00',2,'Surgery','Scheduled',120,'ACL repair'),
('APPT0025','P050','S022','2025-11-05','09:30:00',5,'Follow-up','Scheduled',30,'BP and sugar'),
('APPT0026','P001','S007','2025-11-10','10:00:00',5,'Cardio','Scheduled',30,'BP control'),
('APPT0027','P005','S022','2025-11-10','12:00:00',5,'Gastro','Scheduled',30,'Ulcer follow-up'),
('APPT0028','P012','S010','2025-11-20','09:00:00',8,'ENT','Scheduled',20,'Ear check'),
('APPT0029','P015','S005','2025-11-11','11:00:00',3,'Neuro','Scheduled',40,'Migraine clinic'),
('APPT0030','P016','S022','2025-12-01','10:00:00',5,'Medicine','Scheduled',20,'General follow-up'),
('APPT0031','P018','S003','2025-11-02','10:30:00',2,'Op Follow-up','Completed',30,'Cast removal'),
('APPT0032','P021','S007','2025-11-06','09:30:00',5,'Cardio','Completed',30,'BP meds'),
('APPT0033','P022','S005','2025-11-19','10:00:00',3,'Neuro','Scheduled',30,'Cognitive test'),
('APPT0034','P026','S022','2025-11-14','09:00:00',5,'Surgery','Scheduled',60,'Gallstone follow-up'),
('APPT0035','P035','S022','2025-11-11','14:00:00',5,'Medicine','Scheduled',30,'Liver tests'),
('APPT0036','P037','S001','2025-11-07','08:00:00',1,'Cardio','Completed',30,'BP control'),
('APPT0037','P038','S010','2025-11-10','09:30:00',8,'ENT','Scheduled',20,'Sinusitis'),
('APPT0038','P040','S006','2025-11-30','10:00:00',4,'Pediatrics','Scheduled',20,'Skin check'),
('APPT0039','P042','S022','2025-11-17','09:00:00',5,'Endocrine','Scheduled',30,'Thyroid test'),
('APPT0040','P044','S024','2025-11-12','08:30:00',1,'Cardio','Completed',30,'Stress test'),
('APPT0041','P045','S022','2025-11-01','10:00:00',5,'Urology','Completed',20,'UTI follow-up'),
('APPT0042','P046','S005','2025-11-30','09:00:00',3,'Neuro Rehab','Scheduled',60,'Stroke rehab'),
('APPT0043','P047','S010','2025-11-13','08:30:00',8,'ENT','Completed',20,'Vertigo'),
('APPT0044','P049','S022','2025-10-20','10:00:00',5,'Gastro','Completed',30,'IBS review'),
('APPT0045','P028','S010','2025-11-25','09:30:00',8,'ENT','Completed',20,'Tonsillitis'),
('APPT0046','P024','S009','2026-01-05','10:00:00',7,'Oncology','Scheduled',120,'Imaging'),
('APPT0047','P032','S018','2025-11-30','09:30:00',5,'GI','Scheduled',40,'Colon prep'),
('APPT0048','P013','S029','2025-11-05','15:00:00',5,'Surgical','Completed',60,'Post-op'),
('APPT0049','P034','S010','2025-11-10','15:30:00',8,'ENT','Scheduled',20,'Tonsil follow-up'),
('APPT0050','P031','S005','2025-11-22','09:30:00',3,'Neurology','Scheduled',40,'Parkinsons review'),
('APPT0051','P001','S007','2025-11-10','11:00:00',5,'Cardio','Scheduled',30,'BP check'),
('APPT0052','P002','S001','2025-11-04','10:00:00',1,'Cardio','Scheduled',30,'EKG review'),
('APPT0053','P048','S003','2025-11-03','08:00:00',2,'Surgery','Scheduled',120,'ACL surgery'),
('APPT0054','P027','S020','2025-11-17','16:00:00',2,'Physio','Scheduled',45,'PT session'),
('APPT0055','P039','S003','2025-11-20','13:30:00',2,'Ortho','Scheduled',30,'Fracture follow-up'),
('APPT0056','P050','S022','2025-11-05','10:30:00',5,'Medicine','Scheduled',30,'Diabetes counselling'),
('APPT0057','P021','S007','2025-11-06','10:00:00',5,'Cardio','Completed',30,'BP meds adjusted'),
('APPT0058','P015','S005','2025-11-11','11:30:00',3,'Neurology','Scheduled',30,'Migraine review'),
('APPT0059','P003','S002','2025-11-12','11:30:00',1,'Cardio','Scheduled',30,'Follow-up'),
('APPT0060','P020','S006','2025-12-15','09:00:00',4,'ENT','Scheduled',20,'Seasonal allergy');

-- --------------------------
-- 14) staff_schedule (sample entries)
-- --------------------------
INSERT INTO staff_schedule (staff_id, date, shift)
VALUES
('S001','2025-11-03','Morning'),
('S002','2025-11-03','Evening'),
('S003','2025-11-03','Morning'),
('S004','2025-11-03','Night'),
('S005','2025-11-03','Morning'),
('S006','2025-11-03','Morning'),
('S007','2025-11-03','Evening'),
('S008','2025-11-03','Night'),
('S009','2025-11-03','Morning'),
('S010','2025-11-03','Morning');


-- --------------------------
-- 16) department_financials (for 8 depts)
-- --------------------------
INSERT INTO department_financials (department_id, revenue, percentage)
VALUES
(1, 1250000.00, 18.5),
(2, 980000.00, 14.5),
(3, 760000.00, 11.3),
(4, 540000.00, 8.0),
(5, 2100000.00, 31.0),
(6, 3200000.00, 47.2),
(7, 980000.00, 14.5),
(8, 420000.00, 6.2);

-- --------------------------
-- 17) payment_methods
-- --------------------------
INSERT INTO payment_methods (method, amount, percentage)
VALUES
('Cash', 1200000.00, 18.0),
('Credit Card', 3000000.00, 45.0),
('Insurance', 2500000.00, 37.0);

-- --------------------------
-- 18) quality_patient_satisfaction (per department)
-- --------------------------
INSERT INTO quality_patient_satisfaction (department_id, score, responses)
VALUES
(1, 4.5, 320),
(2, 4.3, 250),
(3, 4.1, 180),
(4, 4.6, 400),
(5, 4.2, 800),
(6, 4.0, 1200),
(7, 4.0, 130),
(8, 4.4, 140);

-- --------------------------
-- 19) quality_wait_times (per dept)
-- --------------------------
INSERT INTO quality_wait_times (department_id, avg_wait, target)
VALUES
(1, 25, 20),
(2, 18, 15),
(3, 30, 25),
(4, 20, 15),
(5, 22, 18),
(6, 10, 10),
(7, 45, 30),
(8, 15, 12);

-- --------------------------
-- 20) quality_readmission_rates (per dept)
-- --------------------------
INSERT INTO quality_readmission_rates (department_id, rate, target)
VALUES
(1, 5.20, 4.00),
(2, 3.10, 3.00),
(3, 4.50, 3.50),
(4, 2.30, 2.00),
(5, 6.10, 4.50),
(6, 8.00, 6.00),
(7, 7.50, 5.00),
(8, 2.00, 2.00);

-- --------------------------
-- 21) overview_statistics (for 2025-11-03)
-- --------------------------
INSERT INTO overview_statistics (date, total_patients, active_patients, new_patients_today, total_appointments, today_appointments, completed_appointments, cancelled_appointments, pending_results, critical_alerts, total_beds, occupied_beds, available_beds, bed_occupancy_rate, total_staff, staff_on_duty, doctors_available, nurses_on_duty, average_wait_time, patient_satisfaction_score, revenue, expenses)
VALUES
('2025-11-03', 10200, 320, 50, 450, 40, 380, 20, 45, 12, 650, 540, 110, 83.08, 300, 120, 60, 45, 22, 4.3, 4500000.00, 2650000.00);

-- --------------------------
-- 22) demographics_age (buckets summing to 50 patients)
-- --------------------------
INSERT INTO demographics_age (age_group, label, count, percentage, color)
VALUES
('0-12','Children',6,12.00,'#FF6384'),
('13-24','Teen/Young Adult',8,16.00,'#36A2EB'),
('25-44','Adult',20,40.00,'#FFCE56'),
('45-64','Middle Age',12,24.00,'#4BC0C0'),
('65+','Senior',4,8.00,'#9966FF');

-- --------------------------
-- 23) demographics_gender (summing to 50)
-- --------------------------
INSERT INTO demographics_gender (gender, count, percentage, color)
VALUES
('Male',28,56.00,'#36A2EB'),
('Female',22,44.00,'#FF6384');

-- --------------------------
-- 24) demographics_insurance (summing to 50)
-- --------------------------
INSERT INTO demographics_insurance (type, count, percentage, color)
VALUES
('Star Health',20,40.00,'#4BC0C0'),
('ICICI Lombard',8,16.00,'#FFCE56'),
('HDFC ERGO',7,14.00,'#9966FF'),
('Apollo Munich',3,6.00,'#36A2EB'),
('Bajaj Allianz',4,8.00,'#FF6384'),
('National Insurance',5,10.00,'#C9CBCF');

-- --------------------------
-- 25) recent_activities (sample)
-- --------------------------
INSERT INTO recent_activities (type, message, timestamp, priority)
VALUES
('Admission','P011 admitted with multiple trauma','2025-11-02 14:22:00','High'),
('Alert','P019 oxygen saturation low','2025-11-03 09:10:00','High'),
('Discharge','P005 discharged after recovery','2025-10-05 11:00:00','Medium'),
('Appointment','P002 scheduled EKG on 2025-11-04','2025-11-03 10:00:00','Low'),
('Medication','P014 chemo cycle completed','2025-10-15 17:00:00','Medium');

 
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

SET FOREIGN_KEY_CHECKS = 1;
