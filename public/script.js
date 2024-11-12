


document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const data = getFormData();
    submitData(data);
    window.location.href = "bill.html";

});

document.getElementById("printPDF").addEventListener("click", function () {
    const data = getFormData();

    // Request PDF generation and save to CSV
    submitData(data, true);
});

function submitData(data, generatePDF = false) {
    // Save to CSV and generate PDF if requested
    fetch("/submit" + (generatePDF ? "/generate-pdf" : ""), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then((response) => {
        if (generatePDF) {
            showAlert("PDF generated and data saved successfully", true);
        } else {
            showAlert("Patient Data Added Successfully", true);
        }
        document.getElementById("userForm").reset();
    })
    .catch(error => console.error("Error:", error));
    savedata();
}

function getFormData() {
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const doctor = document.getElementById("doctor").value;

    const healthPackages = document.getElementById("healthPackages").checked ? "yes" : "no";
            
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const time = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    return { name, age, address, phone, dob, doctor, healthPackages, date: formattedDate, time };
    
}
function savedata(){
    localStorage.setItem("name", document.getElementById("name").value);
    localStorage.setItem("age", document.getElementById("age").value);
}


function showAlert(message, isSuccess) {
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;
    alertMessage.style.background = isSuccess ? "rgba(76, 175, 80, 0.8)" : "rgba(255, 69, 58, 0.8)";
    alertMessage.classList.remove("hidden");
    alertMessage.classList.add("show");

    setTimeout(() => {
        alertMessage.classList.remove("show");
        alertMessage.classList.add("hidden");
    }, 3000);
}


