const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const os = require("os");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Define the path to the user's Documents folder
const documentsPath = path.join(os.homedir(), "Documents");
const patientPrintsPath = path.join(documentsPath, "Patient Prints");
const csvFilePath = path.join(documentsPath, "Patient_Data.csv");

// Ensure "Patient Prints" folder exists in the Documents folder
if (!fs.existsSync(patientPrintsPath)) {
    fs.mkdirSync(patientPrintsPath, { recursive: true });
}

// Function to save data to CSV in Documents folder
function saveToCSV(data) {
    const { name, age, address, phone, dob, doctor, healthPackages, date, time } = data;
    const dataRow = `${name},${age},${address},${phone},${dob},${doctor},${healthPackages},${date},${time}\n`;
    const headers = "Name,Age,Address,Phone Number,Date Of Birth,Doctor Consulted,Health Packages,Date,Time\n";

    // If CSV file doesn't exist, write headers
    if (!fs.existsSync(csvFilePath)) {
        fs.writeFileSync(csvFilePath, headers);
    }

    // Append the new data row to the CSV file
    fs.appendFile(csvFilePath, dataRow, (err) => {
        if (err) {
            console.error("Error writing to file", err);
        } else {
            console.log("Data saved to CSV successfully.");
        }
    });
}

// Endpoint to handle form submission and save to CSV
app.post("/submit", (req, res) => {
    saveToCSV(req.body);
    res.json({ status: "Data saved successfully" });
});

// Endpoint to generate PDF and save to CSV
app.post("/submit/generate-pdf", (req, res) => {
    const { name, age, address, phone, dob, doctor, healthPackages, date, time } = req.body;

    // Save to CSV file
    saveToCSV(req.body);

    // Initialize PDF document
    const doc = new PDFDocument();
    const pdfPath = path.join(patientPrintsPath, `${name}_PatientData.pdf`);

    // Write to file
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add content to PDF
    doc.fontSize(20).text("PILASSERY BEST CARE", { align: "center",color:"black" });
    doc.fontSize(15).text("Patient Data Form", { align: "center",color:"black" });
    doc.moveDown();
    doc.fontSize(12)
        .text(`Name: ${name}`)
        .text(`Age: ${age}`)
        .text(`Address: ${address}`)
        .text(`Phone No.: ${phone}`)
        .text(`Doctor Consulted: ${doctor}`)
        .text(`Health Packages: ${healthPackages}`)
        .text(`Date: ${date}`, { continued: true })
        .text(`   Time: ${time}`);

    // Finalize the PDF and send a response
    doc.end();
    res.json({ status: "PDF generated and data saved successfully", filePath: pdfPath });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
