// Select forms
const patientForm = document.getElementById("patientForm");
const appointmentForm = document.getElementById("appointmentForm");

// Show success message
function showMessage(message, color = "#28a745") {
    let msg = document.createElement("div");
    msg.innerText = message;

    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.right = "20px";
    msg.style.background = color;
    msg.style.color = "white";
    msg.style.padding = "12px 20px";
    msg.style.borderRadius = "8px";
    msg.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    msg.style.zIndex = "1000";
    msg.style.fontSize = "14px";

    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 2500);
}

// ================= PATIENT FORM =================
patientForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("pname").value.trim();
    let age = document.getElementById("page").value.trim();
    let gender = document.getElementById("pgender").value.trim();
    let phone = document.getElementById("pphone").value.trim();
    let email = document.getElementById("pemail").value.trim();

    // Validation
    if (!name || !age || !gender || !phone || !email) {
        showMessage("❌ Please fill all fields", "#dc3545");
        return;
    }

    if (age <= 0) {
        showMessage("❌ Enter valid age", "#dc3545");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        showMessage("❌ Enter valid 10-digit phone number", "#dc3545");
        return;
    }

    if (!email.includes("@")) {
        showMessage("❌ Enter valid email", "#dc3545");
        return;
    }

    // Simulated submission
    console.log({
        name, age, gender, phone, email
    });

    showMessage("✅ Patient Registered Successfully!");

    patientForm.reset();
});

// ================= APPOINTMENT FORM =================
appointmentForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let patientId = document.getElementById("pid").value.trim();
    let doctorId = document.getElementById("did").value.trim();
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    // Validation
    if (!patientId || !doctorId || !date || !time) {
        showMessage("❌ Please fill all fields", "#dc3545");
        return;
    }

    let selectedDate = new Date(date);
    let today = new Date();
    today.setHours(0,0,0,0);

    if (selectedDate < today) {
        showMessage("❌ Cannot book past date", "#dc3545");
        return;
    }

    // Simulated submission
    console.log({
        patientId, doctorId, date, time
    });

    showMessage("✅ Appointment Booked Successfully!");

    appointmentForm.reset();
});