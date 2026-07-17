-- Create the database
CREATE DATABASE IF NOT EXISTS emergencydb;
USE emergencydb;

-- Users table (Updated to support login & emergency contact details)
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    emergency_relation VARCHAR(50),
    emergency_phone VARCHAR(50)
);

-- Alerts table
CREATE TABLE IF NOT EXISTS Alerts (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    area VARCHAR(100),
    severity VARCHAR(50)
);

-- Questions table
CREATE TABLE IF NOT EXISTS Questions (
    id INT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer1 VARCHAR(255),
    answer2 VARCHAR(255),
    answer3 VARCHAR(255),
    answer4 VARCHAR(255),
    realanswer VARCHAR(255),
    successmessage VARCHAR(255)
);

-- Dummy data
INSERT INTO Users (id, username, email, password, emergency_relation, emergency_phone)
VALUES (1, 'Joe', 'joe@gmail.com', 'secret123', 'Brother', '08123456789');

INSERT INTO Alerts (id, name, area, severity)
VALUES (1, 'Earthquake', 'Bogor, Sentul', 'Magnitude 4'),
       (2, 'Flooding', 'Jakarta, Cilandak', 'Severe'),
       (3, 'Tsunami', 'Bali, Denpasar', 'High'),
       (4, 'Wild Fire', 'Tangerang Selatan, Alam Sutera', 'Severe'),
       (5, 'Landslide', 'Bandung, Lembang', 'Moderate'),
       (6, 'Volcanic Activity', 'Yogyakarta, Merapi', 'Warning Level 3');

-- LEVEL 1: Basics & SOS Universal Call
INSERT INTO Questions (id, question, answer1, answer2, answer3, answer4, realanswer, successmessage) VALUES
(1, 'Oh no! You witness a car accident on the street. What is the universal emergency number to call in Indonesia?', '911', '112', '999', '000', '112', 'Spot on! 112 is Indonesia''s universal SOS number. Leave 911 for the movies!'),

-- LEVEL 2: Cardiopulmonary CPR Steps
(2, 'What is the correct ratio of chest compressions to rescue breaths for high-quality adult CPR?', '15 compressions to 2 breaths', '30 compressions to 5 breaths', '30 compressions to 2 breaths', '5 compressions to 1 breath', '30 compressions to 2 breaths', 'Correct! The gold standard ratio is 30 compressions followed by 2 breaths.'),
(3, 'What depth should you aim for when performing chest compressions on an adult?', 'At least 2 inches (5 cm)', 'No more than 1 inch (2.5 cm)', 'Exactly 3 inches (7.5 cm)', 'Around 1.5 inches (4 cm)', 'At least 2 inches (5 cm)', 'Spot on! Compressions must be at least 2 inches deep to effectively pump blood.'),

-- LEVEL 3: Airway Choking Hazards
(4, 'A conscious adult is choking and cannot speak. Where should you position your hands for abdominal thrusts?', 'Directly on the breastbone', 'Slightly above the navel and below the breastbone', 'On the lower ribcage', 'Directly over the belly button', 'Slightly above the navel and below the breastbone', 'Great job! Placing your hands just above the navel forces the diaphragm upward to expel the object.'),

-- LEVEL 4: Hemorrhage & Severe Bleeding
(5, 'A victim has a deep laceration on their forearm that is spurting bright red blood. What is your immediate priority?', 'Apply a loose bandage over the wound', 'Elevate the limb above the heart without touching it', 'Apply firm, direct pressure with a clean cloth', 'Wash the wound out with running water', 'Apply firm, direct pressure with a clean cloth', 'Correct! Direct pressure is the fastest and most efficient way to control severe bleeding.'),
(6, 'If blood soaks completely through the initial dressing you applied to a severe wound, what should you do?', 'Remove the soaked dressing and start over', 'Place additional dressings right on top and keep applying pressure', 'Clean the wound with antiseptic', 'Apply a tourniquet immediately below the wound', 'Place additional dressings right on top and keep applying pressure', 'Exactly! Never remove the original dressing, as doing so tears away starting blood clots.'),

