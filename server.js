const multer = require("multer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

app.post("/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        // Sanitize and normalize the filename to ensure it is within the uploads directory
        const sanitizedFilename = path.basename(req.body.filename);
        const destPath = path.join(__dirname, "uploads", sanitizedFilename);
        console.log(destPath)

        // Ensure the directory exists
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Save the file to the dynamic path
        fs.writeFileSync(destPath, req.file.buffer);

        console.log("File saved at:", destPath);
        res.status(200).send("File uploaded and saved successfully.");
    } catch (err) {
        console.error("Error saving file:", err);
        res.status(500).send("Failed to save file.");
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
