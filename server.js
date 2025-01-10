// // server.js
// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const app = express();
// const port = 3000;

// // Enable CORS
// app.use(cors());

// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// app.post('/upload', upload.single('file'), (req, res) => {
//     if (req.file) {
//         console.log('File Details:');
//         console.log('- Name:', req.file.originalname);
//         console.log('- Type:', req.file.mimetype);
//         console.log('- Size:', req.file.size, 'bytes');
//         console.log('- Saved at:', req.file.path);
//         con.filename
//     sole.log(req.fbody
//     else {
//         return res.status(400).send('No file uploaded.');
//     }

//     res.send('File uploaded successfully.');
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const app = express();
// const port = 3000;

// // Enable CORS
// app.use(cors());

// // Middleware to parse JSON body
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // Configure multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const destDir = "uploads"; // Directory where files will be saved
//         cb(null, destDir); // Set the destination directory
//     },
//     filename: (req, file, cb) => {
//         // Use the filename from req.body or default to the original name
//         console.log("DESIRED BODY: ", req.file);
//         const customName = req.body.filename2
//             ? `${req.body.filename2}${path.extname(file.originalname)}`
//             : file.originalname;
//         cb(null, customName);
//     },
// });

// // Initialize multer with the configured storage
// const upload = multer({ storage });

// // Define the upload route
// app.post("/upload", upload.single("file"), (req, res) => {
//     if (req.file) {
//         console.log("File Details:");
//         console.log("- Original Name:", req.file.originalname);
//         console.log("- Custom Name:", req.file.filename);
//         console.log("- Type:", req.file.mimetype);
//         console.log("- Size:", req.file.size, "bytes");
//         console.log("- Saved at:", req.file.path);
//         console.log(req.body.filename2);
//         res.send("File uploaded successfully.");
//     } else {
//         res.status(400).send("No file uploaded.");
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

//-------------------------------------------------------------------------

// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const express = require("express");
// const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

// app.post("/upload", upload.single("file"), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send("No file uploaded.");
//         }

//         // Get the dynamic destination path from `filename`
//         // Sanitize and normalize the filename to ensure it is within the uploads directory
//         const sanitizedFilename = path.basename(req.body.filename);
//         const destPath = path.join(__dirname, "uploads", sanitizedFilename);
//         // const destPath = req.body.filename
//         //     ? path.join(__dirname, req.body.filename)
//         //     : path.join(__dirname, "uploads");

//         // Ensure the directory exists
//         const destDir = path.dirname(destPath);
//         if (!fs.existsSync(destDir)) {
//             fs.mkdirSync(destDir, { recursive: true });
//         }

//         // Save the file to the dynamic path
//         const filePath = path.join(destDir, path.basename(req.body.filename || req.file.originalname));
//         fs.writeFileSync(filePath, req.file.buffer);

//         console.log("File saved at:", filePath);
//         res.status(200).send("File uploaded and saved successfully.");
//     } catch (err) {
//         console.error("Error saving file:", err);
//         res.status(500).send("Failed to save file.");
//     }
// });

// // Start the server
// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });


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