-- LEVEL 5: Preventing Trauma Shock
(7, 'A trauma victim is pale, cold, clammy, and breathing rapidly (shock). How should you position them?', 'Sit them upright in a chair', 'Lay them flat on their back and elevate legs slightly if safe', 'Place them face down', 'Keep them standing and walking around', 'Lay them flat on their back and elevate legs slightly if safe', 'Correct! Laying them flat and elevating their feet helps direct blood flow back to vital core organs.'),

-- LEVEL 6: Fainting & Syncope Care
(8, 'A coworker tells you they feel dizzy and think they are going to faint. What should you advise them to do?', 'Sit or lay down immediately on the ground', 'Drink a hot beverage rapidly', 'Stand up straight and take deep breaths', 'Walk outside into the fresh air', 'Sit or lay down immediately on the ground', 'Perfect! Getting them low to the ground early prevents sudden injuries from a fall.'),
(9, 'What is the medical term used to describe a temporary loss of consciousness caused by a fall in blood pressure?', 'Vertigo', 'Syncope', 'Stroke', 'Hypothermia', 'Syncope', 'Brilliant! Syncope is the official clinical term for fainting.'),

-- LEVEL 7: Thermal Burn Grades
(10, 'A kitchen worker spills boiling water on their arm. The skin is red and blisters are forming. What burn grade is this?', 'First-degree burn', 'Second-degree burn', 'Third-degree burn', 'Full-thickness burn', 'Second-degree burn', 'Correct! Blistering indicates a second-degree burn.'),

-- LEVEL 8: Fracture Splinting Skills
(11, 'When applying a splint to a suspected broken bone in the forearm, how should the splint be secured?', 'Tie it directly over the break point tightly', 'Secure it loose enough to let the bone move freely', 'Immobilize the joints both above and below the fracture site', 'Wrap it entirely in ice packs before tying', 'Immobilize the joints both above and below the fracture site', 'Spot on! Immobilizing the joints above and below prevents the broken bone segments from shifting.'),

-- LEVEL 9: Poisoning Poison Hazards
(12, 'You suspect someone has accidentally swallowed a toxic household cleaning chemical. What is your immediate action?', 'Induce vomiting right away', 'Give them large amounts of water to drink immediately', 'Call emergency services or poison control immediately', 'Administer activated charcoal from your kit', 'Call emergency services or poison control immediately', 'Correct! Never induce vomiting without professional guidance, as corrosive chemicals can double damage coming back up.'),
(13, 'If a toxic chemical splashes directly into someone''s eyes, how long should you flush them with clean water?', 'At least 5 minutes', 'At least 10 minutes', 'At least 20 minutes', 'Just wipe it with a clean towel', 'At least 20 minutes', 'Excellent! Continuous irrigation for at least 20 minutes is critical to dilute the contaminant.'),

-- LEVEL 10: Elite First Aid Master
(14, 'An automated external defibrillator (AED) arrives during CPR. What is the very first thing you do with it?', 'Plug in the electrode pads connector', 'Turn on the AED power switch', 'Apply the pads to the victim''s bare chest', 'Clear everyone away from the patient', 'Turn on the AED power switch', 'Correct! Turn it on first so the audio voice prompts can guide you safely through the remaining steps.'),
(15, 'What acronym is universally used to identify the warning signs of a Stroke?', 'R.I.C.E.', 'F.A.S.T.', 'P.A.S.S.', 'C.A.B.D.', 'F.A.S.T.', 'Perfect! Face, Arm, Speech, Time (F.A.S.T.) saves critical time during a stroke emergency.'),
(16, 'You are treating a heat stroke victim whose skin is hot, red, and dry. Which treatment is the most critical?', 'Provide a sugary sports beverage to sip', 'Rapidly cool the body using cold water immersion or ice packs', 'Administer aspirin', 'Cover them with a heavy blanket to sweat it out', 'Rapidly cool the body using cold water immersion or ice packs', 'Outstanding! Heat stroke is a true medical emergency; cooling their core temperature takes absolute priority.');