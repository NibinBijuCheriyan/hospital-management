// ============================================================
// Hospital Management System — Frontend JavaScript
//
// This file handles all the communication between the
// browser and our Go backend server using the Fetch API.
//
// What this file does:
//   1. Loads the list of doctors from the backend (on page load)
//   2. Sends patient registration data to the backend
//   3. Sends appointment booking data to the backend
//
// The Fetch API is a modern, built-in browser feature for
// making HTTP requests (similar to AJAX / XMLHttpRequest,
// but much cleaner and easier to use).
// ============================================================


// ============================================================
// HELPER FUNCTION: Show a toast notification
// This creates a small popup message in the top-right corner.
//
// Parameters:
//   message — The text to display
//   type    — 'success' (green) or 'error' (red)
// ============================================================
function showToast(message, type = "success") {
    // Create a new div element for the toast
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    // Add it to the page
    document.body.appendChild(toast);

    // Remove it after 3 seconds (the CSS animation handles the fade-out)
    setTimeout(() => {
        toast.remove();
    }, 3000);
}


// ============================================================
// STEP 1: LOAD DOCTORS ON PAGE LOAD
//
// When the page first opens, we need to fetch the list of
// doctors from the backend and fill the dropdown menu.
//
// We use 'DOMContentLoaded' to ensure the HTML is fully
// loaded before we try to access the <select> element.
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
    loadDoctors();
});

/**
 * Fetches the list of doctors from the backend API
 * and populates the <select> dropdown in the appointment form.
 */
async function loadDoctors() {
    // Get a reference to the <select> element in the HTML
    const doctorSelect = document.getElementById("doctorSelect");

    try {
        // Send a GET request to our backend's /api/doctors endpoint
        const response = await fetch("/api/doctors");

        // Check if the server returned a successful response
        if (!response.ok) {
            throw new Error("Server returned an error");
        }

        // Parse the JSON response body into a JavaScript array
        // The backend returns: [{ id: 1, name: "...", specialty: "..." }, ...]
        const doctors = await response.json();

        // Clear the "Loading doctors..." placeholder
        doctorSelect.innerHTML = '<option value="" disabled selected>Select a Doctor</option>';

        // Loop through each doctor and create an <option> element
        doctors.forEach(function (doctor) {
            const option = document.createElement("option");
            option.value = doctor.id;  // The value sent to backend
            option.textContent = `${doctor.name} — ${doctor.specialty}`;  // What the user sees
            doctorSelect.appendChild(option);
        });

    } catch (error) {
        // If something goes wrong (e.g., server not running),
        // show an error in the dropdown
        console.error("Failed to load doctors:", error);
        doctorSelect.innerHTML = '<option value="" disabled selected>⚠️ Could not load doctors</option>';
    }
}


// ============================================================
// STEP 2: PATIENT REGISTRATION
//
// When the user fills in the registration form and clicks
// "Register Patient", we:
//   1. Read the form values
//   2. Validate them on the client side
//   3. Send them to the backend via POST /api/patients
//   4. Display the generated Patient ID
// ============================================================

// Get a reference to the patient registration form
const patientForm = document.getElementById("patientForm");

patientForm.addEventListener("submit", async function (event) {
    // Prevent the default form submission (which would reload the page)
    event.preventDefault();

    // ---- Read form values ----
    const name   = document.getElementById("pname").value.trim();
    const age    = parseInt(document.getElementById("page").value);
    const gender = document.getElementById("pgender").value;
    const phone  = document.getElementById("pphone").value.trim();
    const email  = document.getElementById("pemail").value.trim();

    // ---- Client-side validation ----
    // Check that all fields are filled
    if (!name || !age || !gender || !phone || !email) {
        showToast("❌ Please fill all fields", "error");
        return;
    }

    // Age must be a positive number
    if (age <= 0 || age > 150) {
        showToast("❌ Please enter a valid age (1–150)", "error");
        return;
    }

    // Phone number must be exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
        showToast("❌ Phone number must be exactly 10 digits", "error");
        return;
    }

    // Basic email validation
    if (!email.includes("@")) {
        showToast("❌ Please enter a valid email address", "error");
        return;
    }

    // ---- Send data to the backend ----
    try {
        const response = await fetch("/api/patients", {
            method: "POST",
            headers: {
                // Tell the server we're sending JSON data
                "Content-Type": "application/json",
            },
            // Convert our JavaScript object into a JSON string
            body: JSON.stringify({ name, age, gender, phone, email }),
        });

        // Parse the JSON response from the backend
        const data = await response.json();

        if (response.ok) {
            // SUCCESS — Show the generated Patient ID
            showToast("✅ Patient registered successfully!");

            // Display the Patient ID in the result area
            const display = document.getElementById("patientIdDisplay");
            const idSpan = document.getElementById("generatedId");
            idSpan.textContent = data.patientId;
            display.style.display = "block";
            display.className = "result-display success";

            // Clear the form fields for the next patient
            patientForm.reset();
        } else {
            // SERVER ERROR — Show the error message
            showToast(`❌ ${data.error}`, "error");
        }

    } catch (error) {
        // NETWORK ERROR — Server might not be running
        console.error("Registration failed:", error);
        showToast("❌ Could not connect to the server", "error");
    }
});


// ============================================================
// STEP 3: BOOK APPOINTMENT
//
// When the user fills in the appointment form and clicks
// "Book Appointment", we:
//   1. Read the form values
//   2. Validate the date (can't book in the past)
//   3. Send them to the backend via POST /api/appointments
//   4. Show a success or error message
// ============================================================

// Get a reference to the appointment booking form
const appointmentForm = document.getElementById("appointmentForm");

appointmentForm.addEventListener("submit", async function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // ---- Read form values ----
    const patientId       = parseInt(document.getElementById("pid").value);
    const doctorId        = parseInt(document.getElementById("doctorSelect").value);
    const appointmentDate = document.getElementById("date").value;
    const appointmentTime = document.getElementById("time").value;

    // ---- Client-side validation ----
    if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
        showToast("❌ Please fill all fields", "error");
        return;
    }

    // Prevent booking appointments in the past
    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset time to midnight for fair comparison

    if (selectedDate < today) {
        showToast("❌ Cannot book an appointment in the past", "error");
        return;
    }

    // ---- Send data to the backend ----
    try {
        const response = await fetch("/api/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                patient_id:       patientId,
                doctor_id:        doctorId,
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
            }),
        });

        const data = await response.json();

        // Show the result in the appointment card
        const resultDiv = document.getElementById("appointmentResult");

        if (response.ok) {
            // SUCCESS
            showToast("✅ Appointment booked successfully!");
            resultDiv.style.display = "block";
            resultDiv.className = "result-display success";
            resultDiv.innerHTML = `<p>✅ Appointment #${data.appointmentId} booked successfully!</p>`;

            // Clear the form
            appointmentForm.reset();

            // Reload the doctor dropdown (so the placeholder reappears)
            loadDoctors();
        } else {
            // SERVER ERROR
            showToast(`❌ ${data.error}`, "error");
            resultDiv.style.display = "block";
            resultDiv.className = "result-display error";
            resultDiv.innerHTML = `<p>❌ ${data.error}</p>`;
        }

    } catch (error) {
        console.error("Booking failed:", error);
        showToast("❌ Could not connect to the server", "error");
    }
});
