--DML SCRIPT FOR DATABSE--

 INSERT INTO department_staff (department_id, doctors, nurses, support)
VALUES
(1, 18, 36, 12),
(2, 14, 30, 10),
(3, 16, 34, 11),
(4, 12, 28, 8),
(5, 22, 45, 18),
(6, 10, 20, 7),
(7, 6, 12, 4),
(8, 5, 10, 3),
(9, 9, 18, 6),
(10, 20, 40, 15);


INSERT INTO staff
(id, first_name, last_name, full_name, role, department_id, status, shift, experience, patient_count, phone, email, specialty, rating)
VALUES
('STF001','Ritesh','Verma','Dr. Ritesh Verma','Doctor',1,'On Duty','Morning',15,120,'9811111101','ritesh.verma@hospital.in','Cardiologist',9.2),
('STF002','Sneha','Rao','Dr. Sneha Rao','Doctor',2,'On Duty','Evening',12,95,'9822222202','sneha.rao@hospital.in','Neurologist',9.0),
('STF003','Anil','Khanna','Dr. Anil Khanna','Doctor',3,'Off Duty','Morning',18,140,'9833333303','anil.khanna@hospital.in','Orthopedic Surgeon',9.3),
('STF004','Pooja','Sharma','Dr. Pooja Sharma','Doctor',4,'On Call','Night',10,80,'9844444404','pooja.sharma@hospital.in','Pediatrician',9.1),
('STF005','Rohit','Singh','Dr. Rohit Singh','Doctor',5,'On Duty','Night',9,220,'9855555505','rohit.singh@hospital.in','Emergency Physician',8.6),
('STF006','Meera','Kapoor','Dr. Meera Kapoor','Doctor',6,'On Duty','Morning',11,70,'9866666606','meera.kapoor@hospital.in','Gastroenterologist',8.8),
('STF007','Vikram','Deshmukh','Dr. Vikram Deshmukh','Doctor',7,'Off Duty','Evening',8,50,'9877777707','vikram.deshmukh@hospital.in','Dermatologist',8.9),
('STF008','Nisha','Agarwal','Dr. Nisha Agarwal','Doctor',8,'On Duty','Morning',7,45,'9888888808','nisha.agarwal@hospital.in','Ophthalmologist',8.7),
('STF009','Siddharth','Malhotra','Dr. Siddharth Malhotra','Doctor',9,'On Duty','Evening',14,90,'9899999909','siddharth.m@hospital.in','Oncologist',8.4),
('STF010','Kavya','Iyer','Dr. Kavya Iyer','Doctor',10,'On Call','Night',6,60,'9810000010','kavya.iyer@hospital.in','General Physician',9.0),
 
('STF011','Ananya','Verma','Ananya Verma','Nurse',1,'On Duty','Morning',6,40,'9810000111','ananya.verma@hospital.in','Critical Care Nursing',8.5),
('STF012','Sahil','Kumar','Sahil Kumar','Nurse',1,'On Duty','Evening',4,30,'9820000112','sahil.kumar@hospital.in','Cardiac ICU Nursing',8.3),
('STF013','Preeti','Shukla','Preeti Shukla','Nurse',2,'Off Duty','Morning',7,35,'9830000113','preeti.shukla@hospital.in','Neuro ICU Nursing',8.6),
('STF014','Rohini','Patel','Rohini Patel','Nurse',3,'On Duty','Night',5,28,'9840000114','rohini.patel@hospital.in','Orthopedic Nursing',8.2),
('STF015','Gaurav','Mehra','Gaurav Mehra','Nurse',4,'On Duty','Morning',9,50,'9850000115','gaurav.mehra@hospital.in','Pediatrics Nursing',8.7),
('STF016','Simran','Kaur','Simran Kaur','Nurse',5,'On Duty','Night',8,60,'9860000116','simran.kaur@hospital.in','Emergency Nursing',8.1),
('STF017','Deepak','Yadav','Deepak Yadav','Nurse',6,'On Duty','Evening',10,55,'9870000117','deepak.yadav@hospital.in','Gastro Nursing',8.4),
('STF018','Ritika','Das','Ritika Das','Nurse',7,'Off Duty','Morning',3,20,'9880000118','ritika.das@hospital.in','Dermatology Nursing',8.0),
('STF019','Kabir','Khanna','Kabir Khanna','Nurse',8,'On Duty','Morning',6,22,'9890000119','kabir.khanna@hospital.in','Ophthalmic Nursing',8.2),
('STF020','Mitali','Ghosh','Mitali Ghosh','Nurse',9,'On Duty','Evening',5,30,'9810000120','mitali.ghosh@hospital.in','Oncology Nursing',8.3),
 
('STF021','Arjun','Singh','Arjun Singh','Nurse',10,'On Duty','Morning',7,48,'9820000121','arjun.singh@hospital.in','General Nursing',8.6),
('STF022','Neha','Saxena','Neha Saxena','Support',1,'On Duty','Morning',4,12,'9830000122','neha.saxena@hospital.in','Phlebotomist',7.9),
('STF023','Manish','Joshi','Manish Joshi','Support',2,'On Duty','Evening',6,15,'9840000123','manish.joshi@hospital.in','Radiology Tech',8.0),
('STF024','Priya','Jain','Priya Jain','Support',3,'Off Duty','Morning',5,10,'9850000124','priya.jain@hospital.in','Physiotherapist',8.1),
('STF025','Sonia','Bhardwaj','Sonia Bhardwaj','Support',4,'On Duty','Night',8,18,'9860000125','sonia.bhardwaj@hospital.in','Dietician',8.4),
('STF026','Vivek','Sinha','Vivek Sinha','Support',5,'On Duty','Morning',9,25,'9870000126','vivek.sinha@hospital.in','Paramedic',8.2),
('STF027','Tanvi','Reddy','Tanvi Reddy','Support',5,'On Duty','Evening',3,8,'9880000127','tanvi.reddy@hospital.in','ER Technician',7.8),
('STF028','Kunal','Bose','Kunal Bose','Support',6,'On Duty','Morning',7,12,'9890000128','kunal.bose@hospital.in','Lab Technician',8.1),
('STF029','Pallavi','Khatri','Pallavi Khatri','Support',7,'Off Duty','Morning',4,9,'9810000129','pallavi.khatri@hospital.in','Receptionist',7.7),
('STF030','Ankit','Malik','Ankit Malik','Support',8,'On Duty','Evening',6,11,'9820000130','ankit.malik@hospital.in','Optometry Assistant',8.0),
 
