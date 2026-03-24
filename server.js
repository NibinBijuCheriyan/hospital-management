// ============================================================
// Hospital Management System — Node.js Backend (server.js)
//
// This is the backend server for our Hospital Appointment
// Management System. It does three things:
//   1. Connects to a MySQL database
//   2. Serves the static frontend files (HTML/CSS/JS)
//   3. Provides API endpoints for the frontend to talk to
//
// Tech Stack:
//   - Node.js (JavaScript runtime)
//   - Express.js (web framework for routing)
//   - mysql2 (MySQL database driver)
//
// API Endpoints:
//   POST /api/patients      → Register a new patient
//   GET  /api/doctors        → Get list of all doctors
//   POST /api/appointments   → Book a new appointment
// ============================================================

// ---- Import required packages ----
// 'express' is a lightweight web framework for Node.js
const express = require("express");

// 'mysql2' is a fast MySQL driver for Node.js
const mysql = require("mysql2");

// 'path' is a built-in Node.js module for handling file paths
const path = require("path");

// ============================================================
// STEP 1: Create the Express application
// ============================================================
const app = express();

// This tells Express to parse incoming JSON request bodies.
// Without this, req.body would be undefined when the frontend
// sends JSON data via fetch().
app.use(express.json());

// ============================================================
// STEP 2: Serve static frontend files
// ============================================================
// This tells Express: "When someone visits http://localhost:8080/,
// serve the files from the ./public folder."
// So index.html, style.css, and script.js are all served
// automatically without writing separate routes for each.
app.use(express.static(path.join(__dirname, "public")));

// ============================================================
// STEP 3: Connect to the MySQL Database
// ============================================================
// createConnection() sets up a connection to our MySQL database.
//
// ⚠️  IMPORTANT: Change 'root' and 'password' below to match
//     YOUR MySQL username and password!
// ============================================================
const db = mysql.createConnection({
    host: "127.0.0.1",       // MySQL server address (localhost)
    port: 3306,              // Default MySQL port
    user: "root",            // Your MySQL username
    password: "password",    // ⚠️ CHANGE THIS to your MySQL password
    database: "hospital_db", // The database we created in setup.sql
});

// Actually connect to MySQL and check if it works
db.connect(function (err) {
    if (err) {
        console.error("❌ Failed to connect to MySQL:", err.message);
        console.error("   Make sure MySQL is running and the password in server.js is correct.");
        process.exit(1); // Stop the server if we can't connect
    }
    console.log("✅ Connected to MySQL database successfully!");
});

// ============================================================
// API ENDPOINT 1: Register a New Patient
// Route: POST /api/patients
//
// What it does:
//   1. Reads the JSON body sent from the frontend
//   2. Inserts the patient data into the MySQL 'patients' table
//   3. Returns the auto-generated Patient ID back to the frontend
// ============================================================
app.post("/api/patients", function (req, res) {
    // Read the data from the request body
    // (the frontend sends this as JSON)
    const { name, age, gender, phone, email } = req.body;

    // Check that all required fields are present
    if (!name || !age || !gender || !phone || !email) {
        return res.status(400).json({
            error: "All fields are required (name, age, gender, phone, email).",
        });
    }

    // SQL INSERT query with '?' placeholders.
    // The '?' placeholders prevent SQL injection attacks —
    // MySQL automatically escapes the values for us.
    const sql = "INSERT INTO patients (name, age, gender, phone, email) VALUES (?, ?, ?, ?, ?)";
    const values = [name, age, gender, phone, email];

    // Execute the query
    db.query(sql, values, function (err, result) {
        if (err) {
            console.error("Error inserting patient:", err.message);
            return res.status(500).json({
                error: "Failed to register patient: " + err.message,
            });
        }

        // result.insertId contains the AUTO_INCREMENT ID that
        // MySQL assigned to the new patient.
        res.json({
            message: "Patient registered successfully!",
            patientId: result.insertId,
        });
    });
});

// ============================================================
// API ENDPOINT 2: Get All Doctors
// Route: GET /api/doctors
//
// What it does:
//   1. Queries the 'doctors' table for all rows
//   2. Returns them as a JSON array to the frontend
//   (This is used to populate the Doctor dropdown)
// ============================================================
app.get("/api/doctors", function (req, res) {
    // Simple SELECT query to get all doctors
    const sql = "SELECT id, name, specialty FROM doctors";

    db.query(sql, function (err, results) {
        if (err) {
            console.error("Error fetching doctors:", err.message);
            return res.status(500).json({
                error: "Failed to fetch doctors: " + err.message,
            });
        }

        // 'results' is an array of objects, one per doctor.
        // Example: [{ id: 1, name: "Dr. Ananya Sharma", specialty: "General Medicine" }, ...]
        res.json(results);
    });
});

// ============================================================
// API ENDPOINT 3: Book an Appointment
// Route: POST /api/appointments
//
// What it does:
//   1. Reads the JSON body (patient_id, doctor_id, date, time)
//   2. Inserts a new row into the 'appointments' table
//   3. Returns a success message with the appointment ID
// ============================================================
app.post("/api/appointments", function (req, res) {
    // Read the appointment data from the request body
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    // Check that all required fields are present
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({
            error: "All fields are required (patient_id, doctor_id, appointment_date, appointment_time).",
        });
    }

    // Insert the appointment into the database.
    // The foreign key constraints in our SQL schema will
    // automatically reject appointments with invalid
    // patient_id or doctor_id values.
    const sql = "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)";
    const values = [patient_id, doctor_id, appointment_date, appointment_time];

    db.query(sql, values, function (err, result) {
        if (err) {
            console.error("Error booking appointment:", err.message);
            return res.status(500).json({
                error: "Failed to book appointment: " + err.message,
            });
        }

        res.json({
            message: "Appointment booked successfully!",
            appointmentId: result.insertId,
        });
    });
});

// ============================================================
// STEP 4: Start the server on port 8080
// ============================================================
const PORT = 8080;

app.listen(PORT, function () {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
