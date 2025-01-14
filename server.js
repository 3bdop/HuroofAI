const multer = require("multer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const ffmpeg = require("fluent-ffmpeg");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        // Sanitize and normalize the filename to ensure it is within the uploads directory
        // const sanitizedFilename = path.basename(req.body.filename);
        // const destPath = path.join(__dirname, "uploads", sanitizedFilename);
        // console.log(destPath)
        const originalFilename = path.basename(req.body.filename);
        const sanitizedFilename = originalFilename.replace(/\.m4a$/, ".mp3");
        const destPath = path.join(__dirname, "uploads", sanitizedFilename);

        // Ensure the directory exists
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Create a temporary file to store the uploaded .m4a
        const tempFilePath = path.join(__dirname, "uploads", originalFilename);
        fs.writeFileSync(tempFilePath, req.file.buffer);

        console.log("Converting file:", tempFilePath);
        // Convert the .m4a file to .mp3 using ffmpeg
        await new Promise((resolve, reject) => {
            ffmpeg(tempFilePath)
                .toFormat("mp3")
                .on("end", () => {
                    console.log("File converted successfully:", destPath);
                    fs.unlinkSync(tempFilePath); // Delete the temporary .m4a file
                    resolve();
                })
                .on("error", (err) => {
                    console.error("Error converting file:", err);
                    reject(err);
                })
                .save(destPath); // Save the converted file as .mp3
        });

        // Save the file to the dynamic path
        // fs.writeFileSync(destPath, req.file.buffer);

        console.log("File saved at:", destPath);
        res.status(200).send("File uploaded, converted to MP3, and saved successfully.");

        // res.status(200).send("File uploaded and saved successfully.");
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