('STF031','Charu','Pandey','Charu Pandey','Doctor',1,'On Duty','Evening',13,85,'9830000131','charu.pandey@hospital.in','Interventional Cardiologist',9.1),
('STF032','Rahul','Nanda','Rahul Nanda','Doctor',2,'On Duty','Morning',11,77,'9840000132','rahul.nanda@hospital.in','Neuro Surgeon',9.0),
('STF033','Nisha','Joshi','Nisha Joshi','Doctor',3,'On Call','Night',9,66,'9850000133','nisha.joshi@hospital.in','Joint Replacement Surgeon',8.8),
('STF034','Varun','Kapoor','Varun Kapoor','Doctor',4,'Off Duty','Morning',7,40,'9860000134','varun.kapoor@hospital.in','Pediatric Surgeon',8.6),
('STF035','Ira','Mishra','Ira Mishra','Doctor',5,'On Duty','Morning',10,130,'9870000135','ira.mishra@hospital.in','Trauma Surgeon',8.4),
('STF036','Karan','Bhatia','Karan Bhatia','Nurse',9,'On Duty','Night',12,58,'9880000136','karan.bhatia@hospital.in','Oncology Nursing',8.5),
('STF037','Rhea','Nair','Rhea Nair','Nurse',10,'On Duty','Morning',5,34,'9890000137','rhea.nair@hospital.in','General Nursing',8.2),
('STF038','Amit','Tiwari','Amit Tiwari','Nurse',6,'Off Duty','Evening',6,29,'9810000138','amit.tiwari@hospital.in','Gastro Nursing',8.0),
('STF039','Diya','Chatterjee','Diya Chatterjee','Nurse',4,'On Duty','Morning',4,22,'9820000139','diya.chatterjee@hospital.in','Pediatrics Nursing',8.1),
('STF040','Sanya','Batra','Sanya Batra','Support',10,'On Duty','Evening',5,14,'9830000140','sanya.batra@hospital.in','Medical Records',7.9);
 


INSERT INTO staff 
(id, first_name, last_name, full_name, role, department_id, status, shift, experience, patient_count, phone, email, specialty, rating)
VALUES
('D101', 'Ritesh', 'Verma', 'Dr. Ritesh Verma', 'Doctor', 1, 'On Duty', 'Morning', 15, 12, '9811111111', 'ritesh.verma@hospital.in', 'Cardiologist', 4.8),
('D102', 'Sneha', 'Rao', 'Dr. Sneha Rao', 'Doctor', 2, 'On Duty', 'Evening', 12, 10, '9822222222', 'sneha.rao@hospital.in', 'Neurologist', 4.7),
('D103', 'Anil', 'Khanna', 'Dr. Anil Khanna', 'Doctor', 3, 'On Call', 'Morning', 18, 9, '9833333333', 'anil.khanna@hospital.in', 'Orthopedic Surgeon', 4.6),
('D104', 'Meera', 'Joshi', 'Dr. Meera Joshi', 'Doctor', 4, 'On Duty', 'Night', 10, 8, '9844444444', 'meera.joshi@hospital.in', 'Gastroenterologist', 4.9),
('D105', 'Arvind', 'Patel', 'Dr. Arvind Patel', 'Doctor', 5, 'On Duty', 'Morning', 20, 14, '9855555555', 'arvind.patel@hospital.in', 'General Physician', 4.5),
('D106', 'Priya', 'Nair', 'Dr. Priya Nair', 'Doctor', 6, 'On Leave', 'Evening', 8, 5, '9866666666', 'priya.nair@hospital.in', 'Pediatrician', 4.4),
('D107', 'Sameer', 'Bose', 'Dr. Sameer Bose', 'Doctor', 7, 'On Call', 'Night', 9, 6, '9877777777', 'sameer.bose@hospital.in', 'Dermatologist', 4.6),
('D108', 'Anita', 'Reddy', 'Dr. Anita Reddy', 'Doctor', 8, 'On Duty', 'Morning', 14, 10, '9888888888', 'anita.reddy@hospital.in', 'Ophthalmologist', 4.8),
('D109', 'Tarun', 'Kapoor', 'Dr. Tarun Kapoor', 'Doctor', 9, 'On Duty', 'Morning', 16, 11, '9899999999', 'tarun.kapoor@hospital.in', 'Oncologist', 4.9),
('D110', 'Suman', 'Mishra', 'Dr. Suman Mishra', 'Doctor', 10, 'On Duty', 'Morning', 11, 7, '9900000000', 'suman.mishra@hospital.in', 'Psychiatrist', 4.7);
 

INSERT INTO patients 
(id, first_name, last_name, full_name, age, gender, date_of_birth, phone, email, address, insurance, emergency_contact, department_id, doctor_id, admission_date, status, severity, room, diagnosis, last_visit, next_appointment, notes)
VALUES
('P001', 'Rahul', 'Mehta', 'Rahul Mehta', 45, 'Male', '1980-06-15', '9811122233', 'rahul.mehta@gmail.com', 'C-22, Lajpat Nagar, Delhi', 'Star Health', 'Rohit Mehta - 9811122244', 1, 'D101', '2025-09-05', 'Discharged', 'High', '101A', 'Coronary artery disease', '2025-09-20', '2025-10-05', 'Stable after angioplasty'),
('P002', 'Sneha', 'Sharma', 'Sneha Sharma', 38, 'Female', '1987-03-22', '9823344455', 'sneha.sharma@gmail.com', 'Malad West, Mumbai', 'HDFC Ergo', 'Amit Sharma - 9823344466', 2, 'D102', '2025-09-08', 'In Treatment', 'Medium', '202B', 'Migraine and chronic headache', '2025-09-25', '2025-11-10', 'Responding to medication'),
('P003', 'Aman', 'Raturi', 'Aman Raturi', 27, 'Male', '1998-07-09', '9832233344', 'aman.raturi@gmail.com', 'Rajpur Road, Dehradun', 'ICICI Lombard', 'Neha Raturi - 9832233355', 3, 'D103', '2025-09-10', 'Discharged', 'Medium', '303C', 'Fractured radius bone', '2025-09-15', '2025-11-05', 'Under physiotherapy'),
('P004', 'Pooja', 'Singh', 'Pooja Singh', 32, 'Female', '1993-11-12', '9845566677', 'pooja.singh@gmail.com', 'Hazratganj, Lucknow', 'Bajaj Allianz', 'Ankit Singh - 9845566688', 4, 'D104', '2025-09-11', 'Discharged', 'Low', '404B', 'Gastritis and acid reflux', '2025-09-18', '2025-11-01', 'No major issues'),
('P005', 'Rakesh', 'Verma', 'Rakesh Verma', 60, 'Male', '1965-02-20', '9856677788', 'rakesh.verma@gmail.com', 'Vaishali Nagar, Jaipur', 'New India Assurance', 'Nisha Verma - 9856677799', 1, 'D101', '2025-09-15', 'Critical', 'High', '105A', 'Severe heart blockage', '2025-09-29', '2025-11-10', 'Under observation in ICU'),
('P006', 'Deepak', 'Joshi', 'Deepak Joshi', 41, 'Male', '1984-08-25', '9867788899', 'deepak.joshi@gmail.com', 'Kothrud, Pune', 'Reliance Health', 'Anjali Joshi - 9867788800', 5, 'D105', '2025-09-18', 'Discharged', 'Low', '106B', 'Viral fever', '2025-09-23', '2025-11-12', 'Recovered fully'),
('P007', 'Neha', 'Agarwal', 'Neha Agarwal', 29, 'Female', '1996-05-19', '9878899900', 'neha.agarwal@gmail.com', 'South Ex, Delhi', 'Max Bupa', 'Ravi Agarwal - 9878899911', 6, 'D106', '2025-09-20', 'In Treatment', 'Medium', '207C', 'Dengue fever', '2025-09-28', '2025-11-06', 'Platelets improving'),
('P008', 'Arjun', 'Kapoor', 'Arjun Kapoor', 35, 'Male', '1990-04-14', '9889900112', 'arjun.kapoor@gmail.com', 'Bandra, Mumbai', 'HDFC Ergo', 'Karan Kapoor - 9889900223', 7, 'D107', '2025-09-21', 'Discharged', 'Low', '208A', 'Skin allergy', '2025-09-25', '2025-10-20', 'Allergic reaction under control'),
('P009', 'Kiran', 'Deshmukh', 'Kiran Deshmukh', 54, 'Female', '1971-12-03', '9890011223', 'kiran.deshmukh@gmail.com', 'Aundh, Pune', 'Star Health', 'Prashant Deshmukh - 9890011234', 8, 'D108', '2025-09-22', 'In Treatment', 'Medium', '209B', 'Cataract surgery recovery', '2025-09-29', '2025-11-09', 'Follow-up required'),
('P010', 'Mohit', 'Sinha', 'Mohit Sinha', 40, 'Male', '1985-01-09', '9901122334', 'mohit.sinha@gmail.com', 'Salt Lake, Kolkata', 'ICICI Lombard', 'Rina Sinha - 9901122445', 9, 'D109', '2025-09-25', 'In Treatment', 'High', '210A', 'Lung cancer (Stage II)', '2025-09-30', '2025-11-15', 'Chemotherapy ongoing'),
('P011', 'Anjali', 'Rao', 'Anjali Rao', 33, 'Female', '1992-09-13', '9811122211', 'anjali.rao@gmail.com', 'Mysore Road, Bangalore', 'Care Health', 'Vivek Rao - 9811133344', 10, 'D110', '2025-09-26', 'Scheduled', 'Low', '211A', 'Pregnancy (7 months)', '2025-09-15', '2025-11-05', 'Scheduled delivery checkup'),
('P012', 'Nikhil', 'Tiwari', 'Nikhil Tiwari', 50, 'Male', '1975-08-08', '9822334455', 'nikhil.tiwari@gmail.com', 'Indiranagar, Bangalore', 'Star Health', 'Pooja Tiwari - 9822334466', 1, 'D101', '2025-09-27', 'Discharged', 'Medium', '212B', 'Angina', '2025-09-28', '2025-11-10', 'Responded to medication'),
('P013', 'Tanya', 'Kapoor', 'Tanya Kapoor', 25, 'Female', '2000-10-18', '9833445566', 'tanya.kapoor@gmail.com', 'Andheri East, Mumbai', 'Max Bupa', 'Rohit Kapoor - 9833445577', 2, 'D102', '2025-09-29', 'In Treatment', 'Low', '213A', 'Insomnia', '2025-10-01', '2025-11-20', 'Sleep cycle improving'),
('P014', 'Ajay', 'Bansal', 'Ajay Bansal', 48, 'Male', '1977-05-14', '9844556677', 'ajay.bansal@gmail.com', 'Civil Lines, Kanpur', 'HDFC Ergo', 'Neelam Bansal - 9844556688', 3, 'D103', '2025-09-30', 'In Treatment', 'Medium', '214B', 'Spinal disc injury', '2025-10-05', '2025-11-25', 'Physical therapy ongoing'),
('P015', 'Divya', 'Pillai', 'Divya Pillai', 36, 'Female', '1989-02-11', '9855667788', 'divya.pillai@gmail.com', 'Ernakulam, Kochi', 'Reliance Health', 'Manoj Pillai - 9855667799', 4, 'D104', '2025-09-30', 'Discharged', 'Low', '215A', 'Irritable bowel syndrome', '2025-10-05', '2025-11-25', 'Diet control helping');
 
 

