-- ============================================================
-- Hospital Management System — Database Setup Script
-- Run this script in your MySQL client to create the database,
-- tables, and seed data needed for the application.
-- ============================================================

-- Step 1: Create the database
-- 'IF NOT EXISTS' prevents errors if you run this script twice.
CREATE DATABASE IF NOT EXISTS hospital_db;

-- Step 2: Switch to the new database
USE hospital_db;

-- ============================================================
-- Step 3: Create the 'patients' table
-- This stores every patient who registers through the frontend.
-- 'AUTO_INCREMENT' means MySQL will automatically assign a
-- unique ID to each new patient (1, 2, 3, ...).
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
    id         INT           AUTO_INCREMENT PRIMARY KEY,  -- Unique patient ID
    name       VARCHAR(100)  NOT NULL,                    -- Full name
    age        INT           NOT NULL,                    -- Age in years
    gender     VARCHAR(10)   NOT NULL,                    -- Male / Female / Other
    phone      VARCHAR(15)   NOT NULL,                    -- 10-digit phone number
    email      VARCHAR(100)  NOT NULL                     -- Email address
);

-- ============================================================
-- Step 4: Create the 'doctors' table
-- This holds the list of doctors available in the hospital.
-- We will pre-fill it with 3 sample doctors below.
-- ============================================================
CREATE TABLE IF NOT EXISTS doctors (
    id         INT           AUTO_INCREMENT PRIMARY KEY,  -- Unique doctor ID
    name       VARCHAR(100)  NOT NULL,                    -- Doctor's full name
    specialty  VARCHAR(100)  NOT NULL                     -- Area of specialization
);

-- ============================================================
-- Step 5: Create the 'appointments' table
-- Each row represents one booked appointment.
-- 'patient_id' and 'doctor_id' are FOREIGN KEYS — they
-- reference the 'id' columns in the patients and doctors
-- tables, ensuring data integrity (you can't book an
-- appointment for a patient or doctor that doesn't exist).
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
    id             INT       AUTO_INCREMENT PRIMARY KEY,  -- Unique appointment ID
    patient_id     INT       NOT NULL,                    -- Links to patients.id
    doctor_id      INT       NOT NULL,                    -- Links to doctors.id
    appointment_date DATE    NOT NULL,                    -- Date of the appointment
    appointment_time TIME    NOT NULL,                    -- Time of the appointment

    -- Foreign key constraints
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id)  REFERENCES doctors(id)
);

-- ============================================================
-- Step 6: Insert 3 sample doctors
-- These will appear in the dropdown on the appointment form.
-- ============================================================
INSERT INTO doctors (name, specialty) VALUES
    ('Dr. Ananya Sharma',  'General Medicine'),
    ('Dr. Rahul Menon',    'Cardiology'),
    ('Dr. Priya Nair',     'Pediatrics');
