# 🏥 MedCare — Setup Guide

Step-by-step instructions to get the Hospital Management System running on your machine.

---

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18+) → [Download](https://nodejs.org/)
- **MySQL** (v5.7+) → [Download](https://dev.mysql.com/downloads/mysql/)

---

## Step 1: Set Up the MySQL Database

Open your terminal (or MySQL shell) and run:

```bash
# Log into MySQL as root (it will prompt for your password)
mysql -u root -p

# Inside MySQL, run the setup script:
source C:/Users/LOQ/thasnim/hospital-management/setup.sql;

# Verify the tables were created:
USE hospital_db;
SHOW TABLES;

# You should see:
# +------------------------+
# | Tables_in_hospital_db  |
# +------------------------+
# | appointments           |
# | doctors                |
# | patients               |
# +------------------------+

# Verify the dummy doctors were inserted:
SELECT * FROM doctors;

# Exit MySQL
exit;
```

---

## Step 2: Configure the Database Password

Open `server.js` and find this section (around line 60):

```js
const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "password",    // ⚠️ CHANGE THIS
    database: "hospital_db",
});
```

Replace `"password"` with **your actual MySQL root password**.

---

## Step 3: Install Dependencies

Open a terminal in the project folder and run:

```bash
# Navigate to the project directory
cd C:\Users\LOQ\thasnim\hospital-management

# Install Express (web framework) and mysql2 (MySQL driver)
npm install express mysql2
```

---

## Step 4: Start the Server

```bash
node server.js
```

You should see:
```
✅ Connected to MySQL database successfully!
🚀 Server running at http://localhost:8080
```

---

## Step 5: Open in Browser

Open your browser and go to:

```
http://localhost:8080
```

You should see the MedCare hospital management system with:
- A **Patient Registration** form on the left
- An **Appointment Booking** form on the right (with a doctor dropdown loaded from MySQL)

---

## How to Test

1. **Register a patient** → Fill in the form and click "Register Patient". You'll see a Patient ID.
2. **Book an appointment** → Enter the Patient ID, select a doctor, pick a date/time, and click "Book Appointment".
3. **Verify in MySQL** → Run these commands in MySQL to confirm data was saved:
   ```sql
   USE hospital_db;
   SELECT * FROM patients;
   SELECT * FROM appointments;
   ```

---

## Project Structure

```
hospital-management/
├── server.js            ← Node.js backend (Express API + static files)
├── package.json         ← npm project config
├── setup.sql            ← MySQL database setup script
├── SETUP_GUIDE.md       ← This file
└── public/              ← Frontend (served by Express)
    ├── index.html       ← Main page with forms
    ├── style.css        ← Styling
    └── script.js        ← Frontend logic (Fetch API)
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find module 'express'` | Run `npm install express mysql2` in the project folder |
| `Failed to connect to MySQL` | Make sure MySQL is running: `net start mysql` |
| `Access denied for user 'root'` | Check the password in `server.js` matches your MySQL password |
| `Port 8080 already in use` | Change `PORT` in `server.js` to another number (e.g., `3000`) |
| `ER_BAD_DB_ERROR` | Run `setup.sql` first to create the `hospital_db` database |