INSERT INTO patients 
(id, first_name, last_name, full_name, age, gender, date_of_birth, phone, email, address, insurance, emergency_contact, department_id, doctor_id, admission_date, status, severity, room, diagnosis, last_visit, next_appointment, notes)
VALUES
('P016', 'Karthik', 'Reddy', 'Karthik Reddy', 30, 'Male', '1995-03-19', '9876543210', 'karthik.reddy@gmail.com', 'Banjara Hills, Hyderabad', 'HDFC Ergo', 'Suman Reddy - 9876543220', 5, 'D105', '2025-09-28', 'Discharged', 'Low', '216A', 'Viral fever and dehydration', '2025-09-30', '2025-11-05', 'Recovered well'),
('P017', 'Ritu', 'Chauhan', 'Ritu Chauhan', 28, 'Female', '1997-09-08', '9821456789', 'ritu.chauhan@gmail.com', 'Sector 21, Gurugram', 'Star Health', 'Amit Chauhan - 9821456799', 6, 'D106', '2025-09-29', 'In Treatment', 'Medium', '217B', 'Typhoid fever', '2025-09-30', '2025-11-12', 'Fever under control'),
('P018', 'Harsh', 'Gupta', 'Harsh Gupta', 42, 'Male', '1983-12-22', '9819988776', 'harsh.gupta@gmail.com', 'Powai, Mumbai', 'ICICI Lombard', 'Priya Gupta - 9819988788', 7, 'D107', '2025-09-27', 'In Treatment', 'High', '218A', 'Severe skin infection', '2025-09-29', '2025-11-08', 'Responding to antibiotics'),
('P019', 'Meera', 'Iyer', 'Meera Iyer', 39, 'Female', '1986-07-03', '9823344112', 'meera.iyer@gmail.com', 'T Nagar, Chennai', 'Care Health', 'Ravi Iyer - 9823344223', 8, 'D108', '2025-09-30', 'Discharged', 'Low', '219B', 'Cataract surgery', '2025-10-02', '2025-11-10', 'Recovered fully'),
('P020', 'Aditya', 'Singh', 'Aditya Singh', 50, 'Male', '1975-01-14', '9834455221', 'aditya.singh@gmail.com', 'Gomti Nagar, Lucknow', 'Max Bupa', 'Rashi Singh - 9834455332', 9, 'D109', '2025-09-28', 'In Treatment', 'High', '220A', 'Lung fibrosis', '2025-10-01', '2025-11-22', 'Under oxygen support'),
 
('P021', 'Preeti', 'Nair', 'Preeti Nair', 31, 'Female', '1994-02-09', '9845566678', 'preeti.nair@gmail.com', 'MG Road, Kochi', 'Bajaj Allianz', 'Anil Nair - 9845566690', 10, 'D110', '2025-09-26', 'Scheduled', 'Low', '221B', 'Pregnancy (checkup)', '2025-09-20', '2025-11-05', 'Routine checkup'),
('P022', 'Vikram', 'Desai', 'Vikram Desai', 46, 'Male', '1979-04-25', '9856677781', 'vikram.desai@gmail.com', 'Kothrud, Pune', 'Star Health', 'Shalini Desai - 9856677792', 1, 'D101', '2025-09-29', 'In Treatment', 'Medium', '222A', 'Mild heart attack', '2025-10-02', '2025-11-25', 'On medication'),
('P023', 'Priya', 'Shukla', 'Priya Shukla', 29, 'Female', '1996-06-11', '9867788892', 'priya.shukla@gmail.com', 'Aliganj, Lucknow', 'HDFC Ergo', 'Raj Shukla - 9867788802', 2, 'D102', '2025-09-25', 'In Treatment', 'Low', '223B', 'Anxiety disorder', '2025-09-27', '2025-11-14', 'Responding to therapy'),
('P024', 'Amit', 'Ghosh', 'Amit Ghosh', 34, 'Male', '1991-08-22', '9878899903', 'amit.ghosh@gmail.com', 'Salt Lake, Kolkata', 'Reliance Health', 'Soma Ghosh - 9878899915', 3, 'D103', '2025-09-21', 'Discharged', 'Medium', '224A', 'Dislocated shoulder', '2025-09-29', '2025-11-19', 'Physical therapy advised'),
('P025', 'Deepa', 'Rana', 'Deepa Rana', 44, 'Female', '1981-03-30', '9889900115', 'deepa.rana@gmail.com', 'Patel Nagar, Delhi', 'Max Bupa', 'Aakash Rana - 9889900226', 4, 'D104', '2025-09-23', 'In Treatment', 'Medium', '225B', 'Ulcer and indigestion', '2025-09-27', '2025-11-11', 'Under medication'),
 
