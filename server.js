// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3000;


// Enable CORS
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully.');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});