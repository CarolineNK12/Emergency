-- Create the database
CREATE DATABASE IF NOT EXISTS emergencydb;
USE emergencydb;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    phone_number INT
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
INSERT INTO Users (id, username, phone_number)
VALUES (1, 'Joe', 0123456789);

INSERT INTO Alerts (id, name, area, severity)
VALUES (1, 'Earthquake', 'Bogor', 'Magnitude 4');

INSERT INTO Questions (
    id,
    question,
    answer1,
    answer2,
    answer3,
    answer4,
    realanswer,
    successmessage
)
VALUES (
    1,
    'Oh no! You witness a car accident on the street. What is the universal emergency number to call in Indonesia?',
    '911',
    '112',
    '999',
    '000',
    '112',
    'Spot on! 112 is Indonesia''s universal SOS number. Leave 911 for the movies!'
);