('P026', 'Rohit', 'Malhotra', 'Rohit Malhotra', 40, 'Male', '1985-09-25', '9890011228', 'rohit.malhotra@gmail.com', 'Model Town, Delhi', 'ICICI Lombard', 'Divya Malhotra - 9890011239', 5, 'D105', '2025-09-22', 'Discharged', 'Low', '226C', 'Seasonal flu', '2025-09-28', '2025-11-18', 'Fully recovered'),
('P027', 'Isha', 'Patel', 'Isha Patel', 37, 'Female', '1988-02-16', '9901122335', 'isha.patel@gmail.com', 'Vastrapur, Ahmedabad', 'Star Health', 'Dhruv Patel - 9901122446', 6, 'D106', '2025-09-24', 'In Treatment', 'Medium', '227B', 'Dengue', '2025-09-30', '2025-11-09', 'Recovery ongoing'),
('P028', 'Vineet', 'Bhatnagar', 'Vineet Bhatnagar', 53, 'Male', '1972-07-10', '9811122256', 'vineet.bhatnagar@gmail.com', 'Jayanagar, Bangalore', 'Care Health', 'Sneha Bhatnagar - 9811133345', 7, 'D107', '2025-09-25', 'In Treatment', 'Medium', '228A', 'Severe skin rash', '2025-09-27', '2025-11-23', 'Ointment applied daily'),
('P029', 'Kavita', 'Menon', 'Kavita Menon', 48, 'Female', '1977-10-03', '9822334467', 'kavita.menon@gmail.com', 'Thrissur, Kerala', 'Star Health', 'Manu Menon - 9822334478', 8, 'D108', '2025-09-21', 'Discharged', 'Low', '229B', 'Eye irritation', '2025-09-28', '2025-11-18', 'No infection now'),
('P030', 'Naveen', 'Yadav', 'Naveen Yadav', 51, 'Male', '1974-12-01', '9833445579', 'naveen.yadav@gmail.com', 'Sector 62, Noida', 'HDFC Ergo', 'Poonam Yadav - 9833445580', 9, 'D109', '2025-09-19', 'Critical', 'High', '230A', 'Severe asthma', '2025-09-28', '2025-11-25', 'On ventilator support'),
 
('P031', 'Shweta', 'Pandey', 'Shweta Pandey', 33, 'Female', '1992-11-14', '9844556689', 'shweta.pandey@gmail.com', 'LDA Colony, Lucknow', 'Reliance Health', 'Amit Pandey - 9844556699', 10, 'D110', '2025-09-23', 'Scheduled', 'Low', '231B', 'Maternity routine', '2025-09-20', '2025-11-04', 'Next scan scheduled'),
('P032', 'Sahil', 'Jain', 'Sahil Jain', 28, 'Male', '1997-05-08', '9855667790', 'sahil.jain@gmail.com', 'Shalimar Bagh, Delhi', 'Care Health', 'Anita Jain - 9855667801', 1, 'D101', '2025-09-25', 'In Treatment', 'Medium', '232A', 'Minor cardiac irregularities', '2025-09-29', '2025-11-15', 'On ECG monitoring'),
('P033', 'Manisha', 'Gupta', 'Manisha Gupta', 46, 'Female', '1979-09-11', '9866778802', 'manisha.gupta@gmail.com', 'Ashok Nagar, Chennai', 'Bajaj Allianz', 'Karan Gupta - 9866778813', 2, 'D102', '2025-09-22', 'Discharged', 'Low', '233B', 'Sleep disorder', '2025-09-28', '2025-11-20', 'Improved sleep quality'),
('P034', 'Rajeev', 'Kohli', 'Rajeev Kohli', 39, 'Male', '1986-04-06', '9877889914', 'rajeev.kohli@gmail.com', 'Baner, Pune', 'ICICI Lombard', 'Ritu Kohli - 9877889925', 3, 'D103', '2025-09-26', 'In Treatment', 'Medium', '234C', 'Knee ligament tear', '2025-09-30', '2025-11-22', 'Under physiotherapy'),
('P035', 'Simran', 'Gill', 'Simran Gill', 24, 'Female', '2001-03-10', '9888990036', 'simran.gill@gmail.com', 'Model Town, Ludhiana', 'Max Bupa', 'Harpreet Gill - 9888990047', 4, 'D104', '2025-09-27', 'Discharged', 'Low', '235A', 'Food poisoning', '2025-09-30', '2025-11-19', 'Recovered'),
 
('P036', 'Varun', 'Mishra', 'Varun Mishra', 52, 'Male', '1973-08-18', '9899001148', 'varun.mishra@gmail.com', 'Sector 9, Chandigarh', 'Star Health', 'Sunita Mishra - 9899001159', 5, 'D105', '2025-09-25', 'Discharged', 'Medium', '236B', 'Chronic cough', '2025-09-29', '2025-11-26', 'Stable now'),
('P037', 'Radhika', 'Patil', 'Radhika Patil', 29, 'Female', '1996-07-22', '9900112260', 'radhika.patil@gmail.com', 'Shivaji Nagar, Pune', 'Care Health', 'Ramesh Patil - 9900112271', 6, 'D106', '2025-09-30', 'In Treatment', 'Low', '237A', 'Viral infection', '2025-09-30', '2025-11-21', 'Stable'),
('P038', 'Arvind', 'Joshi', 'Arvind Joshi', 58, 'Male', '1967-09-28', '9811223345', 'arvind.joshi@gmail.com', 'Paldi, Ahmedabad', 'HDFC Ergo', 'Meena Joshi - 9811334456', 7, 'D107', '2025-09-28', 'Discharged', 'Low', '238B', 'Skin eczema', '2025-09-29', '2025-11-27', 'Condition stable'),
('P039', 'Sangeeta', 'Rao', 'Sangeeta Rao', 47, 'Female', '1978-02-05', '9822334468', 'sangeeta.rao@gmail.com', 'Basavanagudi, Bangalore', 'ICICI Lombard', 'Naveen Rao - 9822334479', 8, 'D108', '2025-09-27', 'In Treatment', 'Medium', '239C', 'Eye infection', '2025-09-30', '2025-11-18', 'Drops prescribed'),
('P040', 'Nitin', 'Arora', 'Nitin Arora', 56, 'Male', '1969-01-02', '9833445581', 'nitin.arora@gmail.com', 'Sector 50, Noida', 'Star Health', 'Surbhi Arora - 9833445592', 9, 'D109', '2025-09-29', 'Critical', 'High', '240A', 'Severe COPD', '2025-09-30', '2025-11-28', 'ICU support'),
 

