
// Get HTML elements
const patientForm = document.getElementById("patientForm");
const patientTable = document.getElementById("patientTable");
const searchInput = document.getElementById("searchInput");

let patients = JSON.parse(localStorage.getItem("patients")) || [];

// Save records in LocalStorage
function savePatients() {
    localStorage.setItem("patients", JSON.stringify(patients));
}

// Safe text display
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

// CREATE and UPDATE
patientForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const editIndex = document.getElementById("editIndex").value;

    const patient = {
        id: editIndex !== ""
            ? patients[Number(editIndex)].id
            : "PAT" + Date.now(),

        name: document.getElementById("name").value.trim(),
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        contact: document.getElementById("contact").value,
        disease: document.getElementById("disease").value.trim(),
        doctor: document.getElementById("doctor").value.trim()
    };

    if (editIndex === "") {

        // CREATE
        patients.push(patient);
        alert("Patient added successfully!");

    } else {

        // UPDATE
        patients[Number(editIndex)] = patient;
        alert("Patient details updated successfully!");
    }

    savePatients();
    displayPatients();

    patientForm.reset();
    resetFormMode();
});

// READ
function displayPatients(data = patients) {

    patientTable.innerHTML = "";

    if (data.length === 0) {
        document.getElementById("emptyMessage").style.display = "block";
    } else {
        document.getElementById("emptyMessage").style.display = "none";
    }

    data.forEach(function(patient) {

        const index = patients.findIndex(p => p.id === patient.id);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(patient.id)}</td>
            <td>${escapeHTML(patient.name)}</td>
            <td>${escapeHTML(patient.age)}</td>
            <td>${escapeHTML(patient.gender)}</td>
            <td>${escapeHTML(patient.contact)}</td>
            <td>${escapeHTML(patient.disease)}</td>
            <td>${escapeHTML(patient.doctor)}</td>

            <td>
                <button class="edit-btn" onclick="editPatient(${index})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deletePatient(${index})">
                    Delete
                </button>
            </td>
        `;

        patientTable.appendChild(row);
    });

    updateStatistics();
}

// UPDATE - Edit patient
function editPatient(index) {

    const patient = patients[index];

    document.getElementById("editIndex").value = index;
    document.getElementById("name").value = patient.name;
    document.getElementById("age").value = patient.age;
    document.getElementById("gender").value = patient.gender;
    document.getElementById("contact").value = patient.contact;
    document.getElementById("disease").value = patient.disease;
    document.getElementById("doctor").value = patient.doctor;

    document.getElementById("formTitle").textContent =
        "✎ Update Patient Details";

    document.getElementById("submitBtn").textContent =
        "Update Patient";

    document.getElementById("patient-form").scrollIntoView({
        behavior: "smooth"
    });
}

// DELETE
function deletePatient(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this patient?"
    );

    if (confirmDelete) {

        patients.splice(index, 1);

        savePatients();
        displayPatients();

        resetFormMode();

        alert("Patient deleted successfully!");
    }
}

// Search patients
searchInput.addEventListener("input", function() {

    const searchValue = searchInput.value.toLowerCase();

    const filteredPatients = patients.filter(function(patient) {

        return (
            patient.name.toLowerCase().includes(searchValue) ||
            patient.id.toLowerCase().includes(searchValue) ||
            patient.disease.toLowerCase().includes(searchValue) ||
            patient.doctor.toLowerCase().includes(searchValue)
        );

    });

    displayPatients(filteredPatients);
});

// Dashboard statistics
function updateStatistics() {

    document.getElementById("totalPatients").textContent =
        patients.length;

    document.getElementById("malePatients").textContent =
        patients.filter(p => p.gender === "Male").length;

    document.getElementById("femalePatients").textContent =
        patients.filter(p => p.gender === "Female").length;
}

// Reset form mode
function resetFormMode() {

    document.getElementById("editIndex").value = "";

    document.getElementById("formTitle").textContent =
        "＋ Add New Patient";

    document.getElementById("submitBtn").textContent =
        "Add Patient";
}

// Clear button
patientForm.addEventListener("reset", function() {
    resetFormMode();
});

// Display existing records when page loads
displayPatients();