('P041', 'Alka', 'Saxena', 'Alka Saxena', 34, 'Female', '1991-10-15', '9844556691', 'alka.saxena@gmail.com', 'Mahanagar, Lucknow', 'Max Bupa', 'Ravi Saxena - 9844556602', 10, 'D110', '2025-09-24', 'Scheduled', 'Low', '241B', 'Prenatal checkup', '2025-09-23', '2025-11-10', 'Next test due'),
('P042', 'Raj', 'Singhal', 'Raj Singhal', 43, 'Male', '1982-09-05', '9855667703', 'raj.singhal@gmail.com', 'Rohini, Delhi', 'HDFC Ergo', 'Meenakshi Singhal - 9855667714', 1, 'D101', '2025-09-28', 'In Treatment', 'Medium', '242A', 'Irregular heartbeat', '2025-09-30', '2025-11-19', 'Monitoring ECG'),
('P043', 'Tina', 'Puri', 'Tina Puri', 27, 'Female', '1998-11-07', '9866778825', 'tina.puri@gmail.com', 'Bandra East, Mumbai', 'Care Health', 'Arjun Puri - 9866778836', 2, 'D102', '2025-09-29', 'In Treatment', 'Low', '243B', 'Anxiety and stress', '2025-09-30', '2025-11-18', 'Stable'),
('P044', 'Ashok', 'Menon', 'Ashok Menon', 59, 'Male', '1966-03-17', '9877889947', 'ashok.menon@gmail.com', 'Kottayam, Kerala', 'Star Health', 'Sangeeta Menon - 9877889958', 3, 'D103', '2025-09-30', 'Discharged', 'Low', '244C', 'Hip joint pain', '2025-09-30', '2025-11-25', 'Under mild exercise'),
('P045', 'Riya', 'Bajaj', 'Riya Bajaj', 26, 'Female', '1999-08-19', '9888990069', 'riya.bajaj@gmail.com', 'Saket, Delhi', 'Max Bupa', 'Vikas Bajaj - 9888990070', 4, 'D104', '2025-09-27', 'Discharged', 'Low', '245A', 'Stomach infection', '2025-09-29', '2025-11-21', 'Recovered fully'),
 
('P046', 'Prakash', 'Nanda', 'Prakash Nanda', 61, 'Male', '1964-05-11', '9899001182', 'prakash.nanda@gmail.com', 'Bhubaneswar, Odisha', 'Bajaj Allianz', 'Sujata Nanda - 9899001193', 5, 'D105', '2025-09-26', 'In Treatment', 'Medium', '246B', 'Viral pneumonia', '2025-09-30', '2025-11-26', 'Improving gradually'),
('P047', 'Meenakshi', 'Das', 'Meenakshi Das', 41, 'Female', '1984-02-03', '9900112284', 'meenakshi.das@gmail.com', 'Dispur, Guwahati', 'ICICI Lombard', 'Amit Das - 9900112295', 6, 'D106', '2025-09-30', 'In Treatment', 'Medium', '247A', 'Malaria', '2025-09-30', '2025-11-20', 'Stable now'),
('P048', 'Sameer', 'Bose', 'Sameer Bose', 36, 'Male', '1989-07-30', '9811223366', 'sameer.bose@gmail.com', 'Howrah, Kolkata', 'Star Health', 'Naina Bose - 9811223377', 7, 'D107', '2025-09-29', 'Discharged', 'Low', '248B', 'Eczema flare-up', '2025-09-30', '2025-11-28', 'Improved'),
('P049', 'Anita', 'Reddy', 'Anita Reddy', 53, 'Female', '1972-12-21', '9822334498', 'anita.reddy@gmail.com', 'Jubilee Hills, Hyderabad', 'Care Health', 'Kiran Reddy - 9822334409', 8, 'D108', '2025-09-25', 'Discharged', 'Low', '249C', 'Corneal infection', '2025-09-28', '2025-11-27', 'Cured'),
('P050', 'Tarun', 'Kapoor', 'Tarun Kapoor', 48, 'Male', '1977-02-12', '9833445510', 'tarun.kapoor@gmail.com', 'Civil Lines, Delhi', 'Max Bupa', 'Sheetal Kapoor - 9833445521', 9, 'D109', '2025-09-28', 'Critical', 'High', '250A', 'Lung cancer stage 3', '2025-09-29', '2025-11-30', 'Chemotherapy ongoing');
 


INSERT INTO patient_vitals_current 
(patient_id, blood_pressure, heart_rate, temperature, oxygen_saturation, weight, height)
VALUES
('P001', '120/80', 78, 98.6, 98, 72.5, 170),
('P002', '130/85', 82, 99.1, 97, 65.2, 160),
('P003', '110/70', 76, 98.2, 99, 80.3, 175),
('P004', '125/90', 90, 100.4, 95, 60.4, 162),
('P005', '140/95', 105, 101.2, 93, 82.1, 173),
('P006', '118/78', 74, 98.5, 98, 68.7, 168),
('P007', '122/82', 80, 98.7, 97, 70.1, 165),
('P008', '115/75', 72, 98.0, 99, 62.9, 159),
('P009', '128/88', 85, 99.3, 96, 77.2, 172),
('P010', '135/90', 92, 100.1, 94, 85.5, 180);
 


INSERT INTO patient_vital_history
(patient_id, date, heart_rate, blood_pressure, temperature, oxygen_saturation)
VALUES
('P001', '2025-10-28', 78, '120/80', 98.6, 98),
('P001', '2025-10-29', 80, '122/82', 99.0, 97),
('P001', '2025-10-30', 76, '118/78', 98.5, 99),
('P002', '2025-10-28', 84, '130/85', 98.9, 96),
('P002', '2025-10-29', 85, '132/86', 99.1, 97),
('P002', '2025-10-30', 83, '128/84', 98.8, 98);
 

INSERT INTO appointments 
(id, patient_id, staff_id, date, time, department_id, type, status, duration, notes)
VALUES
('A1001', 'P001', 'D101', '2025-11-01', '10:00:00', 1, 'Consultation', 'Completed', 30, 'Routine checkup done'),
('A1002', 'P002', 'D102', '2025-11-01', '11:00:00', 2, 'Follow-up', 'Scheduled', 20, 'MRI follow-up visit'),
('A1003', 'P003', 'D103', '2025-11-02', '09:30:00', 3, 'Surgery Review', 'Completed', 45, 'Orthopedic post-surgery review'),
('A1004', 'P004', 'D104', '2025-11-02', '12:00:00', 4, 'Consultation', 'Completed', 25, 'Digestive issue'),
('A1005', 'P005', 'D105', '2025-11-03', '13:00:00', 5, 'Routine Check', 'Pending', 30, 'General examination');
 

INSERT INTO medications (id, name) VALUES
(1, 'Paracetamol 500mg'),
(2, 'Amoxicillin 250mg'),
(3, 'Azithromycin 500mg'),
(4, 'Cetirizine 10mg'),
(5, 'Pantoprazole 40mg'),
(6, 'Metformin 500mg'),
(7, 'Losartan 50mg'),
(8, 'Atorvastatin 10mg'),
(9, 'Ibuprofen 400mg'),
(10, 'Omeprazole 20mg');
 


INSERT INTO patient_medications (patient_id, medication_id) VALUES
('P001', 1), 
('P001', 5),
('P002', 2),
('P003', 3), 
('P003', 9),
('P004', 1),
('P005', 7), 
('P005', 10),
('P006', 4),
('P007', 1), 
('P007', 6),
('P008', 8),
('P009', 2), 
('P009', 5),
('P010', 1), 
('P010', 9),
('P011', 3),
('P012', 1), 
('P012', 7),
('P013', 4), 
('P013', 5),
('P014', 9),
('P015', 1), 
('P015', 8),
('P016', 2), 
('P016', 10),
('P017', 6),
('P018', 1), 
('P018', 4),
('P019', 3),
('P020', 8), 
('P020', 10),
('P021', 2), 
('P021', 9),
('P022', 1),
('P023', 3), 
('P023', 5),
('P024', 7),
('P025', 4), 
('P025', 10),
('P026', 2), 
('P026', 6),
('P027', 1), 
('P027', 9),
('P028', 3),
('P029', 5), 
('P029', 8),
('P030', 1),
('P031', 2), 
('P031', 4),
('P032', 9), 
('P032', 10),
('P033', 6),
('P034', 3), 
('P034', 5),
('P035', 8),
('P036', 1), 
('P036', 2),
('P037', 4),
('P038', 6), 
('P038', 7),
('P039', 9),
('P040', 10),
('P041', 1), 
('P041', 8),
('P042', 3),
('P043', 2), 
('P043', 5),
('P044', 4),
('P045', 6),
('P046', 7), 
('P046', 9),
('P047', 10),
('P048', 1),
('P049', 5),
('P050', 8);
 


INSERT INTO allergies (id, name) VALUES
(1, 'Penicillin'),
(2, 'Peanuts'),
(3, 'Dust'),
(4, 'Pollen'),
(5, 'Seafood'),
(6, 'Lactose'),
(7, 'Latex'),
(8, 'Aspirin'),
(9, 'InsectBites'),
(10, 'Cold Weather');
 


INSERT INTO patient_allergies (patient_id, allergy_id) VALUES
('P001', 2),
('P002', 4),
('P003', 1), 
('P003', 5),
('P004', 3),
('P005', 6),
('P006', 1), 
('P006', 8),
('P007', 9),
('P008', 4),
('P009', 2),
('P010', 7),
('P011', 3),
('P012', 5),
('P013', 1),
('P014', 8),
('P015', 10),
('P016', 2), 
('P016', 6),
('P017', 4),
('P018', 3), 
('P018', 9),
('P019', 7),
('P020', 1),
('P021', 8),
('P022', 6),
('P023', 3),
('P024', 5),
('P025', 9),
('P026', 2),
('P027', 10),
('P028', 4), 
('P028', 7),
('P029', 1),
('P030', 8),
('P031', 5),
('P032', 6), 
('P032', 9),
('P033', 2),
('P034', 3),
('P035', 4),
('P036', 10),
('P037', 1), 
('P037', 8),
('P038', 7),
('P039', 2),
('P040', 5),
('P041', 3),
('P042', 9),
('P043', 6),
('P044', 8),
('P045', 10),
('P046', 1),
('P047', 4),
('P048', 5),
('P049', 2),
('P050', 9);
 

INSERT INTO timeline_events (id, patient_id, date, title, description, type) VALUES
('TE001', 'P001', '2025-10-20', 'Patient Admitted', 'Admitted for chest pain and continuous cough.', 'admission'),
('TE002', 'P001', '2025-10-23', 'Discharged from Cardiology', 'Recovered after observation and medication.', 'discharge'),
('TE003', 'P002', '2025-10-25', 'General Checkup', 'Routine blood pressure and sugar level check.', 'visit'),
('TE004', 'P003', '2025-10-15', 'Appendix Surgery', 'Appendectomy performed successfully by Dr. Mehta.', 'surgery'),
('TE005', 'P003', '2025-10-25', 'Follow-up Visit', 'Post-surgery wound healing observed to be good.', 'visit'),
('TE006', 'P004', '2025-10-22', 'Lab Test', 'Blood test for cholesterol and liver enzymes.', 'test'),
('TE007', 'P005', '2025-09-30', 'Admitted to Ortho', 'Admitted for severe knee pain.', 'admission'),
('TE008', 'P005', '2025-10-02', 'MRI and Discharge', 'MRI performed, advised physiotherapy sessions.', 'discharge'),
('TE009', 'P006', '2025-10-28', 'Neurology Visit', 'Follow-up for migraine treatment.', 'visit'),
('TE010', 'P007', '2025-10-29', 'Diagnostic Tests', 'ECG and blood sugar test conducted.', 'test'),
('TE011', 'P008', '2025-10-05', 'Fever Admission', 'Admitted due to high fever and fatigue.', 'admission'),
('TE012', 'P008', '2025-10-07', 'Discharged', 'Diagnosed with viral fever, recovered fully.', 'discharge'),
('TE013', 'P009', '2025-09-15', 'ENT Surgery', 'Minor sinus cleaning surgery performed.', 'surgery'),
('TE014', 'P010', '2025-10-10', 'Heart Checkup', 'Routine cardiology appointment for BP monitoring.', 'visit'),
('TE015', 'P011', '2025-10-11', 'Asthma Admission', 'Admitted due to shortness of breath.', 'admission'),
('TE016', 'P011', '2025-10-13', 'Discharge', 'Condition improved, discharged with inhaler prescription.', 'discharge'),
('TE017', 'P012', '2025-10-24', 'Liver Test', 'LFT and CBC done to monitor liver health.', 'test'),
('TE018', 'P013', '2025-10-18', 'Post-Surgery Check', 'Regular wound healing assessment.', 'visit'),
('TE019', 'P014', '2025-10-19', 'Eye Check', 'Vision and retina test performed.', 'test'),
('TE020', 'P015', '2025-10-01', 'Ortho Admission', 'Admitted for leg fracture due to accident.', 'admission'),
('TE021', 'P015', '2025-10-02', 'Surgery', 'Fracture fixation surgery completed.', 'surgery'),
('TE022', 'P015', '2025-10-06', 'Discharge', 'Discharged with physiotherapy recommendation.', 'discharge'),
('TE023', 'P016', '2025-10-26', 'Annual Health Check', 'General checkup done, advised to maintain diet.', 'visit'),
('TE024', 'P017', '2025-10-28', 'Thyroid Test', 'Blood test to monitor thyroid level.', 'test'),
('TE025', 'P018', '2025-10-10', 'Emergency Admission', 'Admitted for dehydration and weakness.', 'admission'),
('TE026', 'P018', '2025-10-12', 'Discharge', 'Recovered after IV fluid therapy.', 'discharge'),
('TE027', 'P019', '2025-10-25', 'Follow-up Visit', 'Regular medicine evaluation visit.', 'visit'),
('TE028', 'P020', '2025-10-22', 'Lab Test', 'Urine and cholesterol profile test conducted.', 'test'),
('TE029', 'P021', '2025-09-28', 'Accident Admission', 'Admitted with wrist fracture.', 'admission'),
('TE030', 'P021', '2025-09-29', 'Fracture Surgery', 'Bone plating done by orthopedic surgeon.', 'surgery'),
('TE031', 'P022', '2025-10-26', 'ENT Visit', 'Ear infection treated with antibiotics.', 'visit'),
('TE032', 'P023', '2025-10-24', 'Follow-up Visit', 'Review after antibiotic medication course.', 'visit'),
('TE033', 'P024', '2025-10-23', 'Thyroid Test', 'TSH, T3, T4 levels checked.', 'test'),
('TE034', 'P025', '2025-10-20', 'BP Emergency', 'Admitted for extremely high blood pressure.', 'admission'),
('TE035', 'P025', '2025-10-22', 'Discharged', 'Blood pressure stabilized after 2 days.', 'discharge'),
('TE036', 'P026', '2025-10-26', 'Diabetes Check', 'Sugar level monitoring and consultation.', 'visit'),
('TE037', 'P027', '2025-10-25', 'Lab Tests', 'ECG and blood glucose checked.', 'test'),
('TE038', 'P028', '2025-10-15', 'Chest Congestion', 'Admitted for observation and medication.', 'admission'),
('TE039', 'P028', '2025-10-17', 'Discharged', 'Condition improved and stable.', 'discharge'),
('TE040', 'P029', '2025-10-21', 'Skin Consultation', 'Treatment for skin rashes prescribed.', 'visit'),
('TE041', 'P030', '2025-10-18', 'Vitamin Test', 'Vitamin D and calcium levels checked.', 'test'),
('TE042', 'P031', '2025-10-09', 'Kidney Stone Admission', 'Admitted for severe kidney pain.', 'admission'),
('TE043', 'P031', '2025-10-10', 'Surgery', 'Stone removal surgery done.', 'surgery'),
('TE044', 'P031', '2025-10-13', 'Discharge', 'Discharged after successful surgery.', 'discharge'),
('TE045', 'P032', '2025-10-25', 'Post-Op Check', 'Follow-up after surgery, healing fine.', 'visit'),
('TE046', 'P033', '2025-10-24', 'Lipid Test', 'Cholesterol and triglyceride test performed.', 'test'),
('TE047', 'P034', '2025-10-12', 'High Fever Admission', 'Admitted with body ache and high fever.', 'admission'),
('TE048', 'P034', '2025-10-14', 'Discharged', 'Recovered and advised rest.', 'discharge'),
('TE049', 'P035', '2025-10-26', 'Eye Follow-up', 'Follow-up for earlier eye infection.', 'visit'),
('TE050', 'P036', '2025-10-27', 'Routine Test', 'Blood test and ECG conducted.', 'test');
 



INSERT INTO vital_sign_alerts 
(id, patient_id, type, message, severity, date, resolved)
VALUES
('A001', 'P005', 'Blood Pressure', 'BP exceeded safe range (145/90)', 'High', '2025-09-25', FALSE),
('A002', 'P007', 'Temperature', 'High temperature detected: 99.3°F', 'Medium', '2025-09-23', TRUE),
('A003', 'P010', 'Oxygen', 'Oxygen level dropped below 96%', 'High', '2025-09-30', FALSE),
('A004', 'P002', 'Heart Rate', 'Elevated pulse rate recorded: 88 bpm', 'Low', '2025-09-12', TRUE);
 


INSERT INTO medications (name)
VALUES
('Atorvastatin'),
('Metformin'),
('Paracetamol'),
('Omeprazole'),
('Amoxicillin'),
('Losartan'),
('Insulin'),
('Cetrizine'),
('Azithromycin'),
('Aspirin');
 


INSERT INTO financial_monthly (month, revenue, expenses, profit, patients)
VALUES
('August 2025', 9500000.00, 7200000.00, 2300000.00, 1200),
('September 2025', 10400000.00, 7600000.00, 2800000.00, 1380),
('October 2025', 11500000.00,  8000000.00, 3500000.00, 1450);
 


INSERT INTO quality_patient_satisfaction (department_id, score, responses)
VALUES
(1, 8.9, 220),
(2, 8.6, 180),
(3, 9.0, 200),
(4, 9.2, 150),
(5, 8.1, 300),
(6, 8.7, 140),
(7, 9.1, 100),
(8, 8.8, 90),
(9, 8.4, 120),
(10, 9.0, 200);
 



INSERT INTO overview_statistics
(date, total_patients, active_patients, new_patients_today, total_appointments, today_appointments, completed_appointments, cancelled_appointments, pending_results, critical_alerts, total_beds, occupied_beds, available_beds, bed_occupancy_rate, total_staff, staff_on_duty, doctors_available, nurses_on_duty, average_wait_time, patient_satisfaction_score, revenue, expenses)
VALUES
('2025-10-22', 1420, 1180, 20, 540, 48, 465, 15, 30, 5, 500, 430, 70, 86.00, 260, 210, 85, 95, 22, 8.7, 10200000.00, 7800000.00),
('2025-10-23', 1445, 1200, 25, 550, 50, 470, 12, 28, 4, 500, 440, 60, 88.00, 260, 215, 88, 96, 21, 8.8, 10350000.00, 7850000.00),
('2025-10-24', 1468, 1215, 23, 555, 52, 475, 10, 26, 3, 500, 442, 58, 88.40, 260, 216, 90, 95, 20, 8.9, 10420000.00, 7860000.00),
('2025-10-25', 1485, 1230, 20, 560, 53, 480, 8, 25, 2, 500, 445, 55, 89.00, 260, 218, 90, 96, 19, 9.0, 10500000.00, 7880000.00),
('2025-10-26', 1500, 1245, 22, 570, 55, 490, 9, 24, 3, 500, 450, 50, 90.00, 260, 220, 92, 97, 18, 9.0, 10600000.00, 7895000.00),
('2025-10-27', 1515, 1258, 18, 575, 54, 492, 8, 22, 2, 500, 455, 45, 91.00, 260, 221, 94, 97, 18, 9.1, 10700000.00, 7900000.00),
('2025-10-28', 1530, 1270, 17, 578, 55, 495, 6, 20, 2, 500, 458, 42, 91.60, 260, 223, 95, 98, 17, 9.1, 10850000.00, 7910000.00),
('2025-10-29', 1550, 1285, 20, 580, 56, 498, 5, 19, 1, 500, 460, 40, 92.00, 260, 224, 95, 99, 17, 9.2, 10980000.00, 7925000.00),
('2025-10-30', 1565, 1300, 18, 585, 58, 500, 4, 18, 1, 500, 462, 38, 92.40, 260, 225, 96, 100, 16, 9.2, 11100000.00, 7930000.00),
('2025-10-31', 1580, 1310, 15, 590, 60, 505, 3, 16, 1, 500, 465, 35, 93.00, 260, 226, 97, 100, 16, 9.3, 11250000.00, 7950000.00);
 

INSERT INTO demographics_age (age_group, label, count, percentage, color)
VALUES
('0-12', 'Children', 120, 8.0, '#4F46E5'),
('13-19', 'Teenagers', 150, 10.0, '#06B6D4'),
('20-35', 'YoungAdults', 400, 26.0, '#10B981'),
('36-50', 'Adults', 450, 29.0, '#F59E0B'),
('51-65', 'MiddleAged', 280, 18.0, '#EF4444'),
('65+', 'Senior Citizens', 160, 9.0, '#8B5CF6');
 


INSERT INTO demographics_gender (gender, count, percentage, color)
VALUES
('Male', 850, 55.0, '#3B82F6'),
('Female', 690, 44.0, '#EC4899'),
('Other', 10, 1.0, '#FACC15');
 

INSERT INTO demographics_insurance (type, count, percentage, color)
VALUES
('Government', 420, 27.0, '#6366F1'),
('Private', 760, 49.0, '#10B981'),
('Corporate', 250, 16.0, '#F59E0B'),
('Uninsured', 120, 8.0, '#EF4444');
 


INSERT INTO recent_activities (type, message, timestamp, priority)
VALUES
('Admission', 'Patient P011 admitted to Cardiology ward', '2025-10-31 09:45:00', 'High'),
('Surgery', 'Orthopedic surgery successfully completed for P005', '2025-10-31 11:15:00', 'High'),
('Test Result', 'Blood test reports ready for P010', '2025-10-31 12:10:00', 'Medium'),
('Appointment', 'New appointment scheduled with Dr. Sharma (Neurology)', '2025-10-31 13:45:00', 'Low'),
('Discharge', 'Patient P004 discharged after recovery', '2025-10-31 14:00:00', 'Medium'),
('Medication', 'Pharmacy updated medication list for P002', '2025-10-31 15:20:00', 'Low'),
('Alert', 'Critical BP alert for Patient P005', '2025-10-31 15:55:00', 'High'),
('Visit', 'Follow-up consultation completed by P009', '2025-10-31 16:30:00', 'Low'),
('Staff', 'Dr. Meena (Pediatrics) marked On Leave for next 2 days', '2025-10-31 17:00:00', 'Medium'),
('System', 'Daily backup completed successfully', '2025-10-31 23:59:00', 'Low');



 INSERT INTO department_financials (department_id, revenue, percentage)
VALUES
(1, 3200000.00, 27.50),
(2, 2500000.00, 21.50),
(3, 1800000.00, 15.50),
(4, 1200000.00, 10.30),
(5, 2100000.00, 17.80),
(6, 800000.00,  7.40);
 


INSERT INTO quality_patient_satisfaction (department_id, score, responses)
VALUES
(1, 9.1, 320),
(2, 8.7, 290),
(3, 8.9, 250),
(4, 9.4, 400),
(5, 8.6, 220),
(6, 8.8, 310);
 

INSERT INTO quality_wait_times (department_id, avg_wait, target)
VALUES
(1, 22, 25),
(2, 28, 25),
(3, 24, 25),
(4, 18, 20),
(5, 26, 25),
(6, 20, 20);
 


INSERT INTO quality_readmission_rates (department_id, rate, target)
VALUES
(1, 4.50, 5.00),
(2, 5.20, 5.00),
(3, 4.80, 5.00),
(4, 3.90, 4.50),
(5, 5.40, 5.00),
(6, 4.60, .00);
 


INSERT INTO staff_schedule (id, staff_id, date, shift, created_at, updated_at) VALUES
-- === 2025-11-01 Schedules ===
(1, 'STF001', '2025-11-01', 'Morning', NOW(), NOW()),
(2, 'STF002', '2025-11-01', 'Evening', NOW(), NOW()),
(3, 'STF003', '2025-11-01', 'Morning', NOW(), NOW()),
(4, 'STF004', '2025-11-01', 'Night', NOW(), NOW()),
(5, 'STF005', '2025-11-01', 'Night', NOW(), NOW()),
(6, 'STF011', '2025-11-01', 'Morning', NOW(), NOW()),
(7, 'STF012', '2025-11-01', 'Evening', NOW(), NOW()),
(8, 'STF013', '2025-11-01', 'Morning', NOW(), NOW()),
(9, 'STF014', '2025-11-01', 'Night', NOW(), NOW()),
(10, 'STF015', '2025-11-01', 'Morning', NOW(), NOW()),
(11, 'STF022', '2025-11-01', 'Morning', NOW(), NOW()),
(12, 'STF023', '2025-11-01', 'Evening', NOW(), NOW()),
(13, 'STF024', '2025-11-01', 'Morning', NOW(), NOW()),
(14, 'STF025', '2025-11-01', 'Night', NOW(), NOW()),
(15, 'STF026', '2025-11-01', 'Morning', NOW(), NOW()),
(16, 'D101', '2025-11-01', 'Morning', NOW(), NOW()),
(17, 'D102', '2025-11-01', 'Evening', NOW(), NOW()),
(18, 'D104', '2025-11-01', 'Night', NOW(), NOW()),
 
-- === 2025-11-02 Schedules ===
(19, 'STF006', '2025-11-02', 'Morning', NOW(), NOW()),
(20, 'STF007', '2025-11-02', 'Evening', NOW(), NOW()),
(21, 'STF008', '2025-11-02', 'Morning', NOW(), NOW()),
(22, 'STF009', '2025-11-02', 'Evening', NOW(), NOW()),
(23, 'STF010', '2025-11-02', 'Night', NOW(), NOW()),
(24, 'STF016', '2025-11-02', 'Night', NOW(), NOW()),
(25, 'STF017', '2025-11-02', 'Evening', NOW(), NOW()),
(26, 'STF018', '2025-11-02', 'Morning', NOW(), NOW()),
(27, 'STF019', '2025-11-02', 'Morning', NOW(), NOW()),
(28, 'STF020', '2025-11-02', 'Evening', NOW(), NOW()),
(29, 'STF027', '2025-11-02', 'Evening', NOW(), NOW()),
(30, 'STF028', '2025-11-02', 'Morning', NOW(), NOW()),
(31, 'STF029', '2025-11-02', 'Morning', NOW(), NOW()),
(32, 'STF030', '2025-11-02', 'Evening', NOW(), NOW()),
(33, 'STF031', '2025-11-02', 'Evening', NOW(), NOW()),
(34, 'D105', '2025-11-02', 'Morning', NOW(), NOW()),
(35, 'D106', '2025-11-02', 'Evening', NOW(), NOW()),
(36, 'D107', '2025-11-02', 'Night', NOW(), NOW()),
 
-- === 2025-11-03 Schedules ===
(37, 'STF032', '2025-11-03', 'Morning', NOW(), NOW()),
(38, 'STF033', '2025-11-03', 'Night', NOW(), NOW()),
(39, 'STF034', '2025-11-03', 'Morning', NOW(), NOW()),
(40, 'STF035', '2025-11-03', 'Morning', NOW(), NOW()),
(41, 'STF036', '2025-11-03', 'Night', NOW(), NOW()),
(42, 'STF037', '2025-11-03', 'Morning', NOW(), NOW()),
(43, 'STF038', '2025-11-03', 'Evening', NOW(), NOW()),
(44, 'STF039', '2025-11-03', 'Morning', NOW(), NOW()),
(45, 'STF040', '2025-11-03', 'Evening', NOW(), NOW()),
(46, 'D108', '2025-11-03', 'Morning', NOW(), NOW()),
(47, 'D109', '2025-11-03', 'Morning', NOW(), NOW()),
(48, 'D110', '2025-11-03', 'Morning', NOW(), NOW());
 

INSERT INTO payment_methods (id, method, amount, percentage, created_at) VALUES
(1, 'Cash', 250000.00, 25.00, NOW()),
(2, 'CreditCard', 350000.00, 35.00, NOW()),
(3, 'Insurance', 300000.00, 30.00, NOW()),
(4, 'UPI/OnlineTransfer', 80000.00, 8.00, NOW()),
(5, 'Others', 20000.00, 2.00, NOW());